import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-newsletter-blog',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './newsletter-blog.component.html',
	styleUrl: './newsletter-blog.component.css',
})
export class NewsletterBlogComponent {
	email: string = '';

	onSubmit(): void {
		console.log('Email cadastrado:', this.email);
		// Implementar lógica para inscrição no newsletter
		this.email = '';
	}
}
