import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { GetCaseResponse } from '../../models/interfaces/case/GetCase';
import { CaseService } from './../../services/case/case.service';

interface Pillbox extends GetCaseResponse {
	status: boolean;
}

@Component({
	selector: 'app-dashboard-list-pillboxes',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './dashboard-list-pillboxes.component.html',
	styleUrl: './dashboard-list-pillboxes.component.css',
})
export class DashboardListPillboxesComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	public pillbox_id: number = 0;
	private selectedPillbox: Pillbox | null = null;

	// Variáveis de estado
	public searchTerm: string = '';
	public currentPage: number = 1;
	public itemsPerPage: number = 10;
	public statusFilter: string = 'all';
	public showDeleteModal: boolean = false;

	// Dados
	public pillboxes: Pillbox[] = [];
	public displayedTableDataPillboxes: Pillbox[] = [];

	// Cabeçalhos da tabela
	tableHeaders = [
		'Nome da Caixa de Medicamento',
		'Endereço MAC',
		'Quantidade de Linhas',
		'Quantidade de Colunas',
		'Status',
		'Ações',
	];
	Math: any;

	constructor(
		private caseService: CaseService,
		private cookie: CookieService,
		private router: Router
	) {}

	ngOnInit() {
		this.loadPillboxes();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	// Carregar dados
	private loadPillboxes() {
		this.caseService
			.getCasesByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: GetCaseResponse[]) => {
					this.pillboxes = response.map((p) => ({
						...p,
						status: p.status,
					}));
					this.applyFilters();
				},
				error: (err) => console.error(err),
			});
	}

	// Filtros e pesquisa
	applySearchFilter(event: Event) {
		this.searchTerm = (
			event.target as HTMLInputElement
		).value.toLowerCase();
		this.currentPage = 1;
		this.applyFilters();
	}

	applyStatusFilter(event: Event) {
		this.statusFilter = (event.target as HTMLSelectElement).value;
		this.currentPage = 1;
		this.applyFilters();
	}

	private applyFilters() {
		let filtered = this.pillboxes.filter((p) => {
			const matchesSearch = p.case_name
				.toLowerCase()
				.includes(this.searchTerm);
			const matchesStatus =
				this.statusFilter === 'all' ||
				(this.statusFilter === 'Ativo' && p.status) ||
				(this.statusFilter === 'Inativo' && !p.status);
			return matchesSearch && matchesStatus;
		});

		// Paginação
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		this.displayedTableDataPillboxes = filtered.slice(startIndex, endIndex);
	}

	// Contagens e cálculos
	get activePillboxesCount(): number {
		return this.pillboxes.filter((p) => p.status).length;
	}

	get inactivePillboxesCount(): number {
		return this.pillboxes.filter((p) => !p.status).length;
	}

	getTotalCompartments(): number {
		return this.pillboxes.reduce(
			(acc, curr) => acc + curr.row_size * curr.column_size,
			0
		);
	}

	get pageCount(): number {
		return Math.ceil(this.pillboxes.length / this.itemsPerPage);
	}

	// Paginação
	setPage(page: number): void {
		if (page < 1 || page > this.pageCount) return;
		this.currentPage = page;
		this.applyFilters();
	}

	prevPage(): void {
		this.setPage(this.currentPage - 1);
	}

	nextPage(): void {
		this.setPage(this.currentPage + 1);
	}

	// Controle do modal
	confirmDelete(pillbox: Pillbox): void {
		this.selectedPillbox = pillbox;
		this.showDeleteModal = true;
	}

	cancelDelete(): void {
		this.selectedPillbox = null;
		this.showDeleteModal = false;
	}

	deletePillbox(): void {
		if (!this.selectedPillbox) return;

		// this.caseService
		// 	.deleteCase(this.selectedPillbox.id)
		// 	.pipe(takeUntil(this.destroy$))
		// 	.subscribe({
		// 		next: () => {
		// 			this.pillboxes = this.pillboxes.filter(
		// 				(p) => p.id !== this.selectedPillbox?.id
		// 			);
		// 			this.applyFilters();
		// 			this.cancelDelete();
		// 		},
		// 		error: (err) => console.error('Erro ao excluir:', err),
		// 	});
	}
}
