import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	HostListener,
	Input,
	Output,
} from '@angular/core';

export interface DialogData {
	title: string;
	mensage: string;
	buttonTextConfirm: string;
	buttonTextClose?: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	icon?: string;
}

@Component({
	selector: 'app-dialog',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.css'],
	animations: [
		trigger('dialogAnimation', [
			transition(':enter', [
				style({
					opacity: 0,
					transform: 'scale(0.9) translateY(-10px)',
				}),
				animate(
					'300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
					style({ opacity: 1, transform: 'scale(1) translateY(0)' })
				),
			]),
			transition(':leave', [
				animate(
					'200ms cubic-bezier(0.25, 0.8, 0.25, 1)',
					style({
						opacity: 0,
						transform: 'scale(0.9) translateY(-10px)',
					})
				),
			]),
		]),
		trigger('backdropAnimation', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('250ms ease-out', style({ opacity: 1 })),
			]),
			transition(':leave', [
				animate('200ms ease-in', style({ opacity: 0 })),
			]),
		]),
	],
})
export class DialogComponent {
	@Input() data!: DialogData;
	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<void>();

	@HostListener('document:keydown.escape')
	onEscapeKey(): void {
		if (this.data.buttonTextClose) {
			this.onClose();
		}
	}

	onBackdropClick(): void {
		if (this.data.buttonTextClose) {
			this.onClose();
		}
	}

	onClose(): void {
		this.close.emit();
	}

	onConfirm(): void {
		this.confirm.emit();
	}

	getDialogIcon(): string {
		if (this.data.icon) {
			return this.data.icon;
		}

		switch (this.data.type) {
			case 'success':
				return 'M5 13l4 4L19 7';
			case 'error':
				return 'M6 18L18 6M6 6l12 12';
			case 'warning':
				return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
			default:
				return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
		}
	}

	getHeaderClass(): string {
		const baseClass = 'dialog-header';

		switch (this.data.type) {
			case 'success':
				return `${baseClass} dialog-header--success`;
			case 'error':
				return `${baseClass} dialog-header--error`;
			case 'warning':
				return `${baseClass} dialog-header--warning`;
			default:
				return `${baseClass} dialog-header--info`;
		}
	}
}
