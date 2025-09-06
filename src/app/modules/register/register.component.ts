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
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import {
	NotificationPrefs,
	RegisterRequest,
	RegisterResponse,
} from '../../models/interfaces/auth/auth.interface';
import { AuthService } from '../../services/auth/auth.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { APP_CONSTANTS, FormUtils, StorageUtils } from '../../shared/constants';

// Validador personalizado para confirmação de senha
function passwordMatchValidator(
	control: AbstractControl
): { [key: string]: any } | null {
	const password = control.get('password');
	const confirmPassword = control.get('confirmPassword');

	if (!password || !confirmPassword) {
		return null;
	}

	return password.value === confirmPassword.value
		? null
		: { passwordMismatch: true };
}

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
	public passwordStrengthVisible = false;

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	public readonly registerForm = this.formBuilder.group(
		{
			email: ['', [Validators.required, Validators.email]],
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
			confirmPassword: [
				'',
				[
					Validators.required,
					Validators.minLength(
						APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH
					),
				],
			],
			terms_and_conditions: [false, [Validators.requiredTrue]],
			privacy_policy: [false, [Validators.requiredTrue]],
			// Preferências de notificação opcionais
			notificationPreferences: this.formBuilder.group({
				push: [true],
				email: [true],
				sms: [false],
				whatsapp: [false],
			}),
		},
		{ validators: passwordMatchValidator }
	);

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly authService: AuthService,
		private readonly cookieService: CookieService,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		this.registerForm.reset();
		this.setupPasswordStrengthIndicator();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private setupPasswordStrengthIndicator(): void {
		// Mostrar indicador de força da senha quando o usuário começar a digitar
		this.registerForm.get('password')?.valueChanges.subscribe((value) => {
			this.passwordStrengthVisible = !!value && value.length > 0;
		});
	}

	public onSubmit(): void {
		if (this.registerForm.invalid) {
			this.handleValidationErrors();
			return;
		}

		const formValue = this.registerForm.value;
		const notificationPrefs: NotificationPrefs = {
			push: formValue.notificationPreferences?.push || false,
			email: formValue.notificationPreferences?.email || false,
			sms: formValue.notificationPreferences?.sms || false,
			whatsapp: formValue.notificationPreferences?.whatsapp || false,
		};

		const registrationData: RegisterRequest = {
			email: formValue.email!,
			password: formValue.password!,
			confirm_password: formValue.confirmPassword!,
			notification_preferences: notificationPrefs,
		};

		this.setLoadingState(true);

		this.authService
			.register(registrationData)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => this.handleRegistrationSuccess(response),
				error: (error) => this.handleRegistrationError(error),
			});
	}

	private handleRegistrationSuccess(response: RegisterResponse): void {
		console.log('Registration successful:', response);
		this.setLoadingState(false);

		// Salvar email para uso posterior
		StorageUtils.setCookie(
			this.cookieService,
			APP_CONSTANTS.COOKIES.ACCOUNT_EMAIL,
			response.email
		);

		// Resetar formulário
		this.registerForm.reset();

		// Mostrar dialog de sucesso e navegar
		this.showSuccessDialog(response);
	}

	private handleRegistrationError(error: any): void {
		console.error('Registration error:', error);
		this.setLoadingState(false);

		// Mapear erros específicos baseados na mensagem
		const errorMessage = error.message || '';
		let title = 'Erro no cadastro';
		let message = 'Ocorreu um erro inesperado. Tente novamente.';

		if (
			errorMessage.includes('email already exists') ||
			errorMessage.includes('Email already in use')
		) {
			title = 'Email já cadastrado';
			message =
				'Este email já está em uso. Tente fazer login ou use outro email.';
		} else if (
			errorMessage.includes('invalid email') ||
			errorMessage.includes('email format')
		) {
			title = 'Email inválido';
			message = 'Verifique o formato do email e tente novamente.';
		} else if (
			errorMessage.includes('weak password') ||
			errorMessage.includes('password requirements')
		) {
			title = 'Senha muito fraca';
			message =
				'A senha não atende aos requisitos de segurança. Use uma senha mais forte.';
		} else if (
			errorMessage.includes('passwords do not match') ||
			errorMessage.includes('password confirmation')
		) {
			title = 'Senhas não coincidem';
			message = 'Verifique se as senhas são idênticas.';
		} else if (
			errorMessage.includes('validation') ||
			errorMessage.includes('Invalid request')
		) {
			title = 'Dados inválidos';
			message =
				'Verifique se todos os campos foram preenchidos corretamente.';
		} else {
			// Mapear por status HTTP se não houver mensagem específica
			switch (error.status) {
				case 400:
					title = 'Dados inválidos';
					message =
						'Verifique os dados informados e tente novamente.';
					break;
				case 409:
					title = 'Email já cadastrado';
					message =
						'Este email já está em uso. Tente fazer login ou use outro email.';
					break;
				case 422:
					title = 'Dados inválidos';
					message = 'Os dados fornecidos não atendem aos requisitos.';
					break;
				case 429:
					title = 'Muitas tentativas';
					message =
						'Aguarde alguns minutos antes de tentar novamente.';
					break;
				case 500:
					title = 'Erro interno';
					message =
						'Erro interno do servidor. Tente novamente mais tarde.';
					break;
			}
		}

		this.showErrorDialog(title, message);
	}

	private handleValidationErrors(): void {
		const emailControl = this.registerForm.get('email');
		const passwordControl = this.registerForm.get('password');
		const confirmPasswordControl = this.registerForm.get('confirmPassword');
		const termsControl = this.registerForm.get('terms_and_conditions');
		const privacyControl = this.registerForm.get('privacy_policy');

		// Prioridade de validação
		if (emailControl?.errors) {
			this.showEmailValidationError(emailControl);
		} else if (passwordControl?.errors) {
			this.showPasswordValidationError(passwordControl);
		} else if (
			confirmPasswordControl?.errors ||
			this.registerForm.hasError('passwordMismatch')
		) {
			this.showConfirmPasswordValidationError();
		} else if (termsControl?.errors) {
			this.showTermsValidationError();
		} else if (privacyControl?.errors) {
			this.showPrivacyValidationError();
		}
	}

	private showEmailValidationError(control: AbstractControl): void {
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

	private showPasswordValidationError(control: AbstractControl): void {
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
		} else if (control.hasError('weakPassword')) {
			this.showErrorDialog(
				'Senha muito fraca',
				'A senha deve ser mais forte. Use maiúsculas, minúsculas, números e símbolos.'
			);
		}
	}

	private showConfirmPasswordValidationError(): void {
		if (this.registerForm.hasError('passwordMismatch')) {
			this.showErrorDialog(
				'Senhas não coincidem',
				'A confirmação de senha deve ser idêntica à senha.'
			);
		} else {
			this.showErrorDialog(
				'Confirmação de senha obrigatória',
				'Confirme sua senha para continuar.'
			);
		}
	}

	private showTermsValidationError(): void {
		this.showErrorDialog(
			'Termos e condições',
			'Você precisa aceitar os termos e condições para criar sua conta.'
		);
	}

	private showPrivacyValidationError(): void {
		this.showErrorDialog(
			'Política de privacidade',
			'Você precisa aceitar a política de privacidade para criar sua conta.'
		);
	}

	private showSuccessDialog(response: RegisterResponse): void {
		const message = response.needs_verify
			? `Conta criada com sucesso! Enviamos um email de verificação para ${response.email}. Verifique sua caixa de entrada para ativar sua conta.`
			: `Conta criada com sucesso! Você já pode fazer login com suas credenciais.`;

		this.openDialog(
			'Cadastro realizado!',
			message,
			response.needs_verify ? 'Verificar Email' : 'Fazer Login',
			'Fechar',
			() => {
				if (response.needs_verify) {
					this.router.navigate(['/check-your-email'], {
						queryParams: { email: response.email },
					});
				} else {
					this.router.navigate(['/login']);
				}
			}
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

	// Validador personalizado para força da senha
	private passwordStrengthValidator(
		control: AbstractControl
	): { [key: string]: any } | null {
		const password = control.value;
		if (!password) return null;

		const strength = this.calculatePasswordStrength(password);

		// Exigir pelo menos força "boa" (50%)
		if (strength < 50) {
			return { weakPassword: true };
		}

		return null;
	}

	// Métodos públicos para o template
	public hasEmailError(): boolean {
		return FormUtils.hasError(this.registerForm.get('email'));
	}

	public hasPasswordError(): boolean {
		return FormUtils.hasError(this.registerForm.get('password'));
	}

	public hasConfirmPasswordError(): boolean {
		const control = this.registerForm.get('confirmPassword');
		return !!(
			FormUtils.hasError(control) ||
			(this.registerForm.hasError('passwordMismatch') && control?.touched)
		);
	}

	public hasTermsError(): boolean {
		return FormUtils.hasError(
			this.registerForm.get('terms_and_conditions')
		);
	}

	public hasPrivacyError(): boolean {
		return FormUtils.hasError(this.registerForm.get('privacy_policy'));
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
		if (control?.hasError('weakPassword')) {
			return 'A senha deve ser mais forte';
		}
		return '';
	}

	public getConfirmPasswordErrorMessage(): string {
		const control = this.registerForm.get('confirmPassword');

		if (
			this.registerForm.hasError('passwordMismatch') &&
			control?.touched
		) {
			return 'As senhas não coincidem';
		}

		if (control?.hasError('required')) {
			return 'Confirme sua senha';
		}

		return '';
	}

	public getTermsErrorMessage(): string {
		return 'Você precisa aceitar os termos e condições para continuar';
	}

	public getPrivacyErrorMessage(): string {
		return 'Você precisa aceitar a política de privacidade para continuar';
	}

	// Métodos de força da senha
	public getPasswordStrengthClass(): string {
		const password = this.registerForm.get('password')?.value || '';
		const strength = this.calculatePasswordStrength(password);

		if (strength < 25) return 'weak';
		if (strength < 50) return 'fair';
		if (strength < 75) return 'good';
		return 'strong';
	}

	public getPasswordStrengthText(): string {
		const password = this.registerForm.get('password')?.value || '';
		const strength = this.calculatePasswordStrength(password);

		if (strength < 25) return 'Muito fraca';
		if (strength < 50) return 'Fraca';
		if (strength < 75) return 'Boa';
		return 'Muito forte';
	}

	public getPasswordStrengthPercent(): number {
		const password = this.registerForm.get('password')?.value || '';
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
		const password = this.registerForm.get('password')?.value || '';

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
}
