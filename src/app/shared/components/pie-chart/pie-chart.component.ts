import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface PieDataSet {
	data: number[];
	backgroundColor: string[];
}

@Component({
	selector: 'app-pie-chart',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="pie-chart-container">
			<canvas #pieChart></canvas>
		</div>
	`,
	styles: [
		`
			.pie-chart-container {
				position: relative;
				width: 100%;
				height: 100%;
			}
		`,
	],
})
export class PieChartComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() datasets: PieDataSet[] = [];
	@Input() labels: string[] = [];

	@ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
	private chart: Chart<'pie', number[], string> | null = null;

	constructor() {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		this.createChart();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ((changes['datasets'] || changes['labels']) && this.chart) {
			this.updateChart();
		}
	}

	private createChart(): void {
		if (!this.pieChartRef || !this.datasets.length) return;

		const ctx = this.pieChartRef.nativeElement.getContext('2d');
		if (!ctx) return;

		const config: ChartConfiguration<'pie', number[], string> = {
			type: 'pie',
			data: {
				labels: this.labels,
				datasets: this.datasets.map((dataset) => ({
					data: dataset.data,
					backgroundColor: dataset.backgroundColor,
					borderWidth: 1,
					hoverOffset: 4,
				})),
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'right',
						labels: {
							boxWidth: 12,
							padding: 15,
							font: {
								size: 11,
							},
						},
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const label = context.label || '';
								const value = context.raw as number;
								const total = context.dataset.data.reduce(
									(a: number, b: number) => a + b,
									0
								);
								const percentage = Math.round(
									(value / total) * 100
								);
								return `${label}: ${value} (${percentage}%)`;
							},
						},
					},
				},
			},
		};

		this.chart = new Chart<'pie', number[], string>(ctx, config);
	}

	private updateChart(): void {
		if (!this.chart) return;

		this.chart.data.labels = this.labels;
		this.chart.data.datasets = this.datasets.map((dataset) => ({
			data: dataset.data,
			backgroundColor: dataset.backgroundColor,
			borderWidth: 1,
			hoverOffset: 4,
		}));

		this.chart.update();
	}
}
