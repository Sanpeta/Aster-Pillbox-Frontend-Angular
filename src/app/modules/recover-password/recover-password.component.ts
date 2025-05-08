import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
	selector: 'app-recover-password',
	standalone: true,
	imports: [
		IconComponent,
		RouterModule,
		ReactiveFormsModule,
		LoaderComponent,
	],
	templateUrl: './recover-password.component.html',
	styleUrl: './recover-password.component.css',
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	public showLoader = false;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

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
		this.showLoader = true;
		if (this.resetPassword.valid && this.resetPassword.value) {
			this.accountService
				.createTokenResetPassword(
					this.resetPassword.value.email as string
				)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						this.showLoader = false;
						this.openDialog(
							'Foi enviado um email',
							'Favor verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
							'Ok',
							'',
							() => {}
						);
					},
					error: (error) => {
						console.log(error);
						this.showLoader = false;
						switch (error.status) {
							case 400:
								this.openDialog(
									'Ocorreu um erro',
									'Favor verifique os dados informados e tente novamente.',
									'Ok',
									'Cancelar',
									() => {}
								);
								break;
							case 404:
								this.openDialog(
									'Ocorreu um erro',
									'Favor verifique os dados informados e tente novamente.',
									'Ok',
									'Cancelar',
									() => {}
								);
								break;
							default:
								this.openDialog(
									'Ocorreu um erro',
									'Favor verifique os dados informados e tente novamente.',
									'Ok',
									'Cancelar',
									() => {}
								);
								break;
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
