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
import { Subject, takeUntil } from 'rxjs';
import {
	ResetPasswordRequest,
	ResetPasswordResponse,
} from '../../models/interfaces/auth/auth.interface';
import { AuthService } from '../../services/auth/auth.service';
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
	public passwordStrengthVisible = false;

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
					this.passwordStrengthValidator.bind(this),
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
		private readonly authService: AuthService,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.resetPasswordForm.reset();
		this.extractTokenFromUrl();
		this.setupPasswordStrengthIndicator();
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
				this.showTokenError();
			}
		});
	}

	private setupPasswordStrengthIndicator(): void {
		// Mostrar indicador de força da senha quando o usuário começar a digitar
		this.resetPasswordForm
			.get('password')
			?.valueChanges.subscribe((value) => {
				this.passwordStrengthVisible = !!(value && value.length > 0);
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
		const resetRequest: ResetPasswordRequest = {
			token: this.token,
			new_password: formValue.password!,
			confirm_password: formValue.passwordConfirmation!,
		};

		this.setLoadingState(true);

		this.authService
			.resetPassword(resetRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => this.handleSuccess(response),
				error: (error) => this.handleError(error),
			});
	}

	private handleSuccess(response: ResetPasswordResponse): void {
		this.setLoadingState(false);

		this.dialogService.openSuccessDialog(
			this.dialogContainer,
			'Senha redefinida com sucesso!',
			response.message ||
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

		// Mapear erros específicos baseados na mensagem de erro
		const errorMessage = error.message || '';
		let title = 'Erro na redefinição';
		let message = 'Não foi possível alterar sua senha. Tente novamente.';

		if (
			errorMessage.includes('Invalid token') ||
			errorMessage.includes('token is invalid')
		) {
			title = 'Token inválido';
			message =
				'O token fornecido é inválido ou malformado. Solicite um novo link de recuperação.';
		} else if (
			errorMessage.includes('expired') ||
			errorMessage.includes('Token expired')
		) {
			title = 'Token expirado';
			message =
				'O token de recuperação expirou. Solicite um novo link de recuperação.';
		} else if (
			errorMessage.includes('already used') ||
			errorMessage.includes('Token already used')
		) {
			title = 'Token já utilizado';
			message =
				'Este token já foi utilizado. Solicite um novo link de recuperação se necessário.';
		} else if (errorMessage.includes('not found') || error.status === 404) {
			title = 'Conta não encontrada';
			message =
				'Não foi possível encontrar uma conta associada a este token.';
		} else if (
			errorMessage.includes('weak password') ||
			errorMessage.includes('password requirements')
		) {
			title = 'Senha muito fraca';
			message =
				'A senha não atende aos requisitos de segurança. Use uma senha mais forte.';
		} else {
			// Mapear por status HTTP se não houver mensagem específica
			switch (error.status) {
				case 400:
					title = 'Dados inválidos';
					message =
						'Os dados fornecidos são inválidos. Verifique se as senhas coincidem e atendem aos requisitos.';
					break;
				case 403:
					title = 'Token expirado';
					message =
						'O token de recuperação expirou. Solicite um novo link.';
					break;
				case 404:
					title = 'Conta não encontrada';
					message =
						'Não foi possível encontrar uma conta associada a este token.';
					break;
				case 409:
					title = 'Token já utilizado';
					message =
						'Este token já foi utilizado. Solicite um novo link se necessário.';
					break;
				case 422:
					title = 'Senha inválida';
					message = 'A senha não atende aos requisitos de segurança.';
					break;
				default:
					title = 'Erro no servidor';
					message =
						'Ocorreu um erro interno. Tente novamente mais tarde.';
					break;
			}
		}

		this.dialogService.openErrorDialog(
			this.dialogContainer,
			title,
			message,
			'Tentar Novamente'
		);
	}

	private showTokenError(): void {
		this.dialogService.openErrorDialog(
			this.dialogContainer,
			'Token inválido',
			'O link de redefinição está inválido ou expirado. Solicite um novo link de recuperação.',
			'Solicitar Novo Link',
			() => {
				this.router.navigate(['/recover-password']);
			}
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

	// Validador personalizado para força da senha
	private passwordStrengthValidator(
		control: AbstractControl
	): { [key: string]: any } | null {
		const password = control.value;
		if (!password) return null;

		const strength = this.calculatePasswordStrength(password);

		// Exigir pelo menos força "boa" (75%)
		if (strength < 50) {
			return { weakPassword: true };
		}

		return null;
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

		if (control?.hasError('weakPassword') && control?.touched) {
			return 'A senha deve ser mais forte. Use maiúsculas, minúsculas, números e símbolos.';
		}

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

	public getPasswordStrengthPercent(): number {
		const password = this.resetPasswordForm.get('password')?.value || '';
		return this.calculatePasswordStrength(password);
	}

	private calculatePasswordStrength(password: string): number {
		let strength = 0;

		// Comprimento
		if (password.length >= 8) strength += 20;
		if (password.length >= 12) strength += 10;
		if (password.length >= 16) strength += 10;

		// Variedade de caracteres
		if (/[a-z]/.test(password)) strength += 15;
		if (/[A-Z]/.test(password)) strength += 15;
		if (/[0-9]/.test(password)) strength += 15;
		if (/[^A-Za-z0-9]/.test(password)) strength += 15;

		return Math.min(strength, 100);
	}

	// Métodos para mostrar requisitos da senha
	public getPasswordRequirements(): Array<{ text: string; met: boolean }> {
		const password = this.resetPasswordForm.get('password')?.value || '';

		return [
			{
				text: 'Pelo menos 8 caracteres',
				met: password.length >= 8,
			},
			{
				text: 'Pelo menos uma letra minúscula',
				met: /[a-z]/.test(password),
			},
			{
				text: 'Pelo menos uma letra maiúscula',
				met: /[A-Z]/.test(password),
			},
			{
				text: 'Pelo menos um número',
				met: /[0-9]/.test(password),
			},
			{
				text: 'Pelo menos um símbolo (!@#$%^&*)',
				met: /[^A-Za-z0-9]/.test(password),
			},
		];
	}

	public navigateToRecoverPassword(): void {
		this.router.navigate(['/recover-password']);
	}
}
