import {
	Component,
	ComponentFactoryResolver,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
		MedicineCasePillboxComponent,
		WeekDaysSelectorComponent,
		FormTimeInputListComponent,
		LoaderComponent,
		RouterModule,
	],
	templateUrl: './dashboard-medication.component.html',
	styleUrl: './dashboard-medication.component.css',
})
export class DashboardMedicationComponent implements OnInit, OnDestroy {
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

	private destroy$ = new Subject<void>();
	private medicationID = 0;
	private alarmID = 0;
	private caseID = 0;
	private compartmentID = 0;

	@ViewChild('toastContainer', { read: ViewContainerRef })
	toast!: ViewContainerRef;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private formBuilder: FormBuilder,
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
		quantity_pill_compartment: [
			0,
			[Validators.required, Validators.min(1)],
		],
		quantity_pill_will_use: [0, [Validators.required, Validators.min(1)]],
		dosage: [''],
		description_pill: [''],
		description_alarm: [''],
	});

	ngOnInit(): void {
		this.loading = true;
		this.caseService
			.getCasesByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					if (response) {
						this.listCase = response;
						this.loading = false;
						this.toast.clear();
						this.showToast(
							'Caixas de medicamentos carregadas com sucesso!'
						);
					}
				},
				complete: () => {
					this.loading = false;
				},
				error: (error) => {
					console.log(error);
					this.loading = false;
					this.toast.clear();
					this.showToast(
						'Erro ao carregar as caixas de medicamentos.',
						'error'
					);
				},
			});

		this.medicationForm
			.get('pillbox')!
			.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((item) => {
				if (item !== null && item !== undefined) {
					this.column = this.listCase[item].column_size;
					this.row = this.listCase[item].row_size;
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSelectionChange(newSelectedDays: boolean[]) {
		this.selectedDays = newSelectedDays;
	}

	onSelectedItemPillboxChange(index: number) {
		this.selectedItemPillboxIndex = index;
	}

	onTimeChange(newAlarms: string[]) {
		this.alarms = newAlarms;
	}

	onSubmitMedicationForm(): void {
		this.loading = true;

		if (this.medicationForm.valid && this.medicationForm.value) {
			if (this.selectedItemPillboxIndex === null) {
				this.loading = false;
				this.toast.clear();
				this.showToast(
					'Selecione um compartimento na caixa de medicamentos.',
					'error'
				);
				return;
			}

			if (this.alarms.length === 0) {
				this.loading = false;
				this.toast.clear();
				this.showToast(
					'Adicione pelo menos um horário de alarme.',
					'error'
				);
				return;
			}

			if (!this.selectedDays.some((day) => day)) {
				this.loading = false;
				this.toast.clear();
				this.showToast(
					'Selecione pelo menos um dia da semana.',
					'error'
				);
				return;
			}

			const formValue = this.medicationForm.value;
			const medicationRequest: CreateMedicationRequest = {
				user_id: parseInt(this.cookieService.get('USER_ID')),
				name: formValue.name!,
				description: formValue.description_pill ?? '',
				quantity_use_pill: formValue.quantity_pill_will_use!,
				quantity_total_pill: formValue.quantity_pill_compartment!,
				dosage: formValue.dosage ?? '',
				active: true,
			};

			this.medicationService
				.createMedication(medicationRequest)
				.pipe(
					concatMap((response) => {
						if (response === false) {
							throw new Error('Erro ao criar medicação');
						}
						const result = response as CreateMedicationResponse;
						this.medicationID = result.id;

						const alarmRequest: CreateAlarmRequest = {
							time_alarms: this.alarms,
							is_active: true,
							days_of_week: this.selectedDays,
							description: formValue.description_alarm ?? '',
						};
						return this.alarmService.createAlarm(alarmRequest);
					}),
					concatMap((response) => {
						const result = response as CreateAlarmResponse;
						this.alarmID = result.id;

						const compartmentRequest: CreateCompartmentRequest = {
							case_id: this.listCase[formValue.pillbox!].id,
							description: 'compartment',
							index_compartment:
								this.selectedItemPillboxIndex! + 1,
						};
						return this.compartmentService.createCompartment(
							compartmentRequest
						);
					}),
					concatMap((response) => {
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
						if (response) {
							this.medicationForm.reset();
							this.selectedDays = [
								false,
								false,
								false,
								false,
								false,
								false,
								false,
							];
							this.alarms = [];
							this.selectedItemPillboxIndex = null;
							this.toast.clear();
							this.openDialog(
								'Sucesso!',
								'Medicação cadastrada com sucesso!',
								'Continuar',
								'',
								() => {
									this.router.navigate([
										'/dashboard/medications',
									]);
								}
							);
						}
					},
					complete: () => {
						this.loading = false;
					},
					error: (error) => {
						console.log(error);
						this.loading = false;
						this.toast.clear();
						this.showToast(
							'Erro ao cadastrar medicação. Tente novamente mais tarde.',
							'error'
						);
					},
				});
		} else {
			this.loading = false;
			this.toast.clear();
			this.showToast(
				'Preencha todos os campos obrigatórios antes de continuar.',
				'error'
			);
		}
	}

	showToast(
		mensagem: string,
		type: 'success' | 'error' | 'info' | 'warning' = 'success'
	) {
		const componentFactory =
			this.componentFactoryResolver.resolveComponentFactory(
				ToastComponent
			);
		this.toast.clear();
		const componentRef = this.toast.createComponent(componentFactory);
		componentRef.instance.mensage = mensagem;
		componentRef.instance.type = type;
		componentRef.instance.closeToast.subscribe(() => {
			componentRef.destroy();
		});
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
			this.dialogContainer.clear();
		});

		componentRef.instance.confirm.subscribe(() => {
			if (funcConfirmButton) {
				funcConfirmButton();
			}
		});
	}
}
