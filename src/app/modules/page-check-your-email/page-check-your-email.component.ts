// page-check-your-email.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import {
	RegisterResponse,
	ResendVerificationRequest,
} from '../../models/interfaces/auth/auth.interface';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { APP_CONSTANTS, StorageUtils } from '../../shared/constants';

@Component({
	selector: 'app-page-check-your-email',
	standalone: true,
	imports: [RouterModule, LoaderComponent, CommonModule],
	templateUrl: './page-check-your-email.component.html',
	styleUrls: ['./page-check-your-email.component.scss'],
})
export class PageCheckYourEmailComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	public isLoading = false;
	public pageTitle = 'Confirmação de Email';
	public pageDescription = `
    Enviamos um email para você com um link para ativar sua conta.<br>
    Verifique sua caixa de entrada ou pasta de spam e clique no link para concluir o processo.<br>
    <strong>O link expira em 24 horas.</strong>
  `;
	public isEmailSent = false;
	public showResendButton = false;
	public resendAttempts = 0;
	public maxResendAttempts = 3;
	public nextResendTime: Date | null = null;
	public resendCooldownActive = false;

	private emailAccount: string | null = null;

	constructor(
		private readonly authService: AuthService,
		private readonly cookieService: CookieService,
		private readonly route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.initializeComponent();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private initializeComponent(): void {
		// Tentar obter email dos query params primeiro
		this.route.queryParams.subscribe((params) => {
			if (params['email']) {
				this.emailAccount = params['email'];
			}
		});

		// Se não tiver nos params, tentar obter do cookie
		if (!this.emailAccount) {
			this.emailAccount = StorageUtils.getCookie(
				this.cookieService,
				APP_CONSTANTS.COOKIES.ACCOUNT_EMAIL
			);
		}

		if (this.emailAccount) {
			this.showResendButton = true;
			this.updatePageContent();
		}

		// Verificar se há cooldown ativo
		this.checkResendCooldown();
	}

	private updatePageContent(): void {
		if (this.emailAccount) {
			this.pageDescription = `
        Enviamos um email para <strong>${this.emailAccount}</strong> com um link para ativar sua conta.<br>
        Verifique sua caixa de entrada ou pasta de spam e clique no link para concluir o processo.<br>
        <strong>O link expira em 24 horas.</strong>
      `;
		}
	}

	private checkResendCooldown(): void {
		const cooldownKey = `resend_cooldown_${this.emailAccount}`;
		const cooldownEnd = localStorage.getItem(cooldownKey);

		if (cooldownEnd) {
			const endTime = new Date(cooldownEnd);
			const now = new Date();

			if (now < endTime) {
				this.resendCooldownActive = true;
				this.nextResendTime = endTime;
				this.startCooldownTimer();
			} else {
				localStorage.removeItem(cooldownKey);
			}
		}
	}

	private startCooldownTimer(): void {
		const timer = setInterval(() => {
			if (this.nextResendTime) {
				const now = new Date();
				if (now >= this.nextResendTime) {
					this.resendCooldownActive = false;
					this.nextResendTime = null;
					clearInterval(timer);
				}
			}
		}, 1000);
	}

	private setCooldown(minutes: number = 2): void {
		if (this.emailAccount) {
			const cooldownEnd = new Date();
			cooldownEnd.setMinutes(cooldownEnd.getMinutes() + minutes);

			const cooldownKey = `resend_cooldown_${this.emailAccount}`;
			localStorage.setItem(cooldownKey, cooldownEnd.toISOString());

			this.nextResendTime = cooldownEnd;
			this.resendCooldownActive = true;
			this.startCooldownTimer();
		}
	}

	public resendEmail(): void {
		if (!this.emailAccount) {
			console.error('No email account found');
			return;
		}

		if (this.resendCooldownActive) {
			console.log('Resend is on cooldown');
			return;
		}

		if (this.resendAttempts >= this.maxResendAttempts) {
			console.log('Maximum resend attempts reached');
			return;
		}

		this.setLoadingState(true);

		const resendRequest: ResendVerificationRequest = {
			email: this.emailAccount,
		};

		this.authService
			.resendVerification(resendRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => this.handleResendSuccess(response),
				error: (error) => this.handleResendError(error),
			});
	}

	private handleResendSuccess(response: RegisterResponse): void {
		console.log('Email resent successfully:', response);
		this.setLoadingState(false);
		this.isEmailSent = true;
		this.resendAttempts++;

		// Definir cooldown progressivo (2, 5, 10 minutos)
		const cooldownMinutes =
			this.resendAttempts === 1 ? 2 : this.resendAttempts === 2 ? 5 : 10;
		this.setCooldown(cooldownMinutes);

		// Reset success message after 5 seconds
		setTimeout(() => {
			this.isEmailSent = false;
		}, 5000);
	}

	private handleResendError(error: any): void {
		console.error('Error resending email:', error);
		this.setLoadingState(false);
		this.isEmailSent = false;

		// Mapear erros específicos
		let errorMessage = 'Erro ao reenviar email. Tente novamente.';

		if (error.message) {
			if (
				error.message.includes('rate limit') ||
				error.message.includes('too many requests')
			) {
				errorMessage =
					'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
				this.setCooldown(5); // 5 minutos de cooldown forçado
			} else if (
				error.message.includes('not found') ||
				error.message.includes('email not found')
			) {
				errorMessage =
					'Email não encontrado. Verifique se o email está correto.';
			} else if (
				error.message.includes('already verified') ||
				error.message.includes('already active')
			) {
				errorMessage =
					'Esta conta já está verificada. Você pode fazer login normalmente.';
			}
		}

		// Aqui você pode mostrar uma notificação de erro para o usuário
		// Por exemplo, usando um serviço de notificação
		this.showErrorMessage(errorMessage);
	}

	private showErrorMessage(message: string): void {
		// Implementar notificação de erro
		// Por exemplo, definir uma propriedade para mostrar no template
		console.error(message);

		// Você pode adicionar uma propriedade para mostrar o erro no template:
		// this.errorMessage = message;
		// setTimeout(() => { this.errorMessage = null; }, 5000);
	}

	private setLoadingState(loading: boolean): void {
		this.isLoading = loading;
	}

	// Métodos públicos para o template
	public get canResendEmail(): boolean {
		return (
			this.showResendButton &&
			!this.resendCooldownActive &&
			this.resendAttempts < this.maxResendAttempts &&
			!this.isLoading
		);
	}

	public get resendButtonText(): string {
		if (this.isLoading) {
			return 'Enviando...';
		}

		if (this.resendCooldownActive && this.nextResendTime) {
			const timeLeft = Math.ceil(
				(this.nextResendTime.getTime() - new Date().getTime()) / 1000
			);
			const minutes = Math.floor(timeLeft / 60);
			const seconds = timeLeft % 60;
			return `Aguarde ${minutes}:${seconds.toString().padStart(2, '0')}`;
		}

		if (this.resendAttempts >= this.maxResendAttempts) {
			return 'Limite de tentativas atingido';
		}

		return `Reenviar email${
			this.resendAttempts > 0
				? ` (${this.resendAttempts}/${this.maxResendAttempts})`
				: ''
		}`;
	}

	public get showMaxAttemptsWarning(): boolean {
		return this.resendAttempts >= this.maxResendAttempts;
	}

	public get showCooldownInfo(): boolean {
		return this.resendCooldownActive && this.nextResendTime !== null;
	}

	public formatEmail(email: string): string {
		if (!email) return '';

		// Ocultar parte do email para privacidade
		const [localPart, domain] = email.split('@');
		if (localPart.length <= 3) {
			return email; // Email muito curto, mostrar completo
		}

		const hiddenPart = '*'.repeat(Math.max(localPart.length - 3, 1));
		return `${localPart.substring(0, 2)}${hiddenPart}@${domain}`;
	}

	public get displayEmail(): string {
		return this.emailAccount ? this.formatEmail(this.emailAccount) : '';
	}
}
