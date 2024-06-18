import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UpdateAccountActivationRequest } from '../../models/interfaces/account-activation/UpdateAccountActivation';
import { AccountService } from '../../services/account/account.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-page-activate-account',
	standalone: true,
	imports: [RouterModule, LoaderComponent],
	templateUrl: './page-activate-account.component.html',
	styleUrl: './page-activate-account.component.css',
})
export class PageActivateAccountComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	public loader = true;
	public title = 'Conta Ativada';
	public description = 'Só falta entrar e começar a usar!';
	public showResendButton = false;
	private token: string | null = null;
	private accountID: string | null = null;
	private emailAccount: string = '';
	private accActivateRequest: UpdateAccountActivationRequest = {
		token: '',
		email: '',
	};

	constructor(
		private accountActivation: AccountService,
		private cookieService: CookieService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.token = params['token']; //Salva o valor do token
		});
		this.accountID = this.cookieService.get('ACCOUNT_ID');
		this.emailAccount = this.cookieService.get('ACCOUNT_EMAIL');
		if (!this.token || !this.accountID) {
			this.loader = false;
			this.showResendButton = true;
			this.title = 'Token inválido';
			this.description = 'O token é inválido.';
			return;
		}
		this.accActivateRequest = {
			token: this.token,
			email: this.emailAccount,
		};
		this.activateAccount();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	activateAccount(): void {
		this.accountActivation
			.activateAccount(this.accActivateRequest)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.loader = false;
					console.log(response);
				},
				error: (err) => {
					this.loader = false;
					this.showResendButton = true;
					console.log(err.error);
					switch (err.status) {
						case 400:
							this.title = 'Token inválido';
							this.description = 'O token é inválido.';
							break;
						case 403:
							this.title = 'Não autorizado';
							this.description = 'Token expirado ou já ativado.';
							break;
						case 404:
							this.title = 'Conta não encontrada';
							this.description = 'A conta não foi encontrada.';
							break;
						default:
							this.title = 'Erro';
							this.description = 'Ocorreu um erro inesperado.';
							break;
					}
					console.log(err.error);
				},
			});
	}

	resendEmail() {
		this.loader = true;
		this.accountActivation
			.createTokenAccountActivate(this.emailAccount)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					console.log(response);
					this.router.navigate(['/check-your-email']);
					this.loader = false;
				},
				error: (err) => {
					console.log(err.error);
					this.loader = false;
				},
			});
	}
}
