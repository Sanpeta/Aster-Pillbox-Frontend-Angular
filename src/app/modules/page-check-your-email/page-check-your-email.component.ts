// page-check-your-email.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
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
	private emailAccount: string | null = null;

	constructor(
		private readonly accountService: AccountService,
		private readonly cookieService: CookieService
	) {}

	ngOnInit(): void {
		this.initializeComponent();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private initializeComponent(): void {
		this.emailAccount = StorageUtils.getCookie(
			this.cookieService,
			APP_CONSTANTS.COOKIES.ACCOUNT_EMAIL
		);

		if (this.emailAccount) {
			this.showResendButton = true;
		}
	}

	public resendEmail(): void {
		if (!this.emailAccount) {
			console.error('No email account found');
			return;
		}

		this.setLoadingState(true);

		this.accountService
			.createTokenAccountActivate(this.emailAccount)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => this.handleResendSuccess(),
				error: (error) => this.handleResendError(error),
			});
	}

	private handleResendSuccess(): void {
		console.log('Email resent successfully');
		this.setLoadingState(false);
		this.isEmailSent = true;

		// Reset success message after 5 seconds
		setTimeout(() => {
			this.isEmailSent = false;
		}, 5000);
	}

	private handleResendError(error: any): void {
		console.error('Error resending email:', error);
		this.setLoadingState(false);
		this.isEmailSent = false;

		// Here you could show error feedback to user
		// For now just log the error
	}

	private setLoadingState(loading: boolean): void {
		this.isLoading = loading;
	}
}
