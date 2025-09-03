import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Message {
	text: string;
	time: string;
	sender: 'system' | 'user';
}

@Component({
	selector: 'app-whatsapp-community',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './whatsapp-community-section.component.html',
	styleUrls: ['./whatsapp-community-section.component.css'],
	animations: [
		trigger('fadeInUp', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateY(20px)' }),
				animate(
					'500ms ease-out',
					style({ opacity: 1, transform: 'translateY(0)' })
				),
			]),
		]),
	],
})
export class WhatsAppCommunity {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	readonly benefits: string[] = [
		'Suporte 24h da comunidade',
		'Avisos sobre atualizações do app',
		'Conteúdo exclusivo para membros',
	];

	readonly messages: Message[] = [
		{
			text: 'Olá! Bem-vindo à comunidade Aster Pillbox! 👋',
			time: '10:30',
			sender: 'system',
		},
		{
			text: 'Aqui você pode tirar dúvidas, compartilhar experiências e receber dicas sobre saúde e medicamentos.',
			time: '10:31',
			sender: 'system',
		},
		{
			text: 'Oi! Acabei de baixar o app e estou adorando! Como faço para configurar lembretes para meus medicamentos?',
			time: '10:35',
			sender: 'user',
		},
		{
			text: 'Vamos te ajudar! Veja este tutorial rápido que preparamos: [link]',
			time: '10:36',
			sender: 'system',
		},
	];

	joinCommunity(): void {
		if (!this.isBrowser) return;

		const message = encodeURIComponent(
			'Olá! Gostaria de participar da comunidade Aster Pillbox e receber dicas de saúde.'
		);
		const whatsappUrl = `https://wa.me/5547992820932?text=${message}`;

		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'community_join_attempt', {
		// 		source: 'community_section',
		// 	});
		// }
	}
}
