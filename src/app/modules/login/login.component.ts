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
import { Subject, takeUntil } from 'rxjs';
import { LoginAccountRequest } from '../../models/interfaces/auth/Auth';
import { AccountService } from '../../services/account/account.service';
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

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	public readonly loginForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
	});

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly accountService: AccountService,
		private readonly cookieService: CookieService,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		this.loginForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public resendActivationEmail(): void {
		const email = this.cookieService.get('ACCOUNT_EMAIL');

		if (!email) {
			this.showErrorDialog(
				'Erro',
				'Email não encontrado. Tente fazer login novamente.'
			);
			return;
		}

		this.setLoadingState(true);

		this.accountService
			.createTokenAccountActivate(email)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.setLoadingState(false);
					this.isEmailSent = true;
				},
				error: (error) => {
					console.error('Error resending activation email:', error);
					this.setLoadingState(false);
					this.isEmailSent = false;
					this.showErrorDialog(
						'Erro',
						'Falha ao reenviar email de ativação.'
					);
				},
			});
	}

	public onSubmit(): void {
		if (this.loginForm.invalid) {
			this.showValidationError();
			return;
		}

		const loginData = this.loginForm.value as LoginAccountRequest;
		this.setLoadingState(true);

		this.accountService
			.loginAccount(loginData)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => this.handleLoginSuccess(response),
				error: (error) => this.handleLoginError(error),
			});
	}

	private handleLoginSuccess(response: any): void {
		if (!response?.account) {
			this.handleLoginError({ status: 500 });
			return;
		}

		this.cookieService.set('ACCOUNT_EMAIL', response.account.email);

		if (response.account.active) {
			this.setAuthCookies(response);
			this.navigateToDashboard();
		} else {
			this.showInactiveAccountDialog();
		}

		this.setLoadingState(false);
	}

	private handleLoginError(error: any): void {
		console.error('Login error:', error);
		this.setLoadingState(false);

		const errorMessages = {
			401: {
				title: 'Não Autorizado',
				message: 'Email ou senha inválidos.',
			},
			404: {
				title: 'Email não encontrado',
				message: 'Verifique os dados informados e tente novamente.',
			},
			default: {
				title: 'Erro no sistema',
				message: 'Ocorreu um erro inesperado. Tente novamente.',
			},
		};

		const errorInfo =
			errorMessages[error.status as keyof typeof errorMessages] ||
			errorMessages.default;
		this.showErrorDialog(errorInfo.title, errorInfo.message);
	}

	private setAuthCookies(response: any): void {
		this.cookieService.set('AUTH_TOKEN', response.access_token);
		this.cookieService.set('ACCOUNT_ID', response.account.id.toString());
	}

	private navigateToDashboard(): void {
		this.loginForm.reset();
		this.router.navigate(['/dashboard']);
	}

	private showInactiveAccountDialog(): void {
		this.openDialog(
			'Conta não ativada',
			'Solicite o reenvio do email de ativação ou entre em contato com o suporte.',
			'Solicitar Reenvio',
			'Cancelar',
			() => this.handleResendActivation()
		);
	}

	private handleResendActivation(): void {
		this.resendActivationEmail();
		this.loginForm.reset();
		this.router.navigate(['/check-your-email']);
	}

	private showValidationError(): void {
		this.showErrorDialog(
			'Campos Inválidos',
			'Informe um email válido e uma senha com no mínimo 8 caracteres.'
		);
	}

	private showErrorDialog(title: string, message: string): void {
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
			buttonTextClose: cancelText || '',
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
}
