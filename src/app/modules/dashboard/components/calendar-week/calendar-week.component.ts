import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
	addDays,
	differenceInMinutes,
	format,
	isSameDay,
	parse,
	startOfWeek,
} from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { Subject, concatMap, takeUntil } from 'rxjs';
import { GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse } from '../../../../models/interfaces/compartment_content/GetCompartmentContentsWithAlarmAndMedicationByUserID';
import {
	CreateHistoricMedicationRequest,
	CreateHistoricMedicationResponse,
} from '../../../../models/interfaces/historic-medication/CreateHistoricMedication';
import { CompartmentContentsService } from '../../../../services/compartment_content/compartment-contents.service';
import { HistoricMedicationService } from '../../../../services/historic-medication/historic-medication.service';
import { MedicationService } from './../../../../services/medication/medication.service';

interface Medication {
	id: number;
	name: string;
	alarms: string[];
	days_of_week: boolean[];
	quantity: number;
	compartiment: string;
}

@Component({
	selector: 'app-calendar-week',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './calendar-week.component.html',
	styleUrl: './calendar-week.component.css',
})
export class CalendarWeekComponent implements OnInit {
	private destroy$ = new Subject<void>();

	public weekDays: { dayName: string; date: Date }[] = [];
	public day: { dayName: string; date: Date } = {
		date: new Date(),
		dayName: '',
	};
	public medications: Medication[] = [];
	public selectedDate: Date | null = null; // Adiciona variável para a data selecionada

	constructor(
		private compartmentContentsService: CompartmentContentsService,
		private medicationService: MedicationService,
		private historicMedicationService: HistoricMedicationService,
		private cookieService: CookieService
	) {}

	ngOnInit() {
		this.compartmentContentsService
			.getCompartmentContentsWithAlarmAndMedicationByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (
					response: GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse[]
				) => {
					console.log('Alarms fetched:', response);
					const compartmentContents = response;
					// Iterar sobre os resultados e fazer o que for necessário
					compartmentContents.map(
						(
							content: GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse
						) => {
							this.medications.push({
								id: content.medication_id,
								name: content.name,
								alarms: content.time_alarms,
								days_of_week: content.days_of_week,
								quantity: content.quantity_use_pill,
								compartiment:
									content.index_compartment.toString(),
							});
						}
					);
					this.updateDisplayedData(); // Atualiza os alarmes no calendário
				},
				error: (error) => {
					console.error('Error fetching alarms:', error);
				},
				complete: () => {
					console.log('Alarms fetched successfully');
					this.selectedDate = new Date();
				},
			});

		const today = new Date();
		const startOfWeekDate = startOfWeek(today); // Obtém o primeiro dia da semana (domingo)

		// Preenche o array weekDays com os dias da semana
		for (let i = 0; i < 7; i++) {
			const date = addDays(startOfWeekDate, i);
			this.weekDays.push({
				dayName: format(date, 'EEEE'), // Nome do dia da semana
				date: date,
			});
		}
	}

	onTakeMedication(
		medicationID: number,
		quantity: number,
		originalDate: string
	): void {
		console.log('onTakeMedication');
		console.log(medicationID);
		console.log(quantity);
		console.log(originalDate);
		console.log(Date.now().toString());

		const horarioString = originalDate;
		const dataAtual = new Date();
		const dataComHorario = parse(horarioString, 'HH:mm', dataAtual);

		const historicMedicationRequest: CreateHistoricMedicationRequest = {
			user_id: parseInt(this.cookieService.get('USER_ID')),
			medication_id: medicationID,
			quantity_pill_take: quantity,
			time_of_medication_take: format(
				Date.now(),
				"yyyy-MM-dd'T'HH:mm:ssXXX"
			),
			original_time_of_medication_take: format(
				dataComHorario,
				"yyyy-MM-dd'T'HH:mm:ssXXX"
			),
		};

		this.historicMedicationService
			.createHistoricMedication(historicMedicationRequest)
			.pipe(
				concatMap((response) => {
					console.log('response ' + response);
					const result = response as CreateHistoricMedicationResponse;
					return this.medicationService.updateQuantityMedication({
						id: result.medication_id,
						quantity_use_pill: result.quantity_pill_take,
					});
				}),
				takeUntil(this.destroy$)
			)
			.subscribe({
				next: (response) => {
					console.log('Historic medication created:', response);
				},
				error: (error) => {
					console.error('Error creating historic medication:', error);
				},
				complete: () => {
					console.log('Historic medication created successfully');
				},
			});
	}

	getMedicationsForDay(date: Date): Medication[] {
		// 0 para domingo, 1 para segunda
		const dayOfWeekIndex = date.getDay();
		return this.medications.filter(
			(medication) => medication.days_of_week[dayOfWeekIndex]
		);
	}

	onDayClick(day: { dayName: string; date: Date }) {
		this.selectedDate = day.date; // Define a data selecionada
		console.log('Data selecionada:', this.selectedDate.getDay());
		this.updateDisplayedData(); // Atualiza os medicamentos no calendário
	}

	updateDisplayedData() {
		if (this.selectedDate) {
			const medicationsForSelectedDate = this.getMedicationsForDay(
				this.selectedDate
			);

			// Exibir os nomes dos medicamentos no console (ou em outro lugar)
			medicationsForSelectedDate.forEach((medication) => {
				console.log(medication.name);
			});
		}
	}

	isSameDay(date1: Date, date2: Date | null): boolean {
		if (!date2) return false;
		return isSameDay(date1, date2);
	}

	getAlarmStatusClass(time: string): string {
		const [hours, minutes] = time.split(':').map(Number); // Extrai horas e minutos
		const alarmTime = new Date();
		alarmTime.setHours(hours, minutes, 0, 0); // Define a data com o horário do alarme

		const now = new Date();
		const diffInMinutes = differenceInMinutes(now, alarmTime);

		if (diffInMinutes >= 30) {
			return 'bg-gray-300'; // Cinza se passou mais de 30 min
		} else if (diffInMinutes >= -30 && diffInMinutes < 0) {
			return 'bg-blue-300'; // Azul se for  30 min antes ou menos
		} else {
			return 'bg-red-300'; // Red que ainda nao chegou
		}
	}
}
