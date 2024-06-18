import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-dialog',
	standalone: true,
	imports: [],
	templateUrl: './dialog.component.html',
	styleUrl: './dialog.component.css',
})
export class DialogComponent {
	@Input() data: {
		title: string;
		mensage: string;
		buttonTextConfirm: string;
		buttonTextClose: string | null;
	} = {
		title: '',
		mensage: '',
		buttonTextConfirm: '',
		buttonTextClose: null,
	};
	@Output() confirm = new EventEmitter<void>();
	@Output() close = new EventEmitter<void>();

	onClose() {
		this.close.emit();
	}

	onConfirm() {
		this.confirm.emit();
		this.onClose(); // Fecha o diálogo após a confirmação
	}
}
