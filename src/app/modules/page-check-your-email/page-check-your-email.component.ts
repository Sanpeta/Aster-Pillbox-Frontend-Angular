import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-page-check-your-email',
	standalone: true,
	imports: [RouterModule, LoaderComponent],
	templateUrl: './page-check-your-email.component.html',
	styleUrl: './page-check-your-email.component.css',
})
export class PageCheckYourEmailComponent {
	private destroy$ = new Subject<void>();
	public loader = false;
	public title = 'Conta Ativada';
	public description = 'Só falta entrar e começar a usar!';
	public sendedEmail = false;
	public showResendButton = false;
	private emailAccount: string | null = null;

	constructor(
		private accountActivation: AccountService,
		private cookieService: CookieService
	) {}

	ngOnInit() {
		this.emailAccount = this.cookieService.get('ACCOUNT_EMAIL');
		if (this.emailAccount) {
			this.showResendButton = true;
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
	resendEmail() {
		this.loader = true;
		this.accountActivation
			.createTokenAccountActivate(this.emailAccount!)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					console.log(response);
					this.loader = false;
					this.sendedEmail = true;
				},
				error: (err) => {
					console.log(err.error);
					this.loader = false;
					this.sendedEmail = false;
				},
			});
	}
}
