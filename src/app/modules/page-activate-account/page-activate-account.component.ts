// page-activate-account.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
	ResendVerificationRequest,
	VerifyEmailRequest,
	VerifyEmailResponse,
} from '../../models/interfaces/auth/auth.interface';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

interface ActivationState {
	icon: string;
	title: string;
	description: string;
	type: 'loading' | 'success' | 'error';
	showResendButton?: boolean;
	showLoginButton?: boolean;
	showCloseButton?: boolean;
}

@Component({
	selector: 'app-page-activate-account',
	standalone: true,
	imports: [RouterModule, LoaderComponent, CommonModule],
	templateUrl: './page-activate-account.component.html',
	styleUrls: ['./page-activate-account.component.scss'],
})
export class PageActivateAccountComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	public isLoading = true;
	public activationProgress = 1;
	public isMobile = false;

	private token: string | null = null;
	private emailAccount = '';

	// Estados possíveis da página
	private readonly states = {
		loading: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
			title: 'Ativando sua conta...',
			description: 'Aguarde enquanto validamos e ativamos sua conta.',
			type: 'loading' as const,
		},
		success: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>`,
			title: 'Conta Ativada com Sucesso!',
			description:
				'Parabéns! Sua conta foi ativada. Agora você pode fazer login e começar a usar o Aster Pillbox.',
			type: 'success' as const,
			showLoginButton: true,
		},
		successMobile: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>`,
			title: 'Conta Ativada!',
			description:
				'Sua conta foi ativada com sucesso. Volte para o aplicativo e faça login.',
			type: 'success' as const,
			showCloseButton: true,
		},
		tokenInvalid: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>`,
			title: 'Token Inválido',
			description:
				'O token fornecido é inválido ou malformado. Solicite um novo email de verificação.',
			type: 'error' as const,
			showResendButton: true,
		},
		tokenExpired: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
			title: 'Token Expirado',
			description:
				'O token de ativação expirou ou já foi utilizado. Solicite um novo email de verificação.',
			type: 'error' as const,
			showResendButton: true,
		},
		accountNotFound: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>`,
			title: 'Conta Não Encontrada',
			description:
				'Não foi possível encontrar uma conta associada a este token.',
			type: 'error' as const,
			showResendButton: true,
		},
		accountAlreadyActive: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
			title: 'Conta Já Ativada',
			description:
				'Sua conta já está ativa. Você pode fazer login normalmente.',
			type: 'success' as const,
			showLoginButton: true,
		},
		genericError: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
			title: 'Erro na Ativação',
			description:
				'Ocorreu um erro inesperado durante a ativação da conta. Tente novamente mais tarde.',
			type: 'error' as const,
			showResendButton: true,
		},
		noToken: {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 3rem; height: 3rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m0 0l3-3m-3 3l-4.242-4.242" />
      </svg>`,
			title: 'Link Inválido',
			description:
				'O link de ativação está inválido. Solicite um novo email de ativação.',
			type: 'error' as const,
			showResendButton: true,
		},
	} as const;

	public currentState: ActivationState = this.states.loading;

	constructor(
		private readonly authService: AuthService,
		private readonly route: ActivatedRoute,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		this.extractParametersFromUrl();
		this.startActivationProcess();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private extractParametersFromUrl(): void {
		this.route.queryParams.subscribe((params) => {
			this.token = params['token'];
			this.emailAccount = params['email'];
			this.isMobile = params['is_mobile'] === 'true';
		});
	}

	private startActivationProcess(): void {
		if (!this.token) {
			this.handleNoToken();
			return;
		}

		// Simular progresso da ativação
		this.simulateActivationProgress();
		this.activateAccount();
	}

	private simulateActivationProgress(): void {
		setTimeout(() => {
			this.activationProgress = 2;
		}, 1000);

		setTimeout(() => {
			this.activationProgress = 3;
		}, 2000);
	}

	private activateAccount(): void {
		const verifyEmailRequest: VerifyEmailRequest = {
			token: this.token!,
		};

		this.authService
			.verifyEmail(verifyEmailRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => this.handleActivationSuccess(response),
				error: (error) => this.handleActivationError(error),
			});
	}

	private handleActivationSuccess(response: VerifyEmailResponse): void {
		console.log('Account activated successfully:', response);
		this.setLoadingState(false);

		// Verificar se a conta já estava ativa ou foi ativada agora
		if (response.message.includes('already')) {
			this.currentState = this.states.accountAlreadyActive;
		} else {
			this.currentState = this.isMobile
				? this.states.successMobile
				: this.states.success;
		}
	}

	private handleActivationError(error: any): void {
		console.error('Activation error:', error);
		this.setLoadingState(false);

		// Mapear erros específicos baseados na mensagem de erro
		const errorMessage = error.message || '';

		if (
			errorMessage.includes('Invalid token') ||
			errorMessage.includes('token is invalid')
		) {
			this.currentState = this.states.tokenInvalid;
		} else if (
			errorMessage.includes('expired') ||
			errorMessage.includes('Token expired')
		) {
			this.currentState = this.states.tokenExpired;
		} else if (errorMessage.includes('not found') || error.status === 404) {
			this.currentState = this.states.accountNotFound;
		} else if (
			errorMessage.includes('already verified') ||
			errorMessage.includes('already active')
		) {
			this.currentState = this.states.accountAlreadyActive;
		} else {
			// Mapear por status HTTP se não houver mensagem específica
			switch (error.status) {
				case 400:
					this.currentState = this.states.tokenInvalid;
					break;
				case 403:
					this.currentState = this.states.tokenExpired;
					break;
				case 404:
					this.currentState = this.states.accountNotFound;
					break;
				case 409:
					this.currentState = this.states.accountAlreadyActive;
					break;
				default:
					this.currentState = this.states.genericError;
					break;
			}
		}
	}

	private handleNoToken(): void {
		this.setLoadingState(false);
		this.currentState = this.states.noToken;
	}

	public resendEmail(): void {
		if (!this.emailAccount) {
			console.error('No email account found for resending');
			// Se não tiver email, redirecionar para página de registro
			this.router.navigate(['/register']);
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

	private handleResendSuccess(response: any): void {
		console.log('Email resent successfully:', response);
		this.setLoadingState(false);

		// Navegar para página de verificação de email
		this.router.navigate(['/check-your-email'], {
			queryParams: { email: this.emailAccount },
		});
	}

	private handleResendError(error: any): void {
		console.error('Error resending email:', error);
		this.setLoadingState(false);

		// Mostrar estado de erro mas manter a opção de tentar novamente
		this.currentState = {
			...this.currentState,
			description: `${this.currentState.description} Erro ao reenviar email: ${error.message}`,
			showResendButton: true,
		};
	}

	public navigateToLogin(): void {
		this.router.navigate(['/login']);
	}

	public closePage(): void {
		if (window.opener) {
			window.close();
		} else {
			// Fallback para quando não é uma janela popup
			this.router.navigate(['/']);
		}
	}

	private setLoadingState(loading: boolean): void {
		this.isLoading = loading;
	}

	// Getter para verificar se deve mostrar o botão de login
	public get showLoginButton(): boolean {
		return this.currentState.showLoginButton === true;
	}

	// Getter para verificar se deve mostrar o botão de reenvio
	public get showResendButton(): boolean {
		return this.currentState.showResendButton === true;
	}

	// Getter para verificar se deve mostrar o botão de fechar
	public get showCloseButton(): boolean {
		return this.currentState.showCloseButton === true;
	}

	// Getter para o ícone do estado atual
	public get currentIcon(): string {
		return this.currentState.icon;
	}

	// Getter para o título do estado atual
	public get currentTitle(): string {
		return this.currentState.title;
	}

	// Getter para a descrição do estado atual
	public get currentDescription(): string {
		return this.currentState.description;
	}

	// Getter para o tipo do estado atual
	public get currentType(): string {
		return this.currentState.type;
	}
}
