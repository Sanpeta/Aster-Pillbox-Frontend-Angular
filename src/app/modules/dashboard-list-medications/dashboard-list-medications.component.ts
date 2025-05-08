import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse } from '../../models/interfaces/compartment_content/GetCompartmentContentsWithAlarmAndMedicationByUserID';
import { CompartmentContentsService } from '../../services/compartment_content/compartment-contents.service';

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
	imports: [CommonModule, RouterModule],
	templateUrl: './dashboard-list-medications.component.html',
	styleUrl: './dashboard-list-medications.component.css',
})
export class DashboardListMedicationsComponent implements OnInit, OnDestroy {
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
	public itemsPerPage = 5; // Reduzido para melhor visualização
	public currentPage = 1;
	public pageCount = 1;
	public searchTerm = '';
	public stateFilter = '';
	public compartmentFilter = '';
	public Math = Math;
	public selectedAlarm: Alarm | null = null;
	activeAlarmsCount = 0;
	inactiveAlarmsCount = 0;

	constructor(
		private compartmentContentsService: CompartmentContentsService
	) {}

	ngOnInit() {
		this.loadAlarms();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	loadAlarms() {
		this.compartmentContentsService
			.getCompartmentContentsWithAlarmAndMedicationByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (
					response: GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse[]
				) => {
					console.log('Alarms fetched:', response);
					this.alarms = [];

					// Map API response to our Alarm interface
					response.forEach(
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
							if (content.is_active) {
								this.activeAlarmsCount++;
							}
							if (!content.is_active) {
								this.inactiveAlarmsCount++;
							}
						}
					);

					this.updatePageCount();
					this.updateDisplayedData();
				},
				error: (error) => {
					console.error('Error fetching alarms:', error);
				},
				complete: () => {
					console.log('Alarms fetched successfully');
				},
			});
	}

	public booleanToDaysOfWeek(days: boolean[]): string[] {
		const daysOfWeek: string[] = [];
		for (let i = 0; i < days.length; i++) {
			if (days[i]) {
				daysOfWeek.push(this.daysOfWeek[i]);
			}
		}
		return daysOfWeek;
	}

	// Pagination methods
	updatePageCount() {
		this.pageCount = Math.ceil(
			this.getFilteredAlarms().length / this.itemsPerPage
		);
		if (this.pageCount === 0) this.pageCount = 1;
		if (this.currentPage > this.pageCount) {
			this.currentPage = this.pageCount;
		}
	}

	updateDisplayedData() {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = Math.min(
			startIndex + this.itemsPerPage,
			this.getFilteredAlarms().length
		);
		this.displayedTableDataAlarms = this.getFilteredAlarms().slice(
			startIndex,
			endIndex
		);
	}

	prevPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
			this.updateDisplayedData();
		}
	}

	nextPage() {
		if (this.currentPage < this.pageCount) {
			this.currentPage++;
			this.updateDisplayedData();
		}
	}

	setPage(page: number) {
		this.currentPage = page;
		this.updateDisplayedData();
	}

	// Filter methods
	getFilteredAlarms(): Alarm[] {
		return this.alarms.filter((alarm) => {
			const matchesSearch =
				this.searchTerm === '' ||
				alarm.name
					.toLowerCase()
					.includes(this.searchTerm.toLowerCase());

			const matchesState =
				this.stateFilter === '' ||
				this.stateFilter === 'Filtrar por estado' ||
				alarm.state === this.stateFilter;

			const matchesCompartment =
				this.compartmentFilter === '' ||
				this.compartmentFilter === 'Filtrar por compartimento' ||
				alarm.compartiment === this.compartmentFilter;

			return matchesSearch && matchesState && matchesCompartment;
		});
	}

	applySearchFilter(event: Event) {
		const target = event.target as HTMLInputElement;
		this.searchTerm = target.value;
		this.currentPage = 1;
		this.updatePageCount();
		this.updateDisplayedData();
	}

	applyStateFilter(event: Event) {
		const target = event.target as HTMLSelectElement;
		this.stateFilter = target.value;
		this.currentPage = 1;
		this.updatePageCount();
		this.updateDisplayedData();
	}

	applyCompartmentFilter(event: Event) {
		const target = event.target as HTMLSelectElement;
		this.compartmentFilter = target.value;
		this.currentPage = 1;
		this.updatePageCount();
		this.updateDisplayedData();
	}

	// Delete modal methods
	confirmDelete(alarm: Alarm) {
		this.selectedAlarm = alarm;
		const modal = document.getElementById('deleteModal');
		if (modal) {
			modal.classList.remove('hidden');
		}
	}

	cancelDelete() {
		this.selectedAlarm = null;
		const modal = document.getElementById('deleteModal');
		if (modal) {
			modal.classList.add('hidden');
		}
	}

	deleteMedication() {
		if (this.selectedAlarm) {
			// Here you would call a service to delete the medication
			console.log('Deleting medication:', this.selectedAlarm);

			// For now, let's just remove it from the local arrays
			this.alarms = this.alarms.filter(
				(a) =>
					a.alarm_id !== this.selectedAlarm?.alarm_id ||
					a.medication_id !== this.selectedAlarm?.medication_id
			);

			this.updatePageCount();
			this.updateDisplayedData();
			this.cancelDelete();
		}
	}

	// Utility methods
	getAlarmCount(): number {
		let count = 0;
		this.alarms.forEach((alarm) => {
			count += alarm.alarms.length;
		});
		return count;
	}
}
