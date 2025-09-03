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
	inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

interface Feature {
	icon:
		| 'smart-device'
		| 'analytics'
		| 'shield'
		| 'network'
		| 'calendar'
		| 'health';
	title: string;
	description: string;
	benefits: string[];
	primaryAction: string;
	secondaryAction: string;
	ariaLabel?: string;
	// Novos campos baseados no schema
	tableName?: string;
	complexity: 'basic' | 'advanced' | 'professional';
	requiresPremium: boolean;
}

interface HealthMetric {
	name: string;
	value: string;
	trend: 'up' | 'down' | 'stable';
	icon: string;
}

@Component({
	selector: 'app-features-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './features-section.component.html',
	styleUrls: ['./features-section.component.css'],
	animations: [
		trigger('staggerAnimation', [
			transition('* => *', [
				query(
					':enter',
					[
						style({ opacity: 0, transform: 'translateY(30px)' }),
						stagger(150, [
							animate(
								'0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
		trigger('fadeInScale', [
			transition(':enter', [
				style({ opacity: 0, transform: 'scale(0.9)' }),
				animate(
					'0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					style({ opacity: 1, transform: 'scale(1)' })
				),
			]),
		]),
	],
})
export class FeaturesSection implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	features: Feature[] = [];
	healthMetrics: HealthMetric[] = [];
	isLoading = true;
	showAdvancedFeatures = false;

	private readonly featuresData: Feature[] = [
		{
			icon: 'smart-device',
			title: 'Dispositivos IoT Inteligentes',
			description:
				'Pillboxes conectados que detectam automaticamente quando medicamentos são retirados, enviando confirmações em tempo real para familiares.',
			benefits: [
				'Detecção automática de doses',
				'Sincronização em tempo real',
				'Alertas para familiares',
				'Histórico detalhado de uso',
			],
			primaryAction: 'Ver Dispositivos',
			secondaryAction: 'Como Funciona',
			tableName: 'devices',
			complexity: 'advanced',
			requiresPremium: true,
			ariaLabel:
				'Dispositivos IoT para monitoramento automático de medicação',
		},
		{
			icon: 'analytics',
			title: 'Análises Avançadas de Saúde',
			description:
				'Relatórios inteligentes que identificam padrões, preveem necessidades e geram insights personalizados sobre seu tratamento.',
			benefits: [
				'Análises preditivas de estoque',
				'Relatórios médicos automáticos',
				'Insights de aderência',
				'Tendências de saúde',
			],
			primaryAction: 'Ver Relatórios',
			secondaryAction: 'Exemplo Prático',
			tableName: 'automated_reports',
			complexity: 'professional',
			requiresPremium: true,
			ariaLabel: 'Sistema de análises e relatórios avançados de saúde',
		},
		{
			icon: 'shield',
			title: 'Segurança e Compliance Médica',
			description:
				'Proteção total dos seus dados médicos com criptografia de nível hospitalar e conformidade com LGPD e regulamentações de saúde.',
			benefits: [
				'Criptografia de ponta a ponta',
				'Backup automático seguro',
				'Auditoria completa de acessos',
				'Conformidade LGPD/HIPAA',
			],
			primaryAction: 'Saiba Mais',
			secondaryAction: 'Ver Certificações',
			tableName: 'audit_logs',
			complexity: 'professional',
			requiresPremium: false,
			ariaLabel: 'Sistema de segurança e proteção de dados médicos',
		},
		{
			icon: 'network',
			title: 'Rede Colaborativa de Cuidados',
			description:
				'Conecte até 8 familiares e cuidadores com permissões granulares, notificações emergenciais e compartilhamento controlado.',
			benefits: [
				'Até 8 cuidadores conectados',
				'Permissões personalizáveis',
				'Alertas emergenciais inteligentes',
				'Comunicação em tempo real',
			],
			primaryAction: 'Convidar Família',
			secondaryAction: 'Ver Exemplo',
			tableName: 'family_connections',
			complexity: 'advanced',
			requiresPremium: true,
			ariaLabel: 'Rede de familiares e cuidadores conectados',
		},
		{
			icon: 'calendar',
			title: 'Agendamento Médico Inteligente',
			description:
				'Calendário avançado que sincroniza medicamentos, consultas e exames com lembretes contextuais e preparação automática.',
			benefits: [
				'Sincronização com agenda médica',
				'Preparação automática para consultas',
				'Lembretes contextuais',
				'Integração com profissionais',
			],
			primaryAction: 'Organizar Agenda',
			secondaryAction: 'Tour Interativo',
			tableName: 'medication_schedules',
			complexity: 'advanced',
			requiresPremium: true,
			ariaLabel:
				'Sistema de agendamento médico e organização de tratamentos',
		},
		{
			icon: 'health',
			title: 'Monitoramento de Sinais Vitais',
			description:
				'Registro e análise de pressão arterial, glicemia, peso e outros indicadores com correlação automática com medicação.',
			benefits: [
				'Múltiplos tipos de medição',
				'Correlação com medicamentos',
				'Alertas de valores anormais',
				'Histórico visual completo',
			],
			primaryAction: 'Registrar Vitais',
			secondaryAction: 'Ver Dashboard',
			tableName: 'vital_signs',
			complexity: 'basic',
			requiresPremium: false,
			ariaLabel: 'Monitoramento e registro de sinais vitais',
		},
	];

	private readonly healthMetricsData: HealthMetric[] = [
		{
			name: 'Aderência Média',
			value: '94.8%',
			trend: 'up',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			name: 'Dispositivos Conectados',
			value: '2,847',
			trend: 'up',
			icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
		},
		{
			name: 'Famílias Beneficiadas',
			value: '1,203',
			trend: 'up',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
		},
		{
			name: 'Tempo Médio Economia',
			value: '2.3h/dia',
			trend: 'stable',
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
		},
	];

	ngOnInit(): void {
		this.loadFeatures();
		this.loadHealthMetrics();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private loadFeatures(): void {
		const loadingDelay = this.isBrowser ? 300 : 0;

		setTimeout(() => {
			this.features = [...this.featuresData];
			this.isLoading = false;
		}, loadingDelay);
	}

	private loadHealthMetrics(): void {
		setTimeout(() => {
			this.healthMetrics = [...this.healthMetricsData];
		}, 500);
	}

	toggleAdvancedFeatures(): void {
		this.showAdvancedFeatures = !this.showAdvancedFeatures;
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'toggle_advanced_features', {
		// 		show: this.showAdvancedFeatures,
		// 		source: 'features_section',
		// 	});
		// }
	}

	getFilteredFeatures(): Feature[] {
		if (this.showAdvancedFeatures) {
			return this.features;
		}
		return this.features.filter((f) => f.complexity !== 'professional');
	}

	trackByFn(index: number, item: Feature): string {
		return `${item.icon}-${index}`;
	}

	handleActionClick(action: string, feature: Feature): void {
		const actionHandlers: Record<string, () => void> = {
			'Ver Dispositivos': () => this.showDevices(feature),
			'Ver Relatórios': () => this.showReports(feature),
			'Saiba Mais': () => this.showInfo(feature),
			'Convidar Família': () => this.inviteFamily(feature),
			'Organizar Agenda': () => this.organizeSchedule(feature),
			'Registrar Vitais': () => this.recordVitals(feature),
			'Como Funciona': () => this.showHowItWorks(feature),
			'Exemplo Prático': () => this.showExample(feature),
			'Ver Certificações': () => this.showCertifications(feature),
			'Ver Exemplo': () => this.showExample(feature),
			'Tour Interativo': () => this.startTour(feature),
			'Ver Dashboard': () => this.showDashboard(feature),
		};

		const handler = actionHandlers[action];
		if (handler) {
			handler();
		} else {
			console.warn(
				`Ação desconhecida: ${action} para feature: ${feature.title}`
			);
		}
	}

	private showDevices(feature: Feature): void {
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'feature_action', {
		// 		feature_name: feature.title,
		// 		action: 'show_devices',
		// 		table_name: feature.tableName,
		// 	});
		// }
		// // Implementar modal ou navegação para dispositivos IoT
	}

	private showReports(feature: Feature): void {
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'feature_action', {
		// 		feature_name: feature.title,
		// 		action: 'show_reports',
		// 		table_name: feature.tableName,
		// 	});
		// }
		// Implementar modal ou navegação para relatórios
	}

	private showInfo(feature: Feature): void {
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'feature_info', {
		// 		feature_name: feature.title,
		// 		complexity: feature.complexity,
		// 		requires_premium: feature.requiresPremium,
		// 	});
		// }
		// Implementar modal informativo
	}

	private inviteFamily(feature: Feature): void {
		// Implementar funcionalidade de convite para família
		console.log('Convidando família para:', feature.title);
	}

	private organizeSchedule(feature: Feature): void {
		// Implementar organizador de agenda
		console.log('Organizando agenda para:', feature.title);
	}

	private recordVitals(feature: Feature): void {
		// Implementar registro de sinais vitais
		console.log('Registrando vitais para:', feature.title);
	}

	private showHowItWorks(feature: Feature): void {
		console.log('Mostrando como funciona:', feature.title);
	}

	private showExample(feature: Feature): void {
		console.log('Mostrando exemplo de:', feature.title);
	}

	private showCertifications(feature: Feature): void {
		console.log('Mostrando certificações de:', feature.title);
	}

	private startTour(feature: Feature): void {
		console.log('Iniciando tour de:', feature.title);
	}

	private showDashboard(feature: Feature): void {
		console.log('Mostrando dashboard de:', feature.title);
	}

	getIconPath(icon: Feature['icon']): string {
		const iconPaths: Record<Feature['icon'], string> = {
			'smart-device':
				'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
			analytics:
				'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
			shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			network:
				'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
			calendar:
				'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
			health: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
		};

		return iconPaths[icon] || iconPaths['smart-device'];
	}

	getComplexityLabel(complexity: Feature['complexity']): string {
		const labels = {
			basic: 'Básico',
			advanced: 'Avançado',
			professional: 'Profissional',
		};
		return labels[complexity];
	}

	getComplexityColor(complexity: Feature['complexity']): string {
		const colors = {
			basic: 'complexity-basic',
			advanced: 'complexity-advanced',
			professional: 'complexity-professional',
		};
		return colors[complexity];
	}
}
