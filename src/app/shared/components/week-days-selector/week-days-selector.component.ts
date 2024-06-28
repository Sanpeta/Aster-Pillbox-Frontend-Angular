import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-week-days-selector',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './week-days-selector.component.html',
	styleUrl: './week-days-selector.component.css',
})
export class WeekDaysSelectorComponent {
	@Input() selectedDays: boolean[] = [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	];
	@Output() selectionChange = new EventEmitter<boolean[]>();

	daysOfWeek = [
		'Domingo',
		'Segunda',
		'Terça',
		'Quarta',
		'Quinta',
		'Sexta',
		'Sábado',
	];

	toggleDaySelection(index: number) {
		this.selectedDays[index] = !this.selectedDays[index];
		this.selectionChange.emit(this.selectedDays); // Emite uma cópia do array
	}
}
