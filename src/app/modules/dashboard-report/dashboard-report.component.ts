import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { differenceInDays, parseISO } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { HistoricMedicationsForReport } from '../../models/interfaces/historic-medication/GetHistoricMedicationsForReport';
import { HistoricMedicationService } from '../../services/historic-medication/historic-medication.service';
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

interface HistoricMedicationsForReportInternal {
	name: string;
	active: string;
	total_pill_take: number;
	durationInDays: string;
}

interface DataSets {
	data: number[];
	label: string;
}

@Component({
	selector: 'app-dashboard-report',
	standalone: true,
	imports: [BarChartComponent, LoaderComponent, RouterModule, CommonModule],
	templateUrl: './dashboard-report.component.html',
	styleUrl: './dashboard-report.component.css',
})
export class DashboardReportComponent {
	private destroy$ = new Subject<void>();

	public historicMedicationsForReport: HistoricMedicationsForReportInternal[] =
		[];
	public tableHeaders = [
		'Nome do Medicamento',
		'Quantidade de Medicamento Ingerido',
		'Tempo Total do Uso',
		'Ainda em Uso',
	];
	public datasets: DataSets[] = [];
	public labels: string[] = [];
	public loading = false;

	public displayedTableDataAlarms: HistoricMedicationsForReportInternal[] =
		[];
	public itemsPerPage = 20;

	constructor(private historicMedicationService: HistoricMedicationService) {}

	private checkDateAndShowDifferenteInDays(
		first: string,
		last: string
	): number {
		if (last && first) {
			const firstDate = parseISO(first);
			const lastDate = parseISO(last);
			return differenceInDays(lastDate, firstDate);
		} else {
			return 0;
		}
	}

	ngOnInit() {
		this.loading = true;
		this.historicMedicationService
			.getHistoricMedicationForReport()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					if (response) {
						const result =
							response as HistoricMedicationsForReport[];
						this.labels.push('Total de Medicamentos Ingeridos');
						result.forEach((item) => {
							var modifiedHistoricMedication: HistoricMedicationsForReportInternal;
							const durationInDays =
								this.checkDateAndShowDifferenteInDays(
									item.first_use,
									item.last_use
								);
							modifiedHistoricMedication = {
								name: item.name,
								active: item.active ? 'Sim' : 'Não',
								total_pill_take: item.total_pill_take,
								durationInDays: durationInDays.toString(),
							};
							this.datasets.push({
								data: [
									modifiedHistoricMedication.total_pill_take,
								],
								label: modifiedHistoricMedication.name,
							});
							this.historicMedicationsForReport.push(
								modifiedHistoricMedication
							);
						});
						console.log('data fetched:', response);
					}
				},
				error: (error) => {
					console.error('Error fetching alarms:', error);
				},
				complete: () => {
					this.loading = false;
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
			this.historicMedicationsForReport.length
		);
		this.displayedTableDataAlarms = this.historicMedicationsForReport.slice(
			startIndex,
			endIndex
		);
	}

	getRowValues(_t14: HistoricMedicationsForReport): any {}
}
