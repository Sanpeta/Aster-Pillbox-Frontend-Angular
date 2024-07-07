import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-error-message',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './error-message.component.html',
	styleUrl: './error-message.component.css',
})
export class ErrorMessageComponent {
	@Input() control?: AbstractControl<string | null, string | null> | null;
	@Input() errorMessage?: string;
}
