import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-toast',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.css'],
	animations: [
		trigger('fadeInOut', [
			state('void', style({ opacity: 0 })),
			transition('void <=> *', animate('300ms ease-in-out')),
		]),
	],
})
export class ToastComponent {
	@Input() type: 'success' | 'error' | 'info' | 'warning' = 'success';
	@Input() mensage: string = '';
	@Input() duration: number = 3000; // Duração em milissegundos
	@Output() closeToast = new EventEmitter<void>();

	showToast = false;

	constructor() {}

	ngOnInit() {
		this.showToast = true;
		setTimeout(() => this.close(), this.duration);
	}

	close() {
		this.showToast = false;
		this.closeToast.emit();
	}
}
