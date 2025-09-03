// page-confirm-recover-password.component.ts
import { CommonModule } from '@angular/common';
import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UpdateAccountResetPasswordRequest } from '../../models/interfaces/account-reset-password/UpdateAccountResetPassword';
import { AccountService } from '../../services/account/account.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { APP_CONSTANTS, FormUtils } from '../../shared/constants';

// Validador personalizado para confirmação de senha
function passwordMatchValidator(
	control: AbstractControl
): { [key: string]: any } | null {
	const password = control.get('password');
	const confirmPassword = control.get('passwordConfirmation');

	if (!password || !confirmPassword) {
		return null;
	}

	return password.value === confirmPassword.value
		? null
		: { passwordMismatch: true };
}

@Component({
	selector: 'app-page-confirm-recover-password',
	standalone: true,
	imports: [ReactiveFormsModule, RouterModule, LoaderComponent, CommonModule],
	templateUrl: './page-confirm-recover-password.component.html',
	styleUrls: ['./page-confirm-recover-password.component.scss'],
})
export class PageConfirmRecoverPasswordComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();
	private token: string | null = null;
	private emailAccount: string = '';

	public isLoading = false;
	public isTokenValid = true;

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	public readonly resetPasswordForm = this.formBuilder.group(
		{
			password: [
				'',
				[
					Validators.required,
					Validators.minLength(
						APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH
					),
				],
			],
			passwordConfirmation: [
				'',
				[
					Validators.required,
					Validators.minLength(
						APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH
					),
				],
			],
		},
		{ validators: passwordMatchValidator }
	);

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly accountService: AccountService,
		private readonly cookieService: CookieService,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.resetPasswordForm.reset();
		this.extractTokenFromUrl();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private extractTokenFromUrl(): void {
		this.route.queryParams.subscribe((params) => {
			this.token = params['token'];
			this.emailAccount = params['email'];

			if (!this.token) {
				this.isTokenValid = false;
			}
		});
	}

	public onSubmit(): void {
		if (this.resetPasswordForm.invalid) {
			this.markFormGroupTouched();
			return;
		}

		if (!this.token) {
			this.showTokenError();
			return;
		}

		const formValue = this.resetPasswordForm.value;
		const resetRequest: UpdateAccountResetPasswordRequest = {
			email: this.emailAccount,
			token: this.token,
			password: formValue.password!,
		};

		this.setLoadingState(true);

		this.accountService
			.updateAccountPassword(resetRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => this.handleSuccess(),
				error: (error) => this.handleError(error),
			});
	}

	private handleSuccess(): void {
		this.setLoadingState(false);

		this.dialogService.openSuccessDialog(
			this.dialogContainer,
			'Senha redefinida com sucesso!',
			'Sua senha foi alterada. Agora você pode fazer login com sua nova senha.',
			'Fazer Login',
			() => {
				this.router.navigate(['/login']);
			}
		);
	}

	private handleError(error: any): void {
		console.error('Password reset error:', error);
		this.setLoadingState(false);

		const errorMessages = {
			409: {
				title: 'Token já utilizado',
				message:
					'O token pode ter expirado ou já ter sido utilizado. Solicite um novo token para redefinir sua senha.',
			},
			400: {
				title: 'Token inválido',
				message: 'O token fornecido é inválido ou malformado.',
			},
			404: {
				title: 'Conta não encontrada',
				message:
					'Não foi possível encontrar uma conta associada a este email.',
			},
			default: {
				title: 'Erro na redefinição',
				message:
					'Não foi possível alterar sua senha. O token pode ter expirado.',
			},
		};

		const errorInfo =
			errorMessages[error.status as keyof typeof errorMessages] ||
			errorMessages.default;

		this.dialogService.openErrorDialog(
			this.dialogContainer,
			errorInfo.title,
			errorInfo.message
		);
	}

	private showTokenError(): void {
		this.dialogService.openErrorDialog(
			this.dialogContainer,
			'Token inválido',
			'O link de redefinição está inválido ou expirado. Solicite um novo link.'
		);
	}

	private markFormGroupTouched(): void {
		Object.keys(this.resetPasswordForm.controls).forEach((key) => {
			const control = this.resetPasswordForm.get(key);
			control?.markAsTouched();
		});
	}

	private setLoadingState(loading: boolean): void {
		this.isLoading = loading;
	}

	// Métodos públicos para o template
	public hasPasswordError(): boolean {
		return FormUtils.hasError(this.resetPasswordForm.get('password'));
	}

	public hasConfirmPasswordError(): boolean {
		const control = this.resetPasswordForm.get('passwordConfirmation');
		return !!(
			FormUtils.hasError(control) ||
			(this.resetPasswordForm.hasError('passwordMismatch') &&
				control?.touched)
		);
	}

	public getPasswordErrorMessage(): string {
		const control = this.resetPasswordForm.get('password');
		return FormUtils.getErrorMessage(control);
	}

	public getConfirmPasswordErrorMessage(): string {
		const control = this.resetPasswordForm.get('passwordConfirmation');

		if (
			this.resetPasswordForm.hasError('passwordMismatch') &&
			control?.touched
		) {
			return 'As senhas não coincidem';
		}

		return FormUtils.getErrorMessage(control);
	}

	public getPasswordStrengthClass(): string {
		const password = this.resetPasswordForm.get('password')?.value || '';
		const strength = this.calculatePasswordStrength(password);

		if (strength < 25) return 'weak';
		if (strength < 50) return 'fair';
		if (strength < 75) return 'good';
		return 'strong';
	}

	public getPasswordStrengthText(): string {
		const password = this.resetPasswordForm.get('password')?.value || '';
		const strength = this.calculatePasswordStrength(password);

		if (strength < 25) return 'Muito fraca';
		if (strength < 50) return 'Fraca';
		if (strength < 75) return 'Boa';
		return 'Muito forte';
	}

	private calculatePasswordStrength(password: string): number {
		let strength = 0;

		if (password.length >= 8) strength += 25;
		if (password.length >= 12) strength += 10;
		if (/[a-z]/.test(password)) strength += 15;
		if (/[A-Z]/.test(password)) strength += 15;
		if (/[0-9]/.test(password)) strength += 15;
		if (/[^A-Za-z0-9]/.test(password)) strength += 20;

		return Math.min(strength, 100);
	}
}
