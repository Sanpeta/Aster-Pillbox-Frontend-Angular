import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UpdateAccountResetPasswordRequest } from '../../models/interfaces/account-reset-password/UpdateAccountResetPassword';
import { AccountService } from '../../services/account/account.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-page-confirm-recover-password',
	standalone: true,
	imports: [ReactiveFormsModule, RouterModule, LoaderComponent],
	templateUrl: './page-confirm-recover-password.component.html',
	styleUrl: './page-confirm-recover-password.component.css',
})
export class PageConfirmRecoverPasswordComponent {
	private destroy$ = new Subject<void>();
	public loader = true;
	private token: string | null = null;
	private accountID: string | null = null;
	private emailAccount: string = '';
	private accUpdateResetPasswordRequest: UpdateAccountResetPasswordRequest = {
		token: '',
		account_id: 0,
		password: '',
	};

	resetPasswordForm = this.formBuilder.group({
		password: ['', [Validators.required, Validators.minLength(8)]],
		passwordConfirmation: [
			'',
			[Validators.required, Validators.minLength(8)],
		],
	});

	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService,
		private cookieService: CookieService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		this.resetPasswordForm.reset();
		this.route.queryParams.subscribe((params) => {
			this.token = params['token']; //Salva o valor do token
		});
		this.accountID = this.cookieService.get('ACCOUNT_ID');
		this.emailAccount = this.cookieService.get('ACCOUNT_EMAIL');
		if (!this.token || !this.accountID) {
			this.loader = false;
			return;
		}
		this.accUpdateResetPasswordRequest = {
			token: this.token,
			account_id: Number(this.accountID),
			password: '',
		};
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitResetPasswordForm(): void {
		if (
			this.resetPasswordForm.valid &&
			this.resetPasswordForm.value.password ===
				this.resetPasswordForm.value.passwordConfirmation &&
			this.resetPasswordForm.value
		) {
			this.accUpdateResetPasswordRequest.password =
				this.resetPasswordForm.value.password!;
			this.accountService
				.updateAccountPassword(this.accUpdateResetPasswordRequest)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						this.loader = false;
						console.log(response);
						this.router.navigate(['/login']);
					},
					error: (err) => {
						this.loader = false;
						console.log(err.error.code);
						console.log(err.error);
					},
				});
		}
	}
}
