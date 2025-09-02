import {
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
	PreloadAllModules,
	provideRouter,
	withPreloading,
	withRouterConfig,
} from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		// Configuração de detecção de mudanças otimizada
		provideZoneChangeDetection({
			eventCoalescing: true,
			runCoalescing: true,
		}),

		// Configuração do roteador com preload e configurações otimizadas
		provideRouter(
			routes,
			withPreloading(PreloadAllModules),
			withRouterConfig({
				paramsInheritanceStrategy: 'always',
				onSameUrlNavigation: 'reload',
			})
		),

		// Cliente HTTP com interceptors
		provideHttpClient(withInterceptorsFromDi()),

		// Animações assíncronas
		provideAnimationsAsync(),

		// Gráficos com configurações padrão
		provideCharts(withDefaultRegisterables()),
	],
};
