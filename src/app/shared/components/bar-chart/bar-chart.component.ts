import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

interface DataSets {
	data: number[];
	label: string;
}

@Component({
	selector: 'app-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.scss'],
	standalone: true,
	imports: [BaseChartDirective],
})
export class BarChartComponent implements OnInit {
	public barChartLegend = true;
	public barChartPlugins = [];
	@Input() labels: string[] = [];
	@Input() datasets: DataSets[] = [];

	public barChartData: ChartConfiguration<'bar'>['data'] = {
		labels: this.labels,
		datasets: [...this.datasets],
	};

	public barChartOptions: ChartOptions<'bar'> = {
		responsive: true,
	};

	constructor() {}

	ngOnInit(): void {}
}
