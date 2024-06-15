import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { AccountRequest } from '../../models/interfaces/account/CreateAccount';
import { AccountService } from '../../services/account/account.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [IconComponent, ReactiveFormsModule, RouterModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	registerForm = this.formBuilder.group({
		email: ['', Validators.required],
		password: ['', Validators.required],
		terms: ['', Validators.required],
	});

	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService,
		private cookieService: CookieService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.registerForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitRegisterForm(): void {
		if (this.registerForm.value && this.registerForm.valid) {
			console.log(this.registerForm.value);
			this.accountService
				.registerAccount(this.registerForm.value as AccountRequest)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						if (response) {
							this.cookieService.set(
								'ACCOUNT_ID',
								response.id.toString()
							);
							this.cookieService.set(
								'ACCOUNT_EMAIL',
								response.email
							);
							this.registerForm.reset();
							this.router.navigate(['/login']);
						}
					},
					error: (err) => {
						console.log(err);
					},
				});
		}
	}
}
