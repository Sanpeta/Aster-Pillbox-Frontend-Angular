import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UpdateCaseRequest } from '../../models/interfaces/case/UpdateCase';
import { CaseService } from '../../services/case/case.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { MedicineCasePillboxComponent } from '../../shared/components/medicine-case-pillbox/medicine-case-pillbox.component';

@Component({
	selector: 'app-dashboard-update-pillbox',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		DialogComponent,
		MedicineCasePillboxComponent,
		RouterModule,
		LoaderComponent,
	],
	templateUrl: './dashboard-update-pillbox.component.html',
	styleUrl: './dashboard-update-pillbox.component.css',
})
export class DashboardUpdatePillboxComponent {
	private destroy$ = new Subject<void>();
	private pillboxID: number = 0;
	loading = false;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private formBuilder: FormBuilder,
		private caseService: CaseService,
		private cookieService: CookieService,
		private activeRoute: ActivatedRoute,
		private router: Router
	) {}

	pillboxForm = this.formBuilder.group({
		mac_address: [''],
		case_name: ['', [Validators.required, Validators.minLength(3)]],
		row_size: [0, [Validators.required]],
		column_size: [0, [Validators.required]],
		status: [true, [Validators.required]],
	});

	ngOnInit(): void {
		this.activeRoute.params.subscribe((params) => {
			this.pillboxID = params['id'];
			console.log('ID do pillbox:', this.pillboxID);
		});
		this.caseService
			.getCase(this.pillboxID)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (value) => {
					if (value) {
						console.log(value);
						this.pillboxForm.patchValue(value);
						this.loading = false;
					}
				},
				error: (error) => {
					console.log(error);
					this.loading = false;
				},
				complete: () => {
					this.loading = false;
				},
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitPillboxForm(): void {
		this.loading = true;
		console.log(this.pillboxForm.value);
		if (this.pillboxForm.value && this.pillboxForm.valid) {
			const pillbox: UpdateCaseRequest = {
				id: parseInt(this.pillboxID.toString()),
				mac_address: this.pillboxForm.value.mac_address ?? '',
				case_name: this.pillboxForm.value.case_name!,
				row_size: this.pillboxForm.value.row_size!,
				column_size: this.pillboxForm.value.column_size!,
				status: this.pillboxForm.value.status!,
			};

			this.caseService
				.updateCase(pillbox)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						if (response) {
							this.loading = false;
							this.openDialog(
								'Foi alterado com sucesso',
								'Agora você pode adicionar medicamentos ao case.',
								'Ok',
								'',
								() => {}
							);
						}
					},
					complete: () => {
						this.loading = false;
					},
					error: (error) => {
						console.log(error);
						this.loading = false;
						switch (error.status) {
							case 400:
								this.openDialog(
									'Favor verifique os dados informados',
									'Favor verificar os dados informados e tente novamente.',
									'Ok',
									'',
									() => {}
								);
								break;
							case 401:
								this.openDialog(
									'Não autorizado',
									'Favor verifique os dados informados e tente novamente.',
									'Ok',
									'',
									() => {}
								);
								break;
							case 404:
								this.openDialog(
									'Usuario não encontrado',
									'O usuário não foi encontrado. Favor verifique os dados informados e tente novamente.',
									'Ok',
									'',
									() => {}
								);
								break;
							case 500:
								this.openDialog(
									'Problema no servidor',
									'Desculpe, ocorreu um problema no servidor. Favor verifique os dados informados e tente novamente.',
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
