import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UpdateAccountResetPasswordRequest } from '../../models/interfaces/account-reset-password/UpdateAccountResetPassword';
import { AccountService } from '../../services/account/account.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-page-confirm-recover-password',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		RouterModule,
		LoaderComponent,
		DialogComponent,
		LoaderComponent,
	],
	templateUrl: './page-confirm-recover-password.component.html',
	styleUrl: './page-confirm-recover-password.component.css',
})
export class PageConfirmRecoverPasswordComponent {
	private destroy$ = new Subject<void>();
	private token: string | null = null;
	private accountID: string | null = null;
	private emailAccount: string = '';
	private accUpdateResetPasswordRequest: UpdateAccountResetPasswordRequest = {
		token: '',
		account_id: 0,
		password: '',
	};
	public showLoader = false;

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

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
			this.showLoader = false;
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
		this.showLoader = true;
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
						this.showLoader = false;
						console.log(response);
						this.openDialog(
							'Sucesso',
							'Sua senha foi alterada com sucesso!',
							'Continuar',
							'',
							() => {
								this.router.navigate(['/login']);
							}
						);
					},
					error: (err) => {
						this.showLoader = false;
						console.log(err.error.code);
						console.log(err.error);
						switch (err.status) {
							case 409:
								this.openDialog(
									'Token já utilizado',
									'O token pode ter expirado ou já ter sido utilizado. Por favor, solicite um novo token para redefinir sua senha.',
									'Ok',
									'Cancelar',
									() => {}
								);
								break;
							default:
								this.openDialog(
									'Erro',
									'Não foi possível alterar sua senha! Token expirado ou inválido.',
									'Continuar'
								);
						}
					},
				});
		}
	}

	openDialog(
		title: string,
		mensage: string,
		buttonTextConfirm: string,
		buttonTextClose?: any | undefined,
		funcConfirmButton?: any | null
	): void {
		const componentRef =
			this.dialogContainer.createComponent(DialogComponent);

		componentRef.instance.data = {
			title: title,
			mensage: mensage,
			buttonTextConfirm: buttonTextConfirm,
			buttonTextClose: buttonTextClose,
		};

		componentRef.instance.close.subscribe(() => {
			this.dialogContainer.clear(); // Fecha o diálogo
		});

		componentRef.instance.confirm.subscribe(() => {
			// Ação a ser executada se o usuário clicar em "Continuar"
			if (funcConfirmButton) {
				funcConfirmButton();
			}
		});
	}
}
