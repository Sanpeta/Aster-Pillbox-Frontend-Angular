// blog.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterBlogComponent } from '../blogs/components/footer-blog/footer-blog.component';
import { HeaderBlogComponent } from '../blogs/components/header-blog/header-blog.component';
import { WhastappButtonBlogComponent } from '../blogs/components/whastapp-button-blog/whastapp-button-blog.component';

@Component({
	selector: 'app-blog',
	standalone: true,
	imports: [
		CommonModule,
		RouterLink,
		FooterBlogComponent,
		WhastappButtonBlogComponent,
		HeaderBlogComponent,
	],
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
	private route = inject(ActivatedRoute);
	isMenuOpen = false;

	article = {
		title: 'Como organizar seus medicamentos de forma eficiente',
		excerpt:
			'Dicas práticas para organizar seus medicamentos e garantir que você nunca perca uma dose.',
		content: `
      <p>Gerenciar medicamentos pode ser um desafio... <!-- conteúdo completo aqui --></p>
    `,
		image: '/assets/images/placeholder.svg',
		category: 'Organização',
		date: '10 Abr 2024',
		author: 'Equipe Aster',
		readTime: '5 min',
		relatedPosts: [
			{
				title: 'Os benefícios da tecnologia na gestão de medicamentos',
				excerpt:
					'Descubra como a tecnologia pode ajudar você a gerenciar seus medicamentos de forma mais eficiente.',
				image: '/assets/images/placeholder.svg',
				category: 'Tecnologia',
				slug: 'beneficios-tecnologia-medicamentos',
			},
			{
				title: 'Como envolver familiares no cuidado com medicamentos',
				excerpt:
					'Estratégias para incluir seus familiares no processo de gestão de medicamentos.',
				image: '/assets/images/placeholder.svg',
				category: 'Família',
				slug: 'envolver-familiares-cuidado-medicamentos',
			},
		],
	};

	categories = [
		'Organização',
		'Tecnologia',
		'Família',
		'Dicas',
		'Saúde',
		'Idosos',
	];

	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
	}

	openWhatsApp() {
		const message = `Olá! Estou interessado no artigo "${this.article.title}". Poderia me enviar mais informações?`;
		const phoneNumber = '5547992820932'; // Número de telefone do WhatsApp
		const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
			message
		)}`;
		window.open(url, '_blank');
	}

	shareOnSocialMedia(platform: string) {
		let url = '';
		const message = `Confira este artigo: ${this.article.title}`;

		switch (platform) {
			case 'facebook':
				url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					window.location.href
				)}&quote=${encodeURIComponent(message)}`;
				break;
			case 'twitter':
				url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
					window.location.href
				)}&text=${encodeURIComponent(message)}`;
				break;
			case 'linkedin':
				url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
					window.location.href
				)}&title=${encodeURIComponent(this.article.title)}`;
				break;
			default:
				return;
		}

		window.open(url, '_blank');
	}
}
