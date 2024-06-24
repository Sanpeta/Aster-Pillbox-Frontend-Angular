import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-form-time-input-list',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './form-time-input-list.component.html',
	styleUrl: './form-time-input-list.component.css',
})
export class FormTimeInputListComponent {
	@Input() time: string[] = ['']; // Array inicial de horários
	@Output() timeChange = new EventEmitter<string[]>();

	addTime() {
		this.time.push(''); // Adiciona um novo horário vazio
		this.timeChange.emit(this.time); // Emite o array atualizado
	}

	removeTime(index: number) {
		this.time.splice(index, 1); // Remove o horário no índice especificado
		this.timeChange.emit(this.time); // Emite o array atualizado
	}
}
