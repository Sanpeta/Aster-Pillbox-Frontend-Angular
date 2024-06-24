import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { FormTimeInputListComponent } from '../../shared/components/form-time-input-list/form-time-input-list.component';
import { ListMedicationsComponent } from '../../shared/components/list-medications/list-medications.component';
import { MedicineCasePillboxComponent } from '../../shared/components/medicine-case-pillbox/medicine-case-pillbox.component';
import { WeekDaysSelectorComponent } from '../../shared/components/week-days-selector/week-days-selector.component';

@Component({
	selector: 'app-dashboard-update-medication',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		DialogComponent,
		MedicineCasePillboxComponent,
		WeekDaysSelectorComponent,
		FormTimeInputListComponent,
		ListMedicationsComponent,
	],
	templateUrl: './dashboard-update-medication.component.html',
	styleUrl: './dashboard-update-medication.component.css',
})
export class DashboardUpdateMedicationComponent {
	private destroy$ = new Subject<void>();
	loading = false; // Inicialmente, a página está carregando
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private formBuilder: FormBuilder,
		private cookieService: CookieService,
		private router: Router
	) {}

	medicationForm = this.formBuilder.group({
		name: ['', [Validators.required, Validators.minLength(3)]],
		quantity_pill_compartment: [0, [Validators.required]],
		quantity_pill_will_use: [0, [Validators.required]],
		pillbox: [0, [Validators.required]],
	});

	ngOnInit(): void {
		this.medicationForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitMedicationForm(): void {
		this.loading = true;
		// if (this.registerForm.value && this.registerForm.valid) {
		// 	console.log(this.registerForm.value);
		// 	this.accountService
		// 		.registerAccount(this.registerForm.value as AccountRequest)
		// 		.pipe(
		// 			switchMap((response) => {
		// 				this.cookieService.set(
		// 					'ACCOUNT_ID',
		// 					response.id.toString()
		// 				);
		// 				this.cookieService.set('ACCOUNT_EMAIL', response.email);
		// 				this.emailAccount = response.email;
		// 				return this.accountService.createTokenAccountActivate(
		// 					this.emailAccount
		// 				);
		// 			}),
		// 			takeUntil(this.destroy$)
		// 		)
		// 		.subscribe({
		// 			next: (response) => {
		// 				if (response) {
		// 					this.registerForm.reset();
		// 					this.loading = false;
		// 					this.router.navigate(['/check-your-email']);
		// 				}
		// 			},
		// 			complete: () => {
		// 				this.loading = false;
		// 			},
		// 			error: (error) => {
		// 				console.log(error);
		// 				this.loading = false;
		// 				switch (error.status) {
		// 					case 401:
		// 						this.openDialog(
		// 							'Não Autorizado',
		// 							'E-Mail ou senha inválido.',
		// 							'Ok',
		// 							'',
		// 							() => {}
		// 						);
		// 						break;
		// 					case 404:
		// 						this.openDialog(
		// 							'Email não cadastrado',
		// 							'Favor verifique os dados informados e tente novamente.',
		// 							'Ok',
		// 							'',
		// 							() => {}
		// 						);
		// 						break;
		// 					case 500:
		// 						this.openDialog(
		// 							'Email já cadastrado',
		// 							'Favor verifique os dados informados e tente novamente.',
		// 							'Ok',
		// 							'',
		// 							() => {}
		// 						);
		// 						break;
		// 					default:
		// 						this.openDialog(
		// 							'Ocorreu um erro',
		// 							'Favor verifique os dados informados e tente novamente.',
		// 							'Ok',
		// 							'',
		// 							() => {}
		// 						);
		// 						break;
		// 				}
		// 			},
		// 		});
		// }
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
