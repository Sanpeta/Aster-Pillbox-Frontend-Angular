// dialog.component.ts
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface DialogData {
	title: string;
	mensage: string;
	buttonTextConfirm: string;
	buttonTextClose: string;
}

@Component({
	selector: 'app-dialog',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dialog.component.html',
	animations: [
		trigger('dialogAnimation', [
			transition(':enter', [
				style({ opacity: 0, transform: 'scale(0.8)' }),
				animate(
					'200ms ease-out',
					style({ opacity: 1, transform: 'scale(1)' })
				),
			]),
			transition(':leave', [
				animate(
					'150ms ease-in',
					style({ opacity: 0, transform: 'scale(0.8)' })
				),
			]),
		]),
		trigger('backdropAnimation', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('200ms ease-out', style({ opacity: 1 })),
			]),
			transition(':leave', [
				animate('150ms ease-in', style({ opacity: 0 })),
			]),
		]),
	],
})
export class DialogComponent {
	@Input() data!: DialogData;
	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<void>();

	onClose(): void {
		this.close.emit();
	}

	onConfirm(): void {
		this.confirm.emit();
	}
}
