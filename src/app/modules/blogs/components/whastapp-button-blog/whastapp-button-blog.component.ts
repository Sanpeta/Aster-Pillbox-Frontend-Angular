import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-whastapp-button-blog',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './whastapp-button-blog.component.html',
	styleUrl: './whastapp-button-blog.component.css',
})
export class WhastappButtonBlogComponent {
	// Número WhatsApp oficial da empresa
	private readonly WHATSAPP_NUMBER = '5547992820932';

	openWhatsApp() {
		const message = encodeURIComponent(
			'Olá! Gostaria de saber mais sobre o Aster Pillbox.'
		);
		window.open(
			`https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`,
			'_blank'
		);
	}
}
