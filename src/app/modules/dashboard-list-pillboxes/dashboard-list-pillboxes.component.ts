import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { GetCaseResponse } from '../../models/interfaces/case/GetCase';
import { CaseService } from './../../services/case/case.service';

interface Pillbox {
	case_name: string;
	mac_address: string;
	row_size: number;
	column_size: number;
	status: boolean;
}

@Component({
	selector: 'app-dashboard-list-pillboxes',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './dashboard-list-pillboxes.component.html',
	styleUrl: './dashboard-list-pillboxes.component.css',
})
export class DashboardListPillboxesComponent {
	private destroy$ = new Subject<void>();
	public pillbox_id: number = 0;

	public pillboxes: GetCaseResponse[] = [];
	tableHeaders = [
		'Nome da Caixa de Medicamento',
		'Endereço MAC',
		'Quantidade de Linhas',
		'Quantidade de Colunas',
		'Status',
		'Ações',
	];

	constructor(
		private caseService: CaseService,
		private cookie: CookieService,
		private router: Router
	) {}

	displayedTableDataMedications: Pillbox[] = [];
	itemsPerPage = 20;

	ngOnInit() {
		// this.updateDisplayedData();
		this.caseService
			.getCasesByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: GetCaseResponse[]) => {
					console.log(response);
					response.forEach((element) => {
						this.pillboxes.push(element);
					});
					// this.pillboxes = response;
				},
				error: (err) => {
					console.log(err);
				},
				complete: () => {
					console.log('complete');
				},
			});
	}

	updateDisplayedData() {
		const startIndex = 0; // Começa do primeiro item
		const endIndex = Math.min(
			startIndex + this.itemsPerPage,
			this.pillboxes.length
		);
		this.displayedTableDataMedications = this.pillboxes.slice(
			startIndex,
			endIndex
		);
	}
}
