import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
	LoginRequest,
	LoginResponse,
} from '../../models/interfaces/auth/auth.interface';
import { AuthService } from '../../services/auth/auth.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, RouterModule, LoaderComponent],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	public isEmailSent = false;
	public isLoading = false;
	public returnUrl = '';

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	public readonly loginForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
		mfa_code: [''], // Campo para MFA se necessário
	});

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly authService: AuthService,
		private readonly router: Router,
		private readonly route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.loginForm.reset();

		// Capturar URL de retorno se houver
		this.returnUrl =
			this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

		// Verificar se já está logado
		if (this.authService.isLoggedIn()) {
			this.router.navigate([this.returnUrl]);
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public resendVerificationEmail(): void {
		const email = this.loginForm.get('email')?.value;

		if (!email) {
			this.showErrorDialog(
				'Erro',
				'Digite seu email para reenviar a verificação.'
			);
			return;
		}

		this.setLoadingState(true);

		this.authService
			.resendVerification({ email })
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.setLoadingState(false);
					this.isEmailSent = true;
					this.showSuccessDialog(
						'Email Enviado',
						'Um novo email de verificação foi enviado para sua caixa de entrada.'
					);
				},
				error: (error) => {
					console.error('Error resending verification email:', error);
					this.setLoadingState(false);
					this.showErrorDialog(
						'Erro',
						'Falha ao reenviar email de verificação. Tente novamente.'
					);
				},
			});
	}

	public onSubmit(): void {
		if (this.loginForm.invalid) {
			this.showValidationError();
			return;
		}

		const loginData: LoginRequest = {
			email: this.loginForm.get('email')?.value || '',
			password: this.loginForm.get('password')?.value || '',
			mfa_code: this.loginForm.get('mfa_code')?.value || undefined,
		};

		this.setLoadingState(true);

		this.authService
			.login(loginData)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => this.handleLoginSuccess(response),
				error: (error) => this.handleLoginError(error),
			});
	}

	private handleLoginSuccess(response: LoginResponse): void {
		this.setLoadingState(false);

		// Verificar se a conta está verificada
		if (!response.user.is_verified) {
			this.showUnverifiedAccountDialog();
			return;
		}

		// Login bem-sucedido
		this.loginForm.reset();
		this.router.navigate([this.returnUrl]);
	}

	private handleLoginError(error: any): void {
		console.error('Login error:', error);
		this.setLoadingState(false);

		// Mapear erros específicos
		const errorMessage = this.getErrorMessage(error.message);

		// Verificar se é erro de MFA
		if (error.message && error.message.includes('MFA')) {
			this.showMFADialog();
			return;
		}

		// Verificar se é conta não verificada
		if (error.message && error.message.includes('not verified')) {
			this.showUnverifiedAccountDialog();
			return;
		}

		this.showErrorDialog('Erro no Login', errorMessage);
	}

	private getErrorMessage(errorMessage: string): string {
		const errorMappings: { [key: string]: string } = {
			'Invalid credentials': 'Email ou senha inválidos.',
			'Account not found':
				'Conta não encontrada. Verifique o email informado.',
			'Account not verified':
				'Sua conta ainda não foi verificada. Verifique seu email.',
			'Account inactive':
				'Sua conta está inativa. Entre em contato com o suporte.',
			'Too many attempts':
				'Muitas tentativas de login. Tente novamente em alguns minutos.',
			'MFA required':
				'Código de autenticação de dois fatores é obrigatório.',
			'Invalid MFA code': 'Código de autenticação inválido.',
		};

		// Buscar mensagem correspondente ou usar padrão
		for (const [key, value] of Object.entries(errorMappings)) {
			if (errorMessage.includes(key)) {
				return value;
			}
		}

		return 'Ocorreu um erro inesperado. Tente novamente.';
	}

	private showUnverifiedAccountDialog(): void {
		this.openDialog(
			'Conta não verificada',
			'Sua conta ainda não foi verificada. Deseja reenviar o email de verificação?',
			'Reenviar Email',
			'Cancelar',
			() => this.handleResendVerification()
		);
	}

	private showMFADialog(): void {
		// Mostrar campo MFA no formulário
		this.showErrorDialog(
			'Autenticação de Dois Fatores',
			'Digite o código de autenticação de dois fatores no campo abaixo e tente novamente.'
		);

		// Aqui você pode implementar lógica para mostrar o campo MFA
		// ou redirecionar para uma página específica de MFA
	}

	private handleResendVerification(): void {
		this.resendVerificationEmail();
		this.router.navigate(['/check-your-email']);
	}

	private showValidationError(): void {
		let errorMessage = 'Corrija os seguintes erros:\n';

		if (this.loginForm.get('email')?.invalid) {
			errorMessage += '• Digite um email válido\n';
		}

		if (this.loginForm.get('password')?.invalid) {
			errorMessage += '• A senha deve ter no mínimo 8 caracteres\n';
		}

		this.showErrorDialog('Campos Inválidos', errorMessage.trim());
	}

	private showErrorDialog(title: string, message: string): void {
		this.openDialog(title, message, 'OK');
	}

	private showSuccessDialog(title: string, message: string): void {
		this.openDialog(title, message, 'OK');
	}

	private setLoadingState(loading: boolean): void {
		this.isLoading = loading;
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
			buttonTextClose: cancelText,
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

	// Método público para mostrar/ocultar campo MFA
	public get showMFAField(): boolean {
		return this.loginForm.get('mfa_code')?.value !== '' || false;
	}

	// Método para limpar campo MFA
	public clearMFAField(): void {
		this.loginForm.get('mfa_code')?.setValue('');
	}
}
