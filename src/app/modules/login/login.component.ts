import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { LoginAccountRequest } from '../../models/interfaces/auth/Auth';
import { AccountService } from '../../services/account/account.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [IconComponent, ReactiveFormsModule, RouterModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	loginForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]], // Remover o array vazio
		password: ['', [Validators.required, Validators.minLength(8)]], // Remover o array vazio
	});

	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService,
		private cookieService: CookieService,
		private router: Router
	) {}

	ngOnInit() {
		this.loginForm.reset();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitLoginForm(): void {
		console.log(this.loginForm.value);
		if (this.loginForm.valid && this.loginForm.value) {
			this.accountService
				.loginAccount(this.loginForm.value as LoginAccountRequest)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						if (response) {
							this.loginForm.reset();
							this.cookieService.set(
								'AUTH_TOKEN',
								response.access_token
							);
							this.cookieService.set(
								'ACCOUNT_ID',
								response.account.id.toString()
							);
							this.router.navigate(['/dashboard']);
						}
					},
					error: (err) => {
						console.log(err);
					},
				});
		}
	}
}
