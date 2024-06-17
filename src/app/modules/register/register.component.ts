import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AccountRequest } from '../../models/interfaces/account/CreateAccount';
import { AccountService } from '../../services/account/account.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		IconComponent,
		ReactiveFormsModule,
		RouterModule,
		LoaderComponent,
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	private emailAccount = '';
	loading = false; // Inicialmente, a página está carregando

	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService,
		private cookieService: CookieService,
		private router: Router
	) {}

	registerForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
		terms_and_conditions: [
			'',
			[Validators.required, Validators.requiredTrue],
		],
	});

	ngOnInit(): void {
		this.registerForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitRegisterForm(): void {
		this.loading = true;
		if (this.registerForm.value && this.registerForm.valid) {
			console.log(this.registerForm.value);
			this.accountService
				.registerAccount(this.registerForm.value as AccountRequest)
				.pipe(
					switchMap((response) => {
						this.cookieService.set(
							'ACCOUNT_ID',
							response.id.toString()
						);
						this.cookieService.set('ACCOUNT_EMAIL', response.email);
						this.emailAccount = response.email;
						return this.accountService.createTokenAccountActivate(
							this.emailAccount
						);
					}),
					takeUntil(this.destroy$)
				)
				.subscribe({
					next: (response) => {
						if (response) {
							this.registerForm.reset();
							this.router.navigate(['/check-your-email']);
							this.loading = false;
						}
					},
					complete: () => {
						this.loading = false;
					},
					error: (err) => {
						console.log(err);
						this.loading = false;
					},
				});
		}
	}
}
