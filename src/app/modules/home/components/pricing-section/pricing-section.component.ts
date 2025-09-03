import {
	animate,
	query,
	stagger,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	Component,
	EventEmitter,
	inject,
	OnDestroy,
	Output,
	PLATFORM_ID,
} from '@angular/core';
import { RouterModule } from '@angular/router';

interface Plan {
	id: 'free' | 'monthly' | 'yearly';
	name: string;
	price: string;
	originalPrice?: string;
	period: string;
	discount?: string;
	features: string[];
	limitedFeatures?: string[];
	buttonText: string;
	popular: boolean;
	color: string;
	tag?: string;
	tagColor?: string;
	ariaLabel: string;
}

interface Feature {
	title: string;
	description: string;
	icon: 'pill' | 'users' | 'box' | 'headset';
}

interface FAQ {
	question: string;
	answer: string;
	expanded?: boolean;
}

interface Testimonial {
	name: string;
	age: number;
	text: string;
	image: string;
}

@Component({
	selector: 'app-pricing-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './pricing-section.component.html',
	styleUrls: ['./pricing-section.component.css'],
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
		trigger('cardHover', [
			transition('false => true', [
				animate(
					'0.3s ease-in-out',
					style({ transform: 'scale(1.05)' })
				),
			]),
			transition('true => false', [
				animate('0.3s ease-in-out', style({ transform: 'scale(1)' })),
			]),
		]),
	],
})
export class PricingSection implements OnDestroy {
	@Output() freePlanSelected = new EventEmitter<void>();
	@Output() premiumMonthlySelected = new EventEmitter<void>();
	@Output() premiumYearlySelected = new EventEmitter<void>();

	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	hoverStates: boolean[] = [false, false, false];
	savingsBadgeVisible = true;
	private shakeTimeouts: number[] = [];

	readonly plans: Plan[] = [
		{
			id: 'free',
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
			color: 'plan-free',
			ariaLabel: 'Plano gratuito com funcionalidades básicas',
		},
		{
			id: 'monthly',
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
			color: 'plan-popular',
			tag: 'MAIS POPULAR',
			tagColor: 'tag-popular',
			ariaLabel: 'Plano premium mensal com todas as funcionalidades',
		},
		{
			id: 'yearly',
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
			color: 'plan-premium',
			tag: 'MELHOR VALOR',
			tagColor: 'tag-value',
			ariaLabel: 'Plano premium anual com desconto especial',
		},
	];

	readonly testimonials: Testimonial[] = [
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

	readonly features: Feature[] = [
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

	readonly faq: FAQ[] = [
		{
			question: 'Posso cancelar minha assinatura a qualquer momento?',
			answer: 'Sim, você pode cancelar sua assinatura a qualquer momento, sem taxas adicionais. Seu acesso Premium continuará ativo até o final do período já pago.',
			expanded: false,
		},
		{
			question: 'Como funciona o período de teste de 7 dias?',
			answer: 'Você terá acesso a todos os recursos Premium por 7 dias sem cobrança. Após esse período, será cobrado automaticamente o valor do plano escolhido.',
			expanded: false,
		},
		{
			question: 'Quais são as formas de pagamento aceitas?',
			answer: 'Aceitamos cartões de crédito de todas as bandeiras, PIX e boleto bancário para pagamento único do plano anual.',
			expanded: false,
		},
	];

	ngOnDestroy(): void {
		this.clearAllTimeouts();
	}

	private clearAllTimeouts(): void {
		this.shakeTimeouts.forEach((timeout) => {
			if (typeof window !== 'undefined') {
				clearTimeout(timeout);
			}
		});
		this.shakeTimeouts = [];
	}

	startShake(index: number): void {
		if (!this.isBrowser) return;

		this.hoverStates[index] = true;
		const timeout = window.setTimeout(() => this.stopShake(index), 600);
		this.shakeTimeouts.push(timeout);
	}

	stopShake(index: number): void {
		this.hoverStates[index] = false;
	}

	hoverCard(index: number): void {
		// Implementar efeito hover se necessário
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'pricing_card_hover', {
		// 		plan_index: index,
		// 		plan_name: this.plans[index].name,
		// 	});
		// }
	}

	selectPlan(index: number): void {
		const plan = this.plans[index];

		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'plan_selection_attempt', {
		// 		plan_id: plan.id,
		// 		plan_name: plan.name,
		// 		plan_price: plan.price,
		// 	});
		// }

		switch (index) {
			case 0:
				this.freePlanSelected.emit();
				break;
			case 1:
				this.premiumMonthlySelected.emit();
				break;
			case 2:
				this.premiumYearlySelected.emit();
				break;
			default:
				console.warn('Índice de plano inválido:', index);
		}
	}

	toggleFAQ(index: number): void {
		this.faq[index].expanded = !this.faq[index].expanded;

		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'faq_interaction', {
		// 		question_index: index,
		// 		action: this.faq[index].expanded ? 'expand' : 'collapse',
		// 	});
		// }
	}

	trackByPlan(index: number, plan: Plan): string {
		return plan.id;
	}

	trackByFeature(index: number, feature: Feature): string {
		return feature.icon;
	}

	trackByFAQ(index: number, faq: FAQ): string {
		return faq.question;
	}

	getIconPath(icon: Feature['icon']): string {
		const iconPaths: Record<Feature['icon'], string> = {
			pill: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
			box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
			headset:
				'M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.07m-3.536 3.536a1 1 0 010-1.414m-1.414 1.414a3 3 0 010-4.243m4.243 4.243a3 3 0 014.243 0',
		};

		return iconPaths[icon] || iconPaths.pill;
	}

	dismissSavingsBadge(): void {
		this.savingsBadgeVisible = false;
	}
}
