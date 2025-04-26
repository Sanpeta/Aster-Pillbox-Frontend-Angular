import {
	animate,
	query,
	stagger,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Feature {
	icon: string;
	title: string;
	description: string;
	primaryAction: string;
	secondaryAction: string;
}

@Component({
	selector: 'app-features-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './features-section.component.html',
	animations: [
		trigger('staggerAnimation', [
			transition('* => *', [
				query(
					':enter',
					[
						style({ opacity: 0, transform: 'translateY(25px)' }),
						stagger(120, [
							animate(
								'0.6s cubic-bezier(0.35, 0, 0.25, 1)',
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
	],
})
export class FeaturesSection implements OnInit {
	features: Feature[] = [];
	isLoading = true;

	ngOnInit(): void {
		// Simulating data fetch delay
		setTimeout(() => {
			this.features = [
				{
					icon: 'clock',
					title: 'Monitoramento da Tomada de Medicação',
					description:
						'Acompanhe em tempo real cada medicamento tomado, com registro preciso de horário e compartimento, garantindo seu tratamento conforme prescrito.',
					primaryAction: 'Comece Agora',
					secondaryAction: 'Veja como funciona',
				},
				{
					icon: 'history',
					title: 'Histórico de Medicação Detalhado',
					description:
						'Visualize seu histórico completo com gráficos intuitivos, identificando padrões e acompanhando sua aderência ao tratamento de forma clara e objetiva.',
					primaryAction: 'Comece Agora',
					secondaryAction: 'Veja como funciona',
				},
				{
					icon: 'bell',
					title: 'Lembretes Inteligentes',
					description:
						'Configure alarmes personalizados para cada medicamento, com suporte a periodicidades complexas e notificações adaptáveis às suas preferências pessoais.',
					primaryAction: 'Comece Agora',
					secondaryAction: 'Veja como funciona',
				},
				{
					icon: 'package',
					title: 'Controle de Estoque Automático',
					description:
						'Monitore seu estoque de medicamentos com previsões inteligentes de reabastecimento, alertas personalizados e integração com farmácias parceiras.',
					primaryAction: 'Comece Agora',
					secondaryAction: 'Veja como funciona',
				},
				{
					icon: 'calendar',
					title: 'Calendário Interativo',
					description:
						'Organize sua rotina de medicação em um calendário visual e interativo, com códigos de cores e filtros avançados para uma gestão simplificada.',
					primaryAction: 'Comece Agora',
					secondaryAction: 'Veja como funciona',
				},
				{
					icon: 'users',
					title: 'Rede de Cuidados Conectada',
					description:
						'Convide cuidadores e familiares para acompanhar seu tratamento em tempo real, com diferentes níveis de permissão e alertas emergenciais quando necessário.',
					primaryAction: 'Comece Agora',
					secondaryAction: 'Veja como funciona',
				},
			];
			this.isLoading = false;
		}, 500);
	}

	trackByFn(index: number, item: Feature): number {
		return index;
	}

	handleActionClick(action: string, feature: string): void {
		console.log(`Ação "${action}" clicada para o recurso "${feature}"`);
		// Implementar navegação ou outras ações conforme necessário
	}
}
