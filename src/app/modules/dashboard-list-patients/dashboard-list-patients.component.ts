import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Pacient {
	name: string;
	age: number;
	genre: string;
	namePillBox: string;
	status: boolean;
}

@Component({
	selector: 'app-dashboard-list-patients',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dashboard-list-patients.component.html',
	styleUrl: './dashboard-list-patients.component.css',
})
export class DashboardListPatientsComponent {
	@Input() patients: Pacient[] = [
		{
			name: 'Maria Silva',
			age: 65,
			genre: 'Feminino',
			namePillBox: 'Caixa A',
			status: true,
		},
		{
			name: 'João Santos',
			age: 42,
			genre: 'Masculino',
			namePillBox: 'Caixa B',
			status: false,
		},
		{
			name: 'Ana Oliveira',
			age: 28,
			genre: 'Feminino',
			namePillBox: 'Caixa C',
			status: true,
		},
	];
	tableHeaders = ['Product name', 'Color', 'Category', 'Price'];

	displayedTableDataMedications: Pacient[] = []; // Array para armazenar os dados exibidos
	itemsPerPage = 20; // Número de itens por página

	ngOnInit() {
		this.updateDisplayedData();
	}

	// ... (getRowValues)

	updateDisplayedData() {
		const startIndex = 0; // Começa do primeiro item
		const endIndex = Math.min(
			startIndex + this.itemsPerPage,
			this.patients.length
		);
		this.displayedTableDataMedications = this.patients.slice(
			startIndex,
			endIndex
		);
	}

	getRowValues(_t14: Pacient): any {}
}
