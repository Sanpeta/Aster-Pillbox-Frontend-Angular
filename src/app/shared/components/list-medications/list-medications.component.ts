import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse } from '../../../models/interfaces/compartment_content/GetCompartmentContentsWithAlarmAndMedicationByUserID';
import { CompartmentContentsService } from '../../../services/compartment_content/compartment-contents.service';
import { IconComponent } from '../icon/icon.component';

interface Medication {
	id: number;
	name: string;
	alarms: string[];
	quantity: number;
	compartiment: string;
}

@Component({
	selector: 'app-list-medications',
	standalone: true,
	imports: [IconComponent, CommonModule, RouterModule],
	templateUrl: './list-medications.component.html',
	styleUrl: './list-medications.component.css',
})
export class ListMedicationsComponent implements OnInit {
	private destroy$ = new Subject<void>();
	public tableHeaders = [
		'Nome do Medicamento',
		'Alarmes',
		'Quantidade de comprimido(s) por horário',
		'Número do Compartimento',
	];
	medications: Medication[] = [];

	constructor(
		private compartmentContentsService: CompartmentContentsService
	) {}

	ngOnInit() {
		this.compartmentContentsService
			.getCompartmentContentsWithAlarmAndMedicationByUserID()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (
					response: GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse[]
				) => {
					console.log('Alarms fetched:', response);
					const compartmentContents = response;
					// Iterar sobre os resultados e fazer o que for necessário
					compartmentContents.map(
						(
							content: GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse
						) => {
							this.medications.push({
								id: content.medication_id,
								name: content.name,
								alarms: content.time_alarms,
								quantity: content.quantity_use_pill,
								compartiment:
									content.index_compartment.toString(),
							});
						}
					);
				},
				error: (error) => {
					console.error('Error fetching alarms:', error);
				},
				complete: () => {
					console.log('Alarms fetched successfully');
				},
			});
	}
}
