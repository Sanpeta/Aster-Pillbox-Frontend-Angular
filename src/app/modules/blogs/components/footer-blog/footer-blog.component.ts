import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-footer-blog',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './footer-blog.component.html',
	styleUrl: './footer-blog.component.css',
})
export class FooterBlogComponent {
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
