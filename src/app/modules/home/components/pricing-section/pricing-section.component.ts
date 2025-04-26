import {
	animate,
	query,
	stagger,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-pricing-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './pricing-section.component.html',
	animations: [
		trigger('staggerAnimation', [
			transition('* => *', [
				query(
					':enter',
					[
						style({ opacity: 0, transform: 'translateY(20px)' }),
						stagger(100, [
							animate(
								'0.5s ease-out',
								style({
									opacity: 1,
									transform: 'translateY(0)',
								})
							),
						]),
					],
					{ optional: true }
				),
			]),
		]),
		trigger('fadeInUp', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateY(20px)' }),
				animate(
					'0.5s ease-out',
					style({ opacity: 1, transform: 'translateY(0)' })
				),
			]),
		]),
		trigger('pulse', [
			transition('* => *', [
				animate(
					'0.3s ease-in-out',
					style({ transform: 'scale(1.05)' })
				),
				animate('0.3s ease-in-out', style({ transform: 'scale(1)' })),
			]),
		]),
	],
})
export class PricingSection {
	@Output() freePlanSelected = new EventEmitter<void>();
	@Output() premiumMonthlySelected = new EventEmitter<void>();
	@Output() premiumYearlySelected = new EventEmitter<void>();

	hoverStates: boolean[] = [false, false, false];
	savingsBadgeVisible = true;

	plans = [
		{
			name: 'START',
			price: 'R$0',
			period: '/mês',
			features: [
				'Monitoramento da Tomada de Medicação',
				'Visualização do Histórico de Medicação',
				'Lembretes Personalizados de Medicação',
			],
			limitedFeatures: [
				'Limite de 3 medicamentos',
				'Sem acesso ao gerenciamento de estoque',
				'Sem acesso ao acompanhamento de cuidadores',
			],
			buttonText: 'Começar Grátis',
			popular: false,
			color: 'bg-gray-400',
		},
		{
			name: 'PREMIUM MENSAL',
			price: 'R$9,90',
			originalPrice: 'R$14,90',
			period: '/mês',
			features: [
				'Monitoramento ilimitado de medicamentos',
				'Visualização detalhada do histórico',
				'Lembretes personalizados avançados',
				'Convite para até 5 cuidadores ou familiares',
				'Calendário completo de medicação',
				'Gerenciamento de estoque com alertas',
				'Suporte prioritário via WhatsApp',
			],
			buttonText: 'Experimentar por 7 dias',
			popular: true,
			color: 'bg-blue-600',
			tag: 'MAIS POPULAR',
			tagColor: 'bg-green-500',
		},
		{
			name: 'PREMIUM ANUAL',
			price: 'R$99,90',
			originalPrice: 'R$178,80',
			period: '/ano',
			discount: 'Economize R$78,90',
			features: [
				'Monitoramento ilimitado de medicamentos',
				'Visualização detalhada do histórico',
				'Lembretes personalizados avançados',
				'Convite para até 5 cuidadores ou familiares',
				'Calendário completo de medicação',
				'Gerenciamento de estoque com alertas',
				'Suporte prioritário via WhatsApp',
				'Relatórios avançados para profissionais',
			],
			buttonText: 'Obter melhor oferta',
			popular: false,
			color: 'bg-indigo-900',
			tag: 'MELHOR VALOR',
			tagColor: 'bg-yellow-500',
		},
	];

	testimonials = [
		{
			name: 'Maria Silva',
			age: 68,
			text: 'Desde que comecei a usar o Premium, nunca mais esqueci meus remédios. Meus filhos ficam mais tranquilos porque podem acompanhar tudo.',
			image: '/assets/images/testimonial-1.jpg',
		},
		{
			name: 'Carlos Oliveira',
			age: 72,
			text: 'O gerenciamento de estoque me avisa quando preciso comprar mais remédios. É como ter um assistente pessoal cuidando da minha saúde.',
			image: '/assets/images/testimonial-2.jpg',
		},
	];

	features = [
		{
			title: 'Monitoramento da Tomada de Medicação',
			description:
				'Nunca mais esqueça de tomar seus medicamentos no horário correto.',
			icon: 'pill',
		},
		{
			title: 'Convite para Cuidadores',
			description:
				'Familiares podem acompanhar em tempo real se você está seguindo o tratamento.',
			icon: 'users',
		},
		{
			title: 'Gerenciamento de Estoque',
			description:
				'Receba alertas quando seus medicamentos estiverem acabando.',
			icon: 'box',
		},
		{
			title: 'Suporte Prioritário',
			description:
				'Atendimento exclusivo via WhatsApp para assinantes Premium.',
			icon: 'headset',
		},
	];

	faq = [
		{
			question: 'Posso cancelar minha assinatura a qualquer momento?',
			answer: 'Sim, você pode cancelar sua assinatura a qualquer momento, sem taxas adicionais. Seu acesso Premium continuará ativo até o final do período já pago.',
		},
		{
			question: 'Como funciona o período de teste de 7 dias?',
			answer: 'Você terá acesso a todos os recursos Premium por 7 dias sem cobrança. Após esse período, será cobrado automaticamente o valor do plano escolhido.',
		},
		{
			question: 'Quais são as formas de pagamento aceitas?',
			answer: 'Aceitamos cartões de crédito de todas as bandeiras, PIX e boleto bancário para pagamento único do plano anual.',
		},
	];

	startShake(index: number) {
		this.hoverStates[index] = true;
		setTimeout(() => this.stopShake(index), 600);
	}

	stopShake(index: number) {
		this.hoverStates[index] = false;
	}

	hoverCard(index: number) {
		// Implement hover effect if needed
	}

	selectPlan(index: number) {
		if (index === 0) {
			this.freePlanSelected.emit();
		} else if (index === 1) {
			this.premiumMonthlySelected.emit();
		} else if (index === 2) {
			this.premiumYearlySelected.emit();
		}
	}
}
