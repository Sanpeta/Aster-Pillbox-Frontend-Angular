import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

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

	public barChartData: ChartConfiguration<'bar'>['data'] = {
		labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
		datasets: [
			{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
			{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
		],
	};

	public barChartOptions: ChartOptions<'bar'> = {
		responsive: true,
	};

	constructor() {}

	ngOnInit(): void {}
}
