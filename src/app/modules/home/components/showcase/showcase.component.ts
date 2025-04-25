import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-showcase',
	standalone: true,
	imports: [CommonModule, RouterModule, NgOptimizedImage],
	template: `
		<section class="w-full py-12 md:py-24 bg-gray-50">
			<div class="container px-4 md:px-6">
				<div class="text-center mb-10">
					<h2 class="text-3xl font-bold tracking-tighter">
						Simplifique sua rotina de medicamentos
					</h2>
					<p
						class="text-gray-500 md:text-lg/relaxed mt-2 max-w-2xl mx-auto"
					>
						O Aster Pillbox foi desenvolvido para tornar o
						gerenciamento de medicamentos simples, seguro e
						eficiente.
					</p>
				</div>

				<div
					class="flex flex-col lg:flex-row items-center justify-center gap-8"
				>
					<div class="relative w-[280px] h-[580px]">
						<div
							class="relative w-full h-full bg-gray-900 rounded-[40px] p-3 shadow-xl border-[8px] border-gray-800"
						>
							<div
								class="relative w-full h-full rounded-[32px] overflow-hidden bg-white"
							>
								<div
									class="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"
								></div>

								<div
									[@slideFade]="currentIndex()"
									class="w-full h-full"
								>
									<img
										[src]="
											screenshots[currentIndex()].image
										"
										[alt]="
											screenshots[currentIndex()].title
										"
										fill
										class="object-cover w-full h-full"
										ngSrc="/placeholder.svg"
										width="280"
										height="580"
									/>
								</div>
							</div>
						</div>

						<button
							(click)="prevSlide()"
							class="absolute top-1/2 -left-12 transform -translate-y-1/2 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
						>
							<svg
								class="h-5 w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							<span class="sr-only">Anterior</span>
						</button>
						<button
							(click)="nextSlide()"
							class="absolute top-1/2 -right-12 transform -translate-y-1/2 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
						>
							<svg
								class="h-5 w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 5l7 7-7 7"
								/>
							</svg>
							<span class="sr-only">Próximo</span>
						</button>
					</div>

					<div class="lg:w-1/2 space-y-6">
						<div
							[@contentFade]="currentIndex()"
							class="text-center lg:text-left"
						>
							<h3 class="text-2xl font-bold mb-2">
								{{ screenshots[currentIndex()].title }}
							</h3>
							<p class="text-gray-500">
								{{ screenshots[currentIndex()].description }}
							</p>
						</div>

						<div
							class="flex justify-center lg:justify-start gap-2 mt-4"
						>
							@for (screenshot of screenshots; track $index) {
							<button
								class="w-3 h-3 rounded-full"
								[class.bg-[#479cf8]]="$index === currentIndex()"
								[class.bg-gray-300]="$index !== currentIndex()"
								(click)="currentIndex.set($index)"
								[attr.aria-label]="
									'Ir para slide ' + ($index + 1)
								"
							></button>
							}
						</div>

						<div
							class="flex flex-wrap justify-center lg:justify-start gap-4 mt-6"
						>
							<button
								class="bg-[#479cf8] hover:bg-[#3a7fd0] text-white px-4 py-2 rounded"
							>
								Comece Agora
							</button>
							<button
								class="text-[#479cf8] border-[#479cf8] border px-4 py-2 rounded"
							>
								Ver Todas as Funcionalidades
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	animations: [
		trigger('slideFade', [
			transition(':increment, :decrement', [
				style({ opacity: 0 }),
				animate('300ms ease-out', style({ opacity: 1 })),
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
export class AppShowcase {
	currentIndex = signal(0);

	screenshots = [
		{
			image: '/placeholder.svg',
			title: 'Gerenciamento de Medicamentos',
			description:
				'Visualize todos os seus medicamentos em um só lugar, com informações detalhadas sobre cada um.',
		},
		{
			image: '/placeholder.svg',
			title: 'Lembretes Personalizados',
			description:
				'Configure lembretes para nunca mais esquecer de tomar seus medicamentos no horário certo.',
		},
		{
			image: '/placeholder.svg',
			title: 'Histórico de Medicação',
			description:
				'Acompanhe seu histórico de medicação e compartilhe com seu médico ou cuidadores.',
		},
		{
			image: '/placeholder.svg',
			title: 'Monitoramento de Estoque',
			description:
				'Receba alertas quando seus medicamentos estiverem acabando para nunca ficar sem eles.',
		},
	];

	nextSlide() {
		this.currentIndex.update(
			(prev) => (prev + 1) % this.screenshots.length
		);
	}

	prevSlide() {
		this.currentIndex.update(
			(prev) =>
				(prev - 1 + this.screenshots.length) % this.screenshots.length
		);
	}
}
