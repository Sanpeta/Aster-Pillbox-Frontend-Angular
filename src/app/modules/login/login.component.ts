import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { LoginAccountRequest } from '../../models/interfaces/auth/Auth';
import { AccountService } from '../../services/account/account.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		IconComponent,
		ReactiveFormsModule,
		RouterModule,
		LoaderComponent,
		DialogComponent,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	public showLoader = false;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

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
		this.showLoader = true;
		if (this.loginForm.valid && this.loginForm.value) {
			this.accountService
				.loginAccount(this.loginForm.value as LoginAccountRequest)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						if (response) {
							this.cookieService.set(
								'AUTH_TOKEN',
								response.access_token
							);
							this.cookieService.set(
								'ACCOUNT_EMAIL',
								response.account.email
							);
							this.cookieService.set(
								'ACCOUNT_ID',
								response.account.id.toString()
							);
							this.showLoader = false;
							this.loginForm.reset();
							this.router.navigate(['/dashboard']);
						}
					},
					error: (error) => {
						console.log(error);
						this.showLoader = false;
						switch (error.status) {
							case 401:
								this.openDialog(
									'Não Autorizado',
									'E-Mail ou senha inválido.',
									'Ok',
									'',
									() => {}
								);
								break;
							case 404:
								this.openDialog(
									'Email não cadastrado',
									'Favor verifique os dados informados e tente novamente.',
									'Ok',
									'',
									() => {}
								);
								break;
							default:
								this.openDialog(
									'Ocorreu um erro',
									'Favor verifique os dados informados e tente novamente.',
									'Ok',
									'',
									() => {}
								);
								break;
						}
					},
				});
		} else {
			this.showLoader = false;
			this.openDialog(
				'Campo(s) Inválidos',
				'Favor colocar um e-mail válido ou uma senha de no mínimo 8 digitos.',
				'Ok',
				'',
				() => {}
			);
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
