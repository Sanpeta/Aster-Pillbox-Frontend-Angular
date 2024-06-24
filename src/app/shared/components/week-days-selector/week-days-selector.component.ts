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
	@Input() selectedDays: string[] = [];
	@Output() selectionChange = new EventEmitter<string[]>();

	daysOfWeek = [
		'Segunda',
		'Terça',
		'Quarta',
		'Quinta',
		'Sexta',
		'Sábado',
		'Domingo',
	];

	toggleDaySelection(day: string) {
		this.selectedDays = this.selectedDays.includes(day)
			? this.selectedDays.filter((d) => d !== day)
			: [...this.selectedDays, day];

		this.selectionChange.emit(this.selectedDays); // Notificar o componente pai
	}
}
