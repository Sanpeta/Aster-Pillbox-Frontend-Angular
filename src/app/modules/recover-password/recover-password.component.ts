import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
	selector: 'app-recover-password',
	standalone: true,
	imports: [IconComponent, RouterModule, ReactiveFormsModule],
	templateUrl: './recover-password.component.html',
	styleUrl: './recover-password.component.css',
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	resetPassword = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});

	constructor(
		private formBuilder: FormBuilder,
		private accountService: AccountService
	) {}

	ngOnInit() {
		this.resetPassword.reset();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitResetPassword(): void {
		if (this.resetPassword.valid && this.resetPassword.value) {
			this.accountService
				.createTokenResetPassword(
					this.resetPassword.value.email as string
				)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						console.log(response);
					},
					error: (error) => {
						console.log(error);
					},
				});
		}
	}
}
