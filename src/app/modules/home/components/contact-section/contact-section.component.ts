import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	PLATFORM_ID,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-contact-section',
	standalone: true,
	imports: [CommonModule, RouterModule, ReactiveFormsModule],
	templateUrl: './contact-section.component.html',
	styleUrls: ['./contact-section.component.css'],
	animations: [
		trigger('fadeInLeft', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(-20px)' }),
				animate(
					'500ms ease-out',
					style({ opacity: 1, transform: 'translateX(0)' })
				),
			]),
		]),
		trigger('fadeInRight', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(20px)' }),
				animate(
					'500ms ease-out',
					style({ opacity: 1, transform: 'translateX(0)' })
				),
			]),
		]),
	],
})
export class ContactSection {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	@Input() formGroup!: FormGroup;
	@Output() submitForm = new EventEmitter<void>();

	onSubmit(): void {
		if (this.formGroup.valid) {
			this.submitForm.emit();
		} else {
			this.markFormGroupTouched(this.formGroup);
		}
	}

	openWhatsApp(): void {
		if (!this.isBrowser) return;

		const message = encodeURIComponent(
			'Olá! Gostaria de tirar algumas dúvidas sobre o Aster Pillbox.'
		);
		const whatsappUrl = `https://wa.me/5547992820932?text=${message}`;

		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

		// if (typeof gtag !== 'undefined') {
		// 	gtag('event', 'contact_whatsapp', {
		// 		source: 'contact_form',
		// 	});
		// }
	}

	private markFormGroupTouched(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach((key) => {
			const control = formGroup.get(key);
			control?.markAsTouched();
		});
	}
}
