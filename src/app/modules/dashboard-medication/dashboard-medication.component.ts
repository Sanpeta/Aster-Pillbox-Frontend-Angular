import {
	Component,
	ComponentFactoryResolver,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, concatMap, takeUntil } from 'rxjs';
import {
	CreateAlarmRequest,
	CreateAlarmResponse,
} from '../../models/interfaces/alarm/CreateAlarm';
import { GetCaseResponse } from '../../models/interfaces/case/GetCase';
import {
	CreateCompartmentRequest,
	CreateCompartmentResponse,
} from '../../models/interfaces/compartment/CreateCompartment';
import { CreateCompartmentContentRequest } from '../../models/interfaces/compartment_content/CreateCompartmentContent';
import {
	CreateMedicationRequest,
	CreateMedicationResponse,
} from '../../models/interfaces/medication/CreateMedication';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { FormTimeInputListComponent } from '../../shared/components/form-time-input-list/form-time-input-list.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { MedicineCasePillboxComponent } from '../../shared/components/medicine-case-pillbox/medicine-case-pillbox.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { WeekDaysSelectorComponent } from '../../shared/components/week-days-selector/week-days-selector.component';
import { AlarmService } from './../../services/alarm/alarm.service';
import { CaseService } from './../../services/case/case.service';
import { CompartmentService } from './../../services/compartment/compartment.service';
import { CompartmentContentsService } from './../../services/compartment_content/compartment-contents.service';
import { MedicationService } from './../../services/medication/medication.service';

@Component({
	selector: 'app-dashboard-medication',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		DialogComponent,
		ToastComponent,
		MedicineCasePillboxComponent,
		WeekDaysSelectorComponent,
		FormTimeInputListComponent,
		LoaderComponent,
	],
	templateUrl: './dashboard-medication.component.html',
	styleUrl: './dashboard-medication.component.css',
})
export class DashboardMedicationComponent implements OnInit {
	private destroy$ = new Subject<void>();
	private medicationID = 0;
	private alarmID = 0;
	private caseID = 0;
	private compartmentID = 0;

	public selectedItemPillboxIndex: number | null = null;
	public loading = false;
	public listCase: GetCaseResponse[] = [];
	public column: number = 0;
	public row: number = 0;
	public selectedDays: boolean[] = [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	];
	public alarms: string[] = [];

	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;
	@ViewChild('toastContainer', { read: ViewContainerRef })
	toast!: ViewContainerRef;

	constructor(
		private formBuilder: FormBuilder,
		private componentFactoryResolver: ComponentFactoryResolver,
		private caseService: CaseService,
		private medicationService: MedicationService,
		private alarmService: AlarmService,
		private compartmentService: CompartmentService,
		private compartmentContentsService: CompartmentContentsService,
		private cookieService: CookieService,
		private router: Router
	) {}

	medicationForm = this.formBuilder.group({
		pillbox: [{}, [Validators.required]],
		name: ['', [Validators.required, Validators.minLength(3)]],
		quantity_pill_compartment: [0, [Validators.required]],
		quantity_pill_will_use: [0, [Validators.required]],
		description_pill: [''],
	});

	onSelectionChange(newSelectedDays: boolean[]) {
		this.selectedDays = newSelectedDays;
		console.log('Selected days:', this.selectedDays); // Log the selected days
	}

	onSelectedItemPillboxChange(index: number) {
		this.selectedItemPillboxIndex = index;
	}

	onTimeChange(newAlarms: string[]) {
		this.alarms = newAlarms;
		console.log('Selected alarms:', this.alarms); // Log the selected alarms
	}

	ngOnInit(): void {
		this.loading = true;
		this.caseService
			.getCasesByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					console.log(response);
					if (response) {
						this.loading = false;
						response.forEach((pillbox) => {
							this.listCase.push(pillbox);
						});
						console.log(this.listCase);
					}
				},
				complete: () => {
					console.log('complete');
					this.loading = false;
				},
				error: (error) => {
					console.log(error);
					this.loading = false;
				},
			});

		this.medicationForm
			.get('pillbox')!
			.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((item) => {
				this.column = this.listCase[item!].column_size;
				this.row = this.listCase[item!].row_size;
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmitMedicationForm(): void {
		this.loading = true;
		// if (this.medicationForm.value && this.medicationForm.valid) {
		console.log(this.medicationForm.value);
		const medicationRequest: CreateMedicationRequest = {
			user_id: parseInt(this.cookieService.get('USER_ID')),
			name: this.medicationForm.value.name!,
			description: this.medicationForm.value.description_pill ?? '',
			quantity_use_pill:
				this.medicationForm.value.quantity_pill_will_use!,
			quantity_total_pill:
				this.medicationForm.value.quantity_pill_compartment!,
			active: true,
		};

		this.medicationService
			.createMedication(medicationRequest)
			.pipe(
				concatMap((response) => {
					if (response === false) {
						this.openDialog(
							'Algo deu erro',
							'Favor verifique os dados informados e tente novamente.',
							'Ok'
						);
					}
					console.log('resposta 1:' + response);
					const result = response as CreateMedicationResponse;
					this.medicationID = result.id;

					const alarmRequest: CreateAlarmRequest = {
						time_alarms: this.alarms,
						is_active: true,
						days_of_week: this.selectedDays,
						description: 'alarm',
					};
					return this.alarmService.createAlarm(alarmRequest);
				}),
				concatMap((response) => {
					console.log('response 2:' + response);
					const result = response as CreateAlarmResponse;
					this.alarmID = result.id;

					const compartmentRequest: CreateCompartmentRequest = {
						case_id: this.listCase[0].id,
						description: 'compartment',
						index_compartment: this.selectedItemPillboxIndex! + 1,
					};
					return this.compartmentService.createCompartment(
						compartmentRequest
					);
				}),
				concatMap((response) => {
					console.log('response 3:' + response);
					const result = response as CreateCompartmentResponse;
					this.compartmentID = result.id;

					const compartmentContentsRequest: CreateCompartmentContentRequest =
						{
							compartment_id: this.compartmentID,
							alarm_id: this.alarmID,
							medication_id: this.medicationID,
						};
					return this.compartmentContentsService.createCompartmentContent(
						compartmentContentsRequest
					);
				})
			)
			.subscribe({
				next: (response) => {
					console.log('response: ' + response);
					if (response) {
						this.showToast(
							'Medicação cadastrada com sucesso!',
							'success'
						);
						// this.router.navigate(['/check-your-email']);
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

	showToast(
		mensagem: string,
		type: 'success' | 'error' | 'info' | 'warning' = 'success'
	) {
		const componentFactory =
			this.componentFactoryResolver.resolveComponentFactory(
				ToastComponent
			);
		this.toast.clear(); // Limpa o container antes de criar um novo toast
		const componentRef = this.toast.createComponent(componentFactory);
		componentRef.instance.mensage = mensagem;
		componentRef.instance.type = type;
		componentRef.instance.closeToast.subscribe(() => {
			componentRef.destroy();
		});
	}
}
