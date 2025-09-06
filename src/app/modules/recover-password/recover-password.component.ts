import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
	ForgotPasswordRequest,
	ForgotPasswordResponse,
} from '../../models/interfaces/auth/auth.interface';
import { AuthService } from '../../services/auth/auth.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { FormUtils } from '../../shared/constants';

@Component({
	selector: 'app-recover-password',
	standalone: true,
	imports: [
		IconComponent,
		RouterModule,
		ReactiveFormsModule,
		LoaderComponent,
	],
	templateUrl: './recover-password.component.html',
	styleUrl: './recover-password.component.css',
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	public isLoading = false;
	public isEmailSent = false;
	public requestAttempts = 0;
	public maxAttempts = 3;
	public cooldownActive = false;
	public nextRequestTime: Date | null = null;

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	public readonly resetPasswordForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly authService: AuthService,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		this.resetPasswordForm.reset();
		this.checkRequestCooldown();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private checkRequestCooldown(): void {
		const cooldownKey = 'password_reset_cooldown';
		const cooldownEnd = localStorage.getItem(cooldownKey);

		if (cooldownEnd) {
			const endTime = new Date(cooldownEnd);
			const now = new Date();

			if (now < endTime) {
				this.cooldownActive = true;
				this.nextRequestTime = endTime;
				this.startCooldownTimer();
			} else {
				localStorage.removeItem(cooldownKey);
			}
		}
	}

	private startCooldownTimer(): void {
		const timer = setInterval(() => {
			if (this.nextRequestTime) {
				const now = new Date();
				if (now >= this.nextRequestTime) {
					this.cooldownActive = false;
					this.nextRequestTime = null;
					clearInterval(timer);
				}
			}
		}, 1000);
	}

	private setCooldown(minutes: number = 5): void {
		const cooldownEnd = new Date();
		cooldownEnd.setMinutes(cooldownEnd.getMinutes() + minutes);

		const cooldownKey = 'password_reset_cooldown';
		localStorage.setItem(cooldownKey, cooldownEnd.toISOString());

		this.nextRequestTime = cooldownEnd;
		this.cooldownActive = true;
		this.startCooldownTimer();
	}

	public onSubmit(): void {
		if (this.resetPasswordForm.invalid) {
			this.handleValidationError();
			return;
		}

		if (this.cooldownActive) {
			this.showCooldownDialog();
			return;
		}

		if (this.requestAttempts >= this.maxAttempts) {
			this.showMaxAttemptsDialog();
			return;
		}

		const email = this.resetPasswordForm.value.email as string;
		this.setLoadingState(true);

		const forgotPasswordRequest: ForgotPasswordRequest = {
			email: email,
		};

		this.authService
			.forgotPassword(forgotPasswordRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => this.handleSuccess(response),
				error: (error) => this.handleError(error),
			});
	}

	private handleSuccess(response: ForgotPasswordResponse): void {
		this.setLoadingState(false);
		this.isEmailSent = true;
		this.requestAttempts++;

		// Definir cooldown progressivo
		const cooldownMinutes =
			this.requestAttempts === 1
				? 5
				: this.requestAttempts === 2
				? 10
				: 15;
		this.setCooldown(cooldownMinutes);

		this.showSuccessDialog(response);
	}

	private handleError(error: any): void {
		console.error('Password reset error:', error);
		this.setLoadingState(false);

		// Mapear erros específicos baseados na mensagem
		const errorMessage = error.message || '';
		let title = 'Erro no sistema';
		let message =
			'Não foi possível processar sua solicitação. Tente novamente.';

		if (
			errorMessage.includes('not found') ||
			errorMessage.includes('email not found')
		) {
			title = 'Email não encontrado';
			message = 'Este email não está cadastrado em nossa base de dados.';
		} else if (
			errorMessage.includes('rate limit') ||
			errorMessage.includes('too many requests')
		) {
			title = 'Muitas tentativas';
			message = 'Aguarde alguns minutos antes de tentar novamente.';
			this.setCooldown(10); // Cooldown forçado
		} else if (
			errorMessage.includes('invalid email') ||
			errorMessage.includes('email format')
		) {
			title = 'Email inválido';
			message = 'Verifique o formato do email e tente novamente.';
		} else if (
			errorMessage.includes('account inactive') ||
			errorMessage.includes('account disabled')
		) {
			title = 'Conta inativa';
			message =
				'Esta conta está inativa. Entre em contato com o suporte.';
		} else {
			// Mapear por status HTTP se não houver mensagem específica
			switch (error.status) {
				case 400:
					title = 'Dados inválidos';
					message = 'Verifique o email informado e tente novamente.';
					break;
				case 404:
					title = 'Email não encontrado';
					message =
						'Este email não está cadastrado em nossa base de dados.';
					break;
				case 429:
					title = 'Muitas tentativas';
					message =
						'Aguarde alguns minutos antes de tentar novamente.';
					this.setCooldown(10);
					break;
				case 503:
					title = 'Serviço indisponível';
					message =
						'O serviço de email está temporariamente indisponível. Tente novamente mais tarde.';
					break;
			}
		}

		this.showErrorDialog(title, message);
	}

	private handleValidationError(): void {
		const emailControl = this.resetPasswordForm.get('email');

		if (emailControl?.hasError('required')) {
			this.showErrorDialog(
				'Email obrigatório',
				'Digite seu email para recuperar a senha.'
			);
		} else if (emailControl?.hasError('email')) {
			this.showErrorDialog(
				'Email inválido',
				'Digite um email válido para continuar.'
			);
		}
	}

	private showSuccessDialog(response: ForgotPasswordResponse): void {
		const email = this.resetPasswordForm.value.email;
		this.openDialog(
			'Email enviado com sucesso!',
			response.message ||
				`Enviamos instruções para ${email}. Verifique sua caixa de entrada e siga as instruções para redefinir sua senha. Se não encontrar o email, verifique também a pasta de spam.`,
			'Entendi',
			undefined,
			() => {
				// Navegar para página de verificação de email com o email como parâmetro
				this.router.navigate(['/check-your-email'], {
					queryParams: { email: email },
				});
			}
		);
	}

	private showErrorDialog(title: string, message: string): void {
		this.openDialog(title, message, 'Tentar novamente');
	}

	private showCooldownDialog(): void {
		const timeLeft = this.nextRequestTime
			? Math.ceil(
					(this.nextRequestTime.getTime() - new Date().getTime()) /
						1000 /
						60
			  )
			: 0;

		this.openDialog(
			'Aguarde para tentar novamente',
			`Você deve aguardar ${timeLeft} minuto(s) antes de solicitar uma nova recuperação de senha.`,
			'Entendi'
		);
	}

	private showMaxAttemptsDialog(): void {
		this.openDialog(
			'Limite de tentativas atingido',
			'Você atingiu o limite máximo de tentativas de recuperação de senha. Entre em contato com o suporte se precisar de ajuda.',
			'Entrar em contato',
			'Fechar',
			() => {
				// Navegar para página de suporte
				this.router.navigate(['/support']);
			}
		);
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
		return FormUtils.hasError(this.resetPasswordForm.get('email'));
	}

	public getEmailErrorMessage(): string {
		const control = this.resetPasswordForm.get('email');

		if (control?.hasError('required')) {
			return 'O campo email é obrigatório';
		}
		if (control?.hasError('email')) {
			return 'Digite um email válido';
		}

		return '';
	}

	public get canSubmit(): boolean {
		return (
			this.resetPasswordForm.valid &&
			!this.isLoading &&
			!this.cooldownActive &&
			this.requestAttempts < this.maxAttempts
		);
	}

	public get submitButtonText(): string {
		if (this.isLoading) {
			return 'Enviando...';
		}

		if (this.cooldownActive && this.nextRequestTime) {
			const timeLeft = Math.ceil(
				(this.nextRequestTime.getTime() - new Date().getTime()) /
					1000 /
					60
			);
			return `Aguarde ${timeLeft} min`;
		}

		if (this.requestAttempts >= this.maxAttempts) {
			return 'Limite atingido';
		}

		return this.isEmailSent
			? 'Reenviar link'
			: 'Enviar link de recuperação';
	}

	public get showAttemptCounter(): boolean {
		return this.requestAttempts > 0;
	}

	public get attemptCounterText(): string {
		return `Tentativa ${this.requestAttempts}/${this.maxAttempts}`;
	}

	public get showCooldownInfo(): boolean {
		return this.cooldownActive && this.nextRequestTime !== null;
	}

	public get cooldownTimeLeft(): string {
		if (!this.nextRequestTime) return '';

		const timeLeft = this.nextRequestTime.getTime() - new Date().getTime();
		const minutes = Math.floor(timeLeft / 60000);
		const seconds = Math.floor((timeLeft % 60000) / 1000);

		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	public resetForm(): void {
		this.resetPasswordForm.reset();
		this.isEmailSent = false;
	}
}
