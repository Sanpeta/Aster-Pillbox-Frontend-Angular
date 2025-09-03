import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	Component,
	inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

interface AppFeature {
	image: string;
	title: string;
	description: string;
	alt: string;
	// Novos campos baseados no schema
	tableName: string;
	keyBenefits: string[];
	userType: 'patient' | 'caregiver' | 'professional' | 'all';
	premiumFeature: boolean;
}

interface UserStatistic {
	label: string;
	value: string;
	description: string;
	icon: string;
}

@Component({
	selector: 'app-showcase',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './showcase.component.html',
	styleUrls: ['./showcase.component.css'],
	animations: [
		trigger('slideFade', [
			transition(':increment, :decrement', [
				style({
					opacity: 0,
					transform: 'scale(0.98) translateY(10px)',
				}),
				animate(
					'500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					style({ opacity: 1, transform: 'scale(1) translateY(0)' })
				),
			]),
		]),
		trigger('contentSlide', [
			transition(':increment, :decrement', [
				style({ opacity: 0, transform: 'translateX(30px)' }),
				animate(
					'600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					style({ opacity: 1, transform: 'translateX(0)' })
				),
			]),
		]),
		trigger('floatAnimation', [
			transition(':enter', [
				style({ transform: 'translateY(0px)' }),
				animate(
					'3s ease-in-out infinite alternate',
					style({ transform: 'translateY(-10px)' })
				),
			]),
		]),
	],
})
export class AppShowcase implements OnInit, OnDestroy {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	currentIndex = signal(0);
	isPlaying = signal(true);
	private autoplayInterval?: number;
	private readonly autoplayDelay = 6000;

	readonly appFeatures: AppFeature[] = [
		{
			image: '/assets/images/screenshots/smart-pillbox-dashboard.png',
			title: 'Dashboard Inteligente de Medicamentos',
			description:
				'Visualize todos os seus medicamentos em tempo real, com status de doses, próximos horários e alertas de estoque em uma interface intuitiva e personalizável.',
			alt: 'Dashboard principal mostrando medicamentos ativos, horários e status',
			tableName: 'medications',
			keyBenefits: [
				'Medicamentos ilimitados no Premium',
				'Status em tempo real',
				'Interface personalizável',
				'Alertas inteligentes',
			],
			userType: 'all',
			premiumFeature: false,
		},
		{
			image: '/assets/images/screenshots/family-network.png',
			title: 'Rede Familiar Conectada',
			description:
				'Conecte até 8 familiares e cuidadores com permissões personalizadas. Recebam alertas em tempo real sobre medicamentos perdidos e acompanhem o progresso juntos.',
			alt: 'Interface mostrando rede de familiares conectados com permissões',
			tableName: 'family_connections',
			keyBenefits: [
				'Até 8 cuidadores conectados',
				'Permissões granulares',
				'Alertas emergenciais',
				'Acompanhamento em tempo real',
			],
			userType: 'caregiver',
			premiumFeature: true,
		},
		{
			image: '/assets/images/screenshots/iot-devices.png',
			title: 'Dispositivos IoT Sincronizados',
			description:
				'Pillboxes inteligentes que detectam automaticamente quando medicamentos são retirados, enviando confirmações instantâneas para familiares e gerando histórico preciso.',
			alt: 'Dispositivos IoT conectados com status de sincronização',
			tableName: 'devices',
			keyBenefits: [
				'Detecção automática de doses',
				'Sincronização instantânea',
				'Até 3 dispositivos Premium',
				'Histórico preciso',
			],
			userType: 'patient',
			premiumFeature: true,
		},
		{
			image: '/assets/images/screenshots/health-reports.png',
			title: 'Relatórios Médicos Avançados',
			description:
				'Gere relatórios profissionais automáticos com análises de aderência, correlações com sinais vitais e insights para compartilhar com seu médico.',
			alt: 'Relatórios médicos com gráficos de aderência e análises',
			tableName: 'automated_reports',
			keyBenefits: [
				'Relatórios automáticos',
				'Análises preditivas',
				'Correlação com vitais',
				'Formato médico profissional',
			],
			userType: 'professional',
			premiumFeature: true,
		},
		{
			image: '/assets/images/screenshots/vital-signs-tracking.png',
			title: 'Monitoramento de Sinais Vitais',
			description:
				'Registre pressão arterial, glicemia, peso e outros indicadores. O sistema correlaciona automaticamente com sua medicação e identifica padrões importantes.',
			alt: 'Dashboard de sinais vitais com gráficos e correlações',
			tableName: 'vital_signs',
			keyBenefits: [
				'Múltiplos tipos de medição',
				'Correlação automática',
				'Alertas de valores anormais',
				'Histórico visual completo',
			],
			userType: 'patient',
			premiumFeature: false,
		},
	];

