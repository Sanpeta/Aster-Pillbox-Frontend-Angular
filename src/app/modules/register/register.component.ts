import { CommonModule } from '@angular/common';
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
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AccountRequest } from '../../models/interfaces/account/CreateAccount';
import { AccountService } from '../../services/account/account.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
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
		CommonModule,
		ErrorMessageComponent,
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	private emailAccount = '';
	loading = false; // Inicialmente, a página está carregando
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

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
							this.loading = false;
							this.router.navigate(['/check-your-email']);
						}
					},
					complete: () => {
						this.loading = false;
					},
					error: (error) => {
						console.log(error);
						this.loading = false;
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
							case 500:
								this.openDialog(
									'Email já cadastrado',
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
			this.loading = false;
			if (this.registerForm.get('email')?.errors) {
				// Verifica os erros do campo 'email'
				if (this.registerForm.get('email')?.hasError('required')) {
					this.openDialog(
						'Email obrigatório',
						'O campo email é obrigatório.',
						'Ok',
						'',
						() => {}
					);
				}
				if (this.registerForm.get('email')?.hasError('email')) {
					this.openDialog(
						'O e-mail inserido é inválido',
						'Um e-mail válido é obrigatório',
						'Ok',
						'',
						() => {}
					);
				}
			}

			if (this.registerForm.get('password')?.errors) {
				if (this.registerForm.get('password')?.hasError('required')) {
					this.openDialog(
						'Senha é obrigatório',
						'O campo senha é obrigatório',
						'Ok',
						'',
						() => {}
					);
				}
				if (this.registerForm.get('password')?.hasError('minlength')) {
					this.openDialog(
						'Senha inválida',
						'A senha deve ter no mínimo 8 caracteres',
						'Ok',
						'',
						() => {}
					);
				}
			}

			if (this.registerForm.get('terms_and_conditions')?.errors) {
				if (
					this.registerForm
						.get('terms_and_conditions')
						?.hasError('required')
				) {
					this.openDialog(
						'Campo obrigatório',
						'Você precisa aceitar os termos e condições para continuar.',
						'Ok',
						'',
						() => {}
					);
				}
			}
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
