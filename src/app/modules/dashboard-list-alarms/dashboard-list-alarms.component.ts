import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Medication {
	id: string;
	name: string;
	alarms: string[];
	quantity: number;
	compartiment: string;
}

@Component({
	selector: 'app-dashboard-list-alarms',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dashboard-list-alarms.component.html',
	styleUrl: './dashboard-list-alarms.component.css',
})
export class DashboardListAlarmsComponent {
	@Input() medications: Medication[] = [
		{
			id: 'med1',
			name: 'Paracetamol',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'A1',
		},
		{
			id: 'med2',
			name: 'Ibuprofeno',
			alarms: ['09:00', '21:00'],
			quantity: 1,
			compartiment: 'A2',
		},
		{
			id: 'med3',
			name: 'Dipirona',
			alarms: ['07:00', '19:00'],
			quantity: 3,
			compartiment: 'A3',
		},
		{
			id: 'med4',
			name: 'Dorflex',
			alarms: ['10:00', '22:00'],
			quantity: 2,
			compartiment: 'A4',
		},
		{
			id: 'med5',
			name: 'Omeprazol',
			alarms: ['08:00', '20:00'],
			quantity: 1,
			compartiment: 'A5',
		},
		{
			id: 'med6',
			name: 'Doril',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'B1',
		},
		{
			id: 'med7',
			name: 'Buscopan',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'B2',
		},
		{
			id: 'med8',
			name: 'Dorflex',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'B3',
		},
		{
			id: 'med9',
			name: 'Dipirona',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'B4',
		},
		{
			id: 'med10',
			name: 'Paracetamol',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'B5',
		},
		{
			id: 'med11',
			name: 'Ibuprofeno',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'C1',
		},
		{
			id: 'med12',
			name: 'Dorflex',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'C2',
		},
		{
			id: 'med13',
			name: 'Dipirona',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'C3',
		},
		{
			id: 'med14',
			name: 'Paracetamol',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'C4',
		},
		{
			id: 'med15',
			name: 'Ibuprofeno',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'C5',
		},
		{
			id: 'med16',
			name: 'Dorflex',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'D1',
		},
		{
			id: 'med17',
			name: 'Dipirona',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'D2',
		},
		{
			id: 'med18',
			name: 'Paracetamol',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'D3',
		},
		{
			id: 'med19',
			name: 'Ibuprofeno',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'D4',
		},
		{
			id: 'med20',
			name: 'Dorflex',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'D5',
		},
		{
			id: 'med21',
			name: 'Dipirona',
			alarms: ['08:00', '20:00'],
			quantity: 2,
			compartiment: 'E1',
		},
	];
	tableHeaders = ['Product name', 'Color', 'Category', 'Price'];

	displayedTableDataMedications: Medication[] = []; // Array para armazenar os dados exibidos
	itemsPerPage = 20; // Número de itens por página

	ngOnInit() {
		this.updateDisplayedData();
	}

	// ... (getRowValues)

	updateDisplayedData() {
		const startIndex = 0; // Começa do primeiro item
		const endIndex = Math.min(
			startIndex + this.itemsPerPage,
			this.medications.length
		);
		this.displayedTableDataMedications = this.medications.slice(
			startIndex,
			endIndex
		);
	}

	getRowValues(_t14: Medication): any {}
}
