import {
	Component,
	ComponentFactoryResolver,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, concatMap, takeUntil, zip } from 'rxjs';
import {
	UpdateAlarmRequest,
	UpdateAlarmResponse,
} from '../../models/interfaces/alarm/UpdateAlarm';
import { UpdateCompartmentRequest } from '../../models/interfaces/compartment/UpdateCompartment';
import {
	UpdateMedicationRequest,
	UpdateMedicationResponse,
} from '../../models/interfaces/medication/UpdateMedication';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { FormTimeInputListComponent } from '../../shared/components/form-time-input-list/form-time-input-list.component';
import { ListMedicationsComponent } from '../../shared/components/list-medications/list-medications.component';
import { MedicineCasePillboxComponent } from '../../shared/components/medicine-case-pillbox/medicine-case-pillbox.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { WeekDaysSelectorComponent } from '../../shared/components/week-days-selector/week-days-selector.component';
import { GetCaseResponse } from './../../models/interfaces/case/GetCase';
import { AlarmService } from './../../services/alarm/alarm.service';
import { CaseService } from './../../services/case/case.service';
import { CompartmentService } from './../../services/compartment/compartment.service';
import { MedicationService } from './../../services/medication/medication.service';

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
	private compartmentID: number = 0;
	private alarmID: number = 0;
	private medicationID: number = 0;
	private caseID: number = 0;

	public loading = false;

	public selectedItemPillboxIndex: number | null = null;
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
		private compartmentService: CompartmentService,
		private alarmService: AlarmService,
		private cookieService: CookieService,
		private activeRoute: ActivatedRoute,
		private router: Router
	) {}

	medicationForm = this.formBuilder.group({
		pillbox: [0, [Validators.required]],
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
		this.activeRoute.queryParams.subscribe((params) => {
			this.compartmentID = +params['compartment'];
			this.alarmID = +params['alarm'];
			this.medicationID = +params['medication'];
			this.caseID = +params['case'];
		});
		zip(
			this.caseService.getCasesByUserID(),
			this.compartmentService.getCompartment(this.compartmentID),
			this.medicationService.getMedication(this.medicationID),
			this.alarmService.getAlarm(this.alarmID)
		).subscribe({
			next: ([
				caseResponse,
				compartmentResponse,
				medicationResponse,
				alarmResponse,
			]) => {
				this.listCase = caseResponse;
				const positionSelected = this.medicationForm.value.pillbox!;
				this.column = this.listCase[positionSelected].column_size;
				this.row = this.listCase[positionSelected].row_size;

				this.medicationForm.patchValue({
					name: medicationResponse.name,
					quantity_pill_will_use:
						medicationResponse.quantity_use_pill,
					quantity_pill_compartment:
						medicationResponse.quantity_total_pill,
					description_pill: medicationResponse.description,
				});
				this.alarms = alarmResponse.time_alarms;
				this.selectedDays = alarmResponse.days_of_week;
				this.selectedItemPillboxIndex =
					compartmentResponse.index_compartment - 1;

				console.log(caseResponse);
				console.log(compartmentResponse);
				console.log(medicationResponse);
				console.log(alarmResponse);
			},
			complete: () => {},
			error: (error) => {
				console.log(error);
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
		const medicationRequest: UpdateMedicationRequest = {
			id: this.medicationID,
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
			.updateMedication(medicationRequest)
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
					const result = response as UpdateMedicationResponse;
					this.medicationID = result.id;

					const alarmRequest: UpdateAlarmRequest = {
						id: this.alarmID,
						time_alarms: this.alarms,
						is_active: true,
						days_of_week: this.selectedDays,
						description: 'alarm',
					};
					return this.alarmService.updateAlarm(alarmRequest);
				}),
				concatMap((response) => {
					console.log('response 2:' + response);
					const result = response as UpdateAlarmResponse;
					this.alarmID = result.id;

					const compartmentRequest: UpdateCompartmentRequest = {
						id: this.compartmentID,
						case_id: this.listCase[0].id,
						description: 'compartment',
						index_compartment: this.selectedItemPillboxIndex! + 1,
					};
					return this.compartmentService.updateCompartment(
						compartmentRequest
					);
				})
			)
			.subscribe({
				next: (response) => {
					console.log('response: ' + response);
					if (response) {
						this.showToast(
							'Medicação atualizada com sucesso!',
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
