import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse } from '../../models/interfaces/compartment_content/GetCompartmentContentsWithAlarmAndMedicationByUserID';
import { CompartmentContentsService } from '../../services/compartment_content/compartment-contents.service';
import { NewLinePipe } from '../../shared/pipes/new-line.pipe';

interface Alarm {
	alarm_id: number;
	compartment_id: number;
	medication_id: number;
	case_id: number;
	name: string;
	alarms: string[];
	quantity_will_use: number;
	quantity_compartment: number;
	compartiment: string;
	days_of_week: string[];
	state: string;
	action: string;
}

@Component({
	selector: 'app-dashboard-list-medications',
	standalone: true,
	imports: [CommonModule, RouterModule, NewLinePipe],
	templateUrl: './dashboard-list-medications.component.html',
	styleUrl: './dashboard-list-medications.component.css',
})
export class DashboardListMedicationsComponent {
	private destroy$ = new Subject<void>();
	@Input() alarms: Alarm[] = [];
	public tableHeaders = [
		'Nome do Medicamento',
		'Alarmes do Medicamento',
		'Quantidade de comprimido(s) por horário',
		'Quantidade existente no compartimento',
		'Número do Compartimento',
		'Dias da Semana',
		'Estado',
		'Ação',
	];
	public daysOfWeek = [
		'Domingo',
		'Segunda',
		'Terça',
		'Quarta',
		'Quinta',
		'Sexta',
		'Sábado',
	];
	public displayedTableDataAlarms: Alarm[] = [];
	public itemsPerPage = 20;

	constructor(
		private compartmentContentsService: CompartmentContentsService
	) {}

	public booleanToDaysOfWeek(days: boolean[]): string[] {
		const daysOfWeek: string[] = [];
		for (let i = 0; i < days.length; i++) {
			if (days[i]) {
				daysOfWeek.push(this.daysOfWeek[i]);
			}
		}
		return daysOfWeek;
	}

	ngOnInit() {
		this.updateDisplayedData();
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
							this.alarms.push({
								alarm_id: content.alarm_id,
								compartment_id: content.compartment_id,
								medication_id: content.medication_id,
								case_id: content.case_id,
								name: content.name,
								alarms: content.time_alarms,
								quantity_will_use: content.quantity_use_pill,
								quantity_compartment:
									content.quantity_total_pill,
								compartiment:
									content.index_compartment.toString(),
								days_of_week: this.booleanToDaysOfWeek(
									content.days_of_week
								),
								state: content.is_active ? 'Ativo' : 'Inativo',
								action: '',
							});
						}
					);
				},
				error: (error) => {
					console.error('Error fetching alarms:', error);
				},
				complete: () => {
					console.log('Alarms fetched successfully');
				},
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
	}

	updateDisplayedData() {
		const startIndex = 0; // Começa do primeiro item
		const endIndex = Math.min(
			startIndex + this.itemsPerPage,
			this.alarms.length
		);
		this.displayedTableDataAlarms = this.alarms.slice(startIndex, endIndex);
	}

	getRowValues(_t14: Alarm): any {}
}
