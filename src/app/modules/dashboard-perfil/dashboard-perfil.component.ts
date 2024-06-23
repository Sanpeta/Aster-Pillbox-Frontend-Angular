import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { SidenavDashboardComponent } from '../../shared/components/sidenav-dashboard/sidenav-dashboard.component';
import { SidenavTitleDashboardComponent } from '../../shared/components/sidenav-title-dashboard/sidenav-title-dashboard.component';
import { ToolbarDashboardComponent } from '../../shared/components/toolbar-dashboard/toolbar-dashboard.component';

@Component({
	selector: 'app-dashboard-perfil',
	standalone: true,
	imports: [
		ToolbarDashboardComponent,
		SidenavTitleDashboardComponent,
		SidenavDashboardComponent,
		DashboardLayoutComponent,
		ReactiveFormsModule,
		FormInputComponent,
	],
	templateUrl: './dashboard-perfil.component.html',
	styleUrl: './dashboard-perfil.component.css',
})
export class DashboardPerfilComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	loading = false; // Inicialmente, a página está carregando
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private formBuilder: FormBuilder,
		private cookieService: CookieService,
		private router: Router
	) {}

	perfilForm = this.formBuilder.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		cpfOrAIdNumber: ['', [Validators.required]],
		phone: ['', [Validators.required]],
		date: ['', [Validators.required]],
		genre: ['', [Validators.required]],
		bloodType: ['', [Validators.required]],
		weight: ['', [Validators.required]],
		height: ['', [Validators.required]],
		needACaretaker: [false, [Validators.required]],
		screenForElder: [false, [Validators.required]],
	});

	ngOnInit(): void {
		this.perfilForm.reset();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitPerfilForm(): void {
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
