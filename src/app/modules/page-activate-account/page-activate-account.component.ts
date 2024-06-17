import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
	public title = 'Conta Ativda';
	public description = 'Só falta entrar e começar a usar!';
	private token: string | null = null;
	private accountID: string | null = null;
	private accActivateRequest: UpdateAccountActivationRequest = {
		token: '',
		account_id: 0,
	};

	constructor(
		private accountActivation: AccountService,
		private cookieService: CookieService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.token = params['token']; //Salva o valor do token
		});
		this.accountID = this.cookieService.get('ACCOUNT_ID');
		if (!this.token || !this.accountID) {
			return;
		}
		this.accActivateRequest = {
			token: this.token,
			account_id: Number(this.accountID),
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
					switch (err.error.code) {
						case 400:
							this.title = 'Token inválido';
							this.description = 'O token é inválido.';
							break;
						case 403:
							this.title = 'Não autorizado';
							this.description = 'Token Expirado.';
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
}
