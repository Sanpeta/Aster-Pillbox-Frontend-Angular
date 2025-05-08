import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { differenceInDays, parseISO } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { HistoricMedicationsForReport } from '../../models/interfaces/historic-medication/GetHistoricMedicationsForReport';
import { HistoricMedicationService } from '../../services/historic-medication/historic-medication.service';
import { ToastService } from '../../services/toast/toast.service';
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PieChartComponent } from '../../shared/components/pie-chart/pie-chart.component';

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

interface PieDataSet {
	data: number[];
	backgroundColor: string[];
}

@Component({
	selector: 'app-dashboard-report',
	standalone: true,
	imports: [
		BarChartComponent,
		PieChartComponent,
		LoaderComponent,
		RouterModule,
		CommonModule,
		FormsModule,
	],
	templateUrl: './dashboard-report.component.html',
	styleUrl: './dashboard-report.component.css',
})
export class DashboardReportComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	// Data properties
	public historicMedicationsForReport: HistoricMedicationsForReportInternal[] =
		[];
	public filteredMedications: HistoricMedicationsForReportInternal[] = [];
	public displayedTableDataAlarms: HistoricMedicationsForReportInternal[] =
		[];

	// Table properties
	public tableHeaders = [
		'Nome do Medicamento',
		'Quantidade Ingerida',
		'Tempo de Uso',
		'Ainda em Uso',
	];
	public itemsPerPage = 10;
	public currentPage = 1;
	public searchTerm = '';
	public sortColumn = -1;
	public sortDirection = 'asc';

	// Chart properties
	public datasets: DataSets[] = [];
	public labels: string[] = [];
	public pieDatasets: PieDataSet[] = [];
	public pieLabels: string[] = [];
	public chartView: 'bar' | 'pie' = 'bar';

	// Stats
	public activeMedicationsCount = 0;
	public averageDuration = 0;
	public totalPillsTaken = 0;

	// State
	public loading = false;
	public Math = Math; // Making Math available to the template

	constructor(
		private historicMedicationService: HistoricMedicationService,
		private toastService: ToastService
	) {}

	ngOnInit() {
		this.loading = true;
		this.fetchMedicationData();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Fetches medication data from the service
	 */
	private fetchMedicationData() {
		this.historicMedicationService
			.getHistoricMedicationForReport()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					if (response) {
						const result =
							response as HistoricMedicationsForReport[];
						this.processData(result);
						this.calculateStats();
						this.prepareChartData();
						this.filterMedications();
					}
				},
				error: (error) => {
					console.error('Error fetching medications data:', error);
					this.toastService.showError(
						'Erro ao carregar dados dos medicamentos'
					);
				},
				complete: () => {
					this.loading = false;
				},
			});
	}

	/**
	 * Process raw data into the format needed by the component
	 */
	private processData(data: HistoricMedicationsForReport[]) {
		this.historicMedicationsForReport = data.map((item) => {
			const durationInDays = this.calculateDurationInDays(
				item.first_use,
				item.last_use
			);
			return {
				name: item.name,
				active: item.active ? 'Sim' : 'Não',
				total_pill_take: item.total_pill_take,
				durationInDays: durationInDays.toString(),
			};
		});
	}

	/**
	 * Calculate statistics for display in cards
	 */
	private calculateStats() {
		// Count active medications
		this.activeMedicationsCount = this.historicMedicationsForReport.filter(
			(med) => med.active === 'Sim'
		).length;

		// Calculate average duration
		const totalDuration = this.historicMedicationsForReport.reduce(
			(sum, med) => sum + parseInt(med.durationInDays || '0', 10),
			0
		);
		this.averageDuration = this.historicMedicationsForReport.length
			? Math.round(
					totalDuration / this.historicMedicationsForReport.length
			  )
			: 0;

		// Calculate total pills taken
		this.totalPillsTaken = this.historicMedicationsForReport.reduce(
			(sum, med) => sum + med.total_pill_take,
			0
		);
	}

	/**
	 * Calculate duration in days between two dates
	 */
	private calculateDurationInDays(first: string, last: string): number {
		if (last && first) {
			try {
				const firstDate = parseISO(first);
				const lastDate = parseISO(last);
				return differenceInDays(lastDate, firstDate) || 1; // Minimum 1 day
			} catch (error) {
				console.error('Error parsing dates:', error);
				return 0;
			}
		} else {
			return 0;
		}
	}

	/**
	 * Prepare data for bar and pie charts
	 */
	private prepareChartData() {
		// Default label
		this.labels = ['Total de Medicamentos Ingeridos'];

		// Colors for pie chart
		const colors = [
			'#3b82f6',
			'#ef4444',
			'#10b981',
			'#f59e0b',
			'#8b5cf6',
			'#ec4899',
			'#6366f1',
			'#14b8a6',
			'#f97316',
			'#06b6d4',
		];

		// Bar chart data
		this.datasets = this.historicMedicationsForReport.map((med) => ({
			data: [med.total_pill_take],
			label: med.name,
		}));

		// Pie chart data
		this.pieLabels = this.historicMedicationsForReport.map(
			(med) => med.name
		);
		this.pieDatasets = [
			{
				data: this.historicMedicationsForReport.map(
					(med) => med.total_pill_take
				),
				backgroundColor: this.historicMedicationsForReport.map(
					(_, i) => colors[i % colors.length]
				),
			},
		];
	}

	/**
	 * Filter medications based on search term
	 */
	public filterMedications() {
		if (!this.searchTerm.trim()) {
			this.filteredMedications = [...this.historicMedicationsForReport];
		} else {
			const term = this.searchTerm.toLowerCase().trim();
			this.filteredMedications = this.historicMedicationsForReport.filter(
				(med) => med.name.toLowerCase().includes(term)
			);
		}

		this.sortMedications();
		this.updateDisplayedData();
	}

	/**
	 * Sort medications based on selected column
	 */
	private sortMedications() {
		if (this.sortColumn === -1) return;

		this.filteredMedications.sort((a, b) => {
			let valueA: any;
			let valueB: any;

			// Determine which property to sort by
			switch (this.sortColumn) {
				case 0: // Name
					valueA = a.name;
					valueB = b.name;
					break;
				case 1: // Total pills
					valueA = a.total_pill_take;
					valueB = b.total_pill_take;
					break;
				case 2: // Duration
					valueA = parseInt(a.durationInDays, 10);
					valueB = parseInt(b.durationInDays, 10);
					break;
				case 3: // Active status
					valueA = a.active;
					valueB = b.active;
					break;
				default:
					return 0;
			}

			// Sort direction
			if (this.sortDirection === 'asc') {
				return valueA > valueB ? 1 : -1;
			} else {
				return valueA < valueB ? 1 : -1;
			}
		});
	}

	/**
	 * Set current page data
	 */
	private updateDisplayedData() {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = Math.min(
			startIndex + this.itemsPerPage,
			this.filteredMedications.length
		);

		this.displayedTableDataAlarms = this.filteredMedications.slice(
			startIndex,
			endIndex
		);
	}

	/**
	 * Set chart view type (bar or pie)
	 */
	public setChartView(view: 'bar' | 'pie') {
		this.chartView = view;
	}

	/**
	 * Sort table by column
	 */
	public sortTable(columnIndex: number) {
		if (this.sortColumn === columnIndex) {
			// Toggle sort direction
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortColumn = columnIndex;
			this.sortDirection = 'asc';
		}

		this.sortMedications();
		this.updateDisplayedData();
	}

	/**
	 * Go to specific page
	 */
	public goToPage(page: number) {
		if (
			page < 1 ||
			page >
				Math.ceil(this.filteredMedications.length / this.itemsPerPage)
		) {
			return;
		}

		this.currentPage = page;
		this.updateDisplayedData();
	}

	/**
	 * Export data to CSV
	 */
	public exportToCSV() {
		const headers = this.tableHeaders.join(',');

		// Create CSV content
		const rows = this.historicMedicationsForReport.map(
			(med) =>
				`${med.name},${med.total_pill_take},${med.durationInDays},${med.active}`
		);

		const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join(
			'\n'
		)}`;

		// Create download link
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute(
			'download',
			`medicamentos_report_${new Date().toISOString().split('T')[0]}.csv`
		);
		document.body.appendChild(link);

		// Trigger download
		link.click();

		// Clean up
		document.body.removeChild(link);

		this.toastService.showSuccess('Relatório exportado com sucesso');
	}
}
