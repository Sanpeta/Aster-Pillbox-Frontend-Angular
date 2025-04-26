import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-showcase',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './showcase.component.html',
	animations: [
		trigger('slideFade', [
			transition(':increment, :decrement', [
				style({ opacity: 0, transform: 'scale(0.95)' }),
				animate(
					'400ms ease-out',
					style({ opacity: 1, transform: 'scale(1)' })
				),
			]),
		]),
		trigger('contentFade', [
			transition(':increment, :decrement', [
				style({ opacity: 0, transform: 'translateY(20px)' }),
				animate(
					'500ms ease-out',
					style({ opacity: 1, transform: 'translateY(0)' })
				),
			]),
		]),
	],
})
export class AppShowcase implements OnInit, OnDestroy {
	currentIndex = signal(0);
	private autoplayInterval: any;

	screenshots = [
		{
			image: '/assets/images/screenshots/medication-management.png',
			title: 'Gerenciamento de Medicamentos',
			description:
				'Visualize todos os seus medicamentos em um só lugar, com informações detalhadas sobre dosagem, horários e instruções específicas.',
		},
		{
			image: '/assets/images/screenshots/reminders.png',
			title: 'Lembretes Personalizados',
			description:
				'Configure lembretes para nunca mais esquecer de tomar seus medicamentos no horário certo, mesmo com rotinas complexas ou múltiplos medicamentos.',
		},
		{
			image: '/assets/images/screenshots/history.png',
			title: 'Histórico de Medicação',
			description:
				'Acompanhe seu histórico de medicação e compartilhe relatórios detalhados com seu médico ou cuidadores para um melhor acompanhamento.',
		},
		{
			image: '/assets/images/screenshots/inventory.png',
			title: 'Monitoramento de Estoque',
			description:
				'Receba alertas quando seus medicamentos estiverem acabando e mantenha um registro do que precisa ser reabastecido nas próximas consultas.',
		},
	];

	ngOnInit(): void {
		// Auto rotate slides every 5 seconds
		this.startAutoplay();
	}

	ngOnDestroy(): void {
		this.stopAutoplay();
	}

	startAutoplay(): void {
		this.autoplayInterval = setInterval(() => {
			this.nextSlide();
		}, 5000);
	}

	stopAutoplay(): void {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
		}
	}

	resetAutoplay(): void {
		this.stopAutoplay();
		this.startAutoplay();
	}

	nextSlide() {
		this.currentIndex.update(
			(prev) => (prev + 1) % this.screenshots.length
		);
		this.resetAutoplay();
	}

	prevSlide() {
		this.currentIndex.update(
			(prev) =>
				(prev - 1 + this.screenshots.length) % this.screenshots.length
		);
		this.resetAutoplay();
	}

	goToSlide(index: number): void {
		this.currentIndex.set(index);
		this.resetAutoplay();
	}
}