	readonly userStats: UserStatistic[] = [
		{
			label: 'Aderência Média',
			value: '96.2%',
			description: 'dos usuários Premium',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			label: 'Tempo Economizado',
			value: '2.5h',
			description: 'por dia em gestão',
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			label: 'Famílias Ativas',
			value: '1,847',
			description: 'usando a rede colaborativa',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
		},
	];

	ngOnInit(): void {
		if (this.isBrowser) {
			this.startAutoplay();
		}
	}

	ngOnDestroy(): void {
		this.stopAutoplay();
	}

	private startAutoplay(): void {
		if (!this.isBrowser) return;

		this.autoplayInterval = window.setInterval(() => {
			if (this.isPlaying()) {
				this.nextSlide();
			}
		}, this.autoplayDelay);
	}

	private stopAutoplay(): void {
		if (this.autoplayInterval) {
			window.clearInterval(this.autoplayInterval);
			this.autoplayInterval = undefined;
		}
	}

	private resetAutoplay(): void {
		this.stopAutoplay();
		this.startAutoplay();
	}

	toggleAutoplay(): void {
		this.isPlaying.update((playing) => !playing);

		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'showcase_autoplay_toggle', {
		// 		is_playing: this.isPlaying(),
		// 	});
		// }
	}

	nextSlide(): void {
		this.currentIndex.update(
			(prev) => (prev + 1) % this.appFeatures.length
		);
		this.resetAutoplay();
		this.trackSlideInteraction('next', this.currentIndex());
	}

	prevSlide(): void {
		this.currentIndex.update(
			(prev) =>
				(prev - 1 + this.appFeatures.length) % this.appFeatures.length
		);
		this.resetAutoplay();
		this.trackSlideInteraction('previous', this.currentIndex());
	}

	goToSlide(index: number): void {
		if (index >= 0 && index < this.appFeatures.length) {
			this.currentIndex.set(index);
			this.resetAutoplay();
			this.trackSlideInteraction('direct', index);
		}
	}

	private trackSlideInteraction(action: string, slideIndex: number): void {
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	const feature = this.appFeatures[slideIndex];
		// 	gtag('event', 'showcase_interaction', {
		// 		action,
		// 		slide_index: slideIndex,
		// 		feature_title: feature?.title,
		// 		table_name: feature?.tableName,
		// 		user_type: feature?.userType,
		// 		is_premium: feature?.premiumFeature,
		// 	});
		// }
	}

	startFreeTrial(): void {
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'cta_click', {
		// 		source: 'showcase',
		// 		action: 'start_free_trial',
		// 		current_feature: this.appFeatures[this.currentIndex()].title,
		// 	});
		// }
		// Implementar navegação para trial
		console.log('Iniciar teste grátis - showcase');
	}

	viewLiveDemo(): void {
		// if (this.isBrowser && typeof gtag !== 'undefined') {
		// 	gtag('event', 'cta_click', {
		// 		source: 'showcase',
		// 		action: 'view_live_demo',
		// 		current_feature: this.appFeatures[this.currentIndex()].title,
		// 	});
		// }
		// Implementar demo interativa
		console.log('Ver demo ao vivo - showcase');
	}

	getCurrentFeature(): AppFeature {
		return this.appFeatures[this.currentIndex()];
	}

	getUserTypeLabel(userType: AppFeature['userType']): string {
		const labels = {
			patient: 'Para Pacientes',
			caregiver: 'Para Cuidadores',
			professional: 'Para Profissionais',
			all: 'Para Todos',
		};
		return labels[userType];
	}

	getUserTypeColor(userType: AppFeature['userType']): string {
		const colors = {
			patient: 'user-type-patient',
			caregiver: 'user-type-caregiver',
			professional: 'user-type-professional',
			all: 'user-type-all',
		};
		return colors[userType];
	}

	trackByIndex(index: number): number {
		return index;
	}

	trackByFeature(index: number, feature: AppFeature): string {
		return feature.tableName;
	}
}
