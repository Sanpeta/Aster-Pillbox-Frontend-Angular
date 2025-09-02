import { CommonModule } from '@angular/common';
import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AccountRequest } from '../../models/interfaces/account/CreateAccount';
import { AccountService } from '../../services/account/account.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { APP_CONSTANTS, FormUtils, StorageUtils } from '../../shared/constants';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		IconComponent,
		ReactiveFormsModule,
		RouterModule,
		LoaderComponent,
		CommonModule,
		ErrorMessageComponent,
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	public isLoading = false;

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	public readonly registerForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: [
			'',
			[
				Validators.required,
				Validators.minLength(
					APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH
				),
			],
		],
		terms_and_conditions: [false, [Validators.requiredTrue]],
	});

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly accountService: AccountService,
		private readonly cookieService: CookieService,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		this.registerForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public onSubmit(): void {
		if (this.registerForm.invalid) {
			this.handleValidationErrors();
			return;
		}

		const registrationData = this.registerForm
			.value as unknown as AccountRequest;
		this.setLoadingState(true);

		this.accountService
			.registerAccount(registrationData)
			.pipe(
				switchMap((response) => {
					this.storeAccountData(response);
					return this.accountService.createTokenAccountActivate(
						response.email
					);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe({
				next: () => this.handleRegistrationSuccess(),
				error: (error) => this.handleRegistrationError(error),
				complete: () => this.setLoadingState(false),
			});
	}

	private handleRegistrationSuccess(): void {
		this.registerForm.reset();
		this.setLoadingState(false);
		this.router.navigate([APP_CONSTANTS.ROUTES.CHECK_EMAIL]);
	}

	private handleRegistrationError(error: any): void {
		console.error('Registration error:', error);
		this.setLoadingState(false);

		const errorMessages = {
			401: {
				title: 'Não Autorizado',
				message: 'Dados inválidos fornecidos.',
			},
			409: {
				title: 'Email já cadastrado',
				message:
					'Este email já está em uso. Tente fazer login ou use outro email.',
			},
			500: {
				title: 'Email já cadastrado',
				message:
					'Este email já possui uma conta. Verifique os dados e tente novamente.',
			},
			default: {
				title: 'Erro no cadastro',
				message: 'Ocorreu um erro inesperado. Tente novamente.',
			},
		};

		const errorInfo =
			errorMessages[error.status as keyof typeof errorMessages] ||
			errorMessages.default;
		this.showErrorDialog(errorInfo.title, errorInfo.message);
	}

	private handleValidationErrors(): void {
		const emailControl = this.registerForm.get('email');
		const passwordControl = this.registerForm.get('password');
		const termsControl = this.registerForm.get('terms_and_conditions');

		// Prioridade: email > senha > termos
		if (emailControl?.errors) {
			this.showEmailValidationError(emailControl);
		} else if (passwordControl?.errors) {
			this.showPasswordValidationError(passwordControl);
		} else if (termsControl?.errors) {
			this.showTermsValidationError();
		}
	}

	private showEmailValidationError(control: any): void {
		if (control.hasError('required')) {
			this.showErrorDialog(
				'Email obrigatório',
				'O campo email é obrigatório para criar sua conta.'
			);
		} else if (control.hasError('email')) {
			this.showErrorDialog(
				'Email inválido',
				'Digite um email válido para continuar.'
			);
		}
	}

	private showPasswordValidationError(control: any): void {
		if (control.hasError('required')) {
			this.showErrorDialog(
				'Senha obrigatória',
				'Você precisa definir uma senha para sua conta.'
			);
		} else if (control.hasError('minlength')) {
			this.showErrorDialog(
				'Senha muito curta',
				`A senha deve ter pelo menos ${APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH} caracteres.`
			);
		}
	}

	private showTermsValidationError(): void {
		this.showErrorDialog(
			'Termos e condições',
			'Você precisa aceitar os termos e condições para criar sua conta.'
		);
	}

	private storeAccountData(response: any): void {
		StorageUtils.setCookie(
			this.cookieService,
			APP_CONSTANTS.COOKIES.ACCOUNT_ID,
			response.id.toString()
		);
		StorageUtils.setCookie(
			this.cookieService,
			APP_CONSTANTS.COOKIES.ACCOUNT_EMAIL,
			response.email
		);
	}

	private setLoadingState(loading: boolean): void {
		this.isLoading = loading;
	}

	private showErrorDialog(title: string, message: string): void {
		this.openDialog(title, message, 'OK');
	}

	private openDialog(
		title: string,
		message: string,
		confirmText: string,
		cancelText?: string,
		onConfirm?: () => void
	): void {
		const componentRef =
			this.dialogContainer.createComponent(DialogComponent);

		componentRef.instance.data = {
			title,
			mensage: message,
			buttonTextConfirm: confirmText,
			buttonTextClose: cancelText || 'Fechar',
		};

		componentRef.instance.close.subscribe(() => {
			this.dialogContainer.clear();
		});

		componentRef.instance.confirm.subscribe(() => {
			if (onConfirm) {
				onConfirm();
			}
			this.dialogContainer.clear();
		});
	}

	// Métodos públicos para o template
	public hasEmailError(): boolean {
		return FormUtils.hasError(this.registerForm.get('email'));
	}

	public hasPasswordError(): boolean {
		return FormUtils.hasError(this.registerForm.get('password'));
	}

	public hasTermsError(): boolean {
		return FormUtils.hasError(
			this.registerForm.get('terms_and_conditions')
		);
	}

	public getEmailErrorMessage(): string {
		const control = this.registerForm.get('email');
		if (control?.hasError('required')) {
			return 'O campo email é obrigatório';
		}
		if (control?.hasError('email')) {
			return 'Digite um email válido';
		}
		return '';
	}

	public getPasswordErrorMessage(): string {
		const control = this.registerForm.get('password');
		if (control?.hasError('required')) {
			return 'O campo senha é obrigatório';
		}
		if (control?.hasError('minlength')) {
			return `A senha deve ter no mínimo ${APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH} caracteres`;
		}
		return '';
	}

	public getTermsErrorMessage(): string {
		return 'Você precisa aceitar os termos e condições para continuar';
	}
}
