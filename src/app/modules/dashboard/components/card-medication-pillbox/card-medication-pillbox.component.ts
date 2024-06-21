import { Component } from '@angular/core';
import { SelectComponent } from '../../../../shared/components/select/select.component';

@Component({
	selector: 'app-card-medication-pillbox',
	standalone: true,
	imports: [SelectComponent],
	templateUrl: './card-medication-pillbox.component.html',
	styleUrl: './card-medication-pillbox.component.css',
})
export class CardMedicationPillboxComponent {}
