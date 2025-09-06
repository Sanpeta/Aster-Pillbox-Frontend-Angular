import { CommonModule } from '@angular/common';
import {
	Component,
	ComponentFactoryResolver,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse } from '../../models/interfaces/compartment_content/GetCompartmentContentsWithAlarmAndMedicationByUserID';
import { CompartmentContentsService } from '../../services/compartment_content/compartment-contents.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

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
	imports: [CommonModule, RouterModule, LoaderComponent],
	templateUrl: './dashboard-list-medications.component.html',
	styleUrl: './dashboard-list-medications.component.css',
})
export class DashboardListMedicationsComponent implements OnInit, OnDestroy {
	public loading = false;
	public alarms: Alarm[] = [];
	public tableHeaders = [
		'Medicamento',
		'Alarmes',
		'Dose',
		'Estoque',
		'Compartimento',
		'Dias da Semana',
		'Status',
		'Ações',
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
	public itemsPerPage = 8;
	public currentPage = 1;
	public pageCount = 1;
	public searchTerm = '';
	public stateFilter = '';
	public compartmentFilter = '';
	public selectedAlarm: Alarm | null = null;
	public activeAlarmsCount = 0;
	public inactiveAlarmsCount = 0;
	public Math = Math;

	private destroy$ = new Subject<void>();

	@ViewChild('toastContainer', { read: ViewContainerRef })
	toast!: ViewContainerRef;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
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
		this.loading = true;
		this.compartmentContentsService
			.getCompartmentContentsWithAlarmAndMedicationByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (
					response: GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse[]
				) => {
					this.alarms = [];
					this.activeAlarmsCount = 0;
					this.inactiveAlarmsCount = 0;

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
							} else {
								this.inactiveAlarmsCount++;
							}
						}
					);

					this.updatePageCount();
					this.updateDisplayedData();
					this.loading = false;
					this.toast.clear();
					this.showToast('Medicamentos carregados com sucesso!');
				},
				error: (error) => {
					console.error('Error fetching alarms:', error);
					this.loading = false;
					this.toast.clear();
					this.showToast('Erro ao carregar medicamentos.', 'error');
				},
				complete: () => {
					this.loading = false;
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
		const filteredAlarms = this.getFilteredAlarms();
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = Math.min(
			startIndex + this.itemsPerPage,
			filteredAlarms.length
		);
		this.displayedTableDataAlarms = filteredAlarms.slice(
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

	getPageNumbers(): number[] {
		const pages: number[] = [];
		const maxPages = 5;
		let startPage = Math.max(
			1,
			this.currentPage - Math.floor(maxPages / 2)
		);
		let endPage = Math.min(this.pageCount, startPage + maxPages - 1);

		if (endPage - startPage + 1 < maxPages) {
			startPage = Math.max(1, endPage - maxPages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
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
				this.stateFilter === 'all' ||
				alarm.state === this.stateFilter;

			const matchesCompartment =
				this.compartmentFilter === '' ||
				this.compartmentFilter === 'all' ||
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

	// Delete methods
	confirmDelete(alarm: Alarm) {
		this.selectedAlarm = alarm;
		this.openDialog(
			'Confirmar Exclusão',
			`Tem certeza que deseja remover o medicamento "${alarm.name}"? Esta ação não pode ser desfeita.`,
			'Confirmar',
			'Cancelar',
			() => this.deleteMedication()
		);
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

			// Update counters
			if (this.selectedAlarm.state === 'Ativo') {
				this.activeAlarmsCount--;
			} else {
				this.inactiveAlarmsCount--;
			}

			this.updatePageCount();
			this.updateDisplayedData();
			this.selectedAlarm = null;
			this.toast.clear();
			this.showToast('Medicamento removido com sucesso!');
		}
	}

	// Utility methods
	getAlarmCount(): number {
		return this.alarms.reduce(
			(count, alarm) => count + alarm.alarms.length,
			0
		);
	}

	getUniqueCompartments(): string[] {
		const compartments = this.alarms.map((alarm) => alarm.compartiment);
		return [...new Set(compartments)].sort(
			(a, b) => parseInt(a) - parseInt(b)
		);
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
