import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-video-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<section id="video" class="w-full py-12 md:py-24 bg-white">
			<div class="container px-4 md:px-6">
				<div class="text-center mb-10">
					<h2 class="text-3xl font-bold tracking-tighter">
						Veja o Aster Pillbox em Ação
					</h2>
					<p
						class="text-gray-500 md:text-lg/relaxed mt-2 max-w-2xl mx-auto"
					>
						Descubra como o Aster Pillbox pode transformar a gestão
						da sua medicação no dia a dia.
					</p>
				</div>

				<div
					[@fadeInUp]
					class="relative mx-auto max-w-4xl rounded-lg overflow-hidden shadow-xl"
				>
					<div class="aspect-video relative">
						<img
							src="/placeholder.svg"
							alt="Aster Pillbox Demo"
							class="object-cover transition-opacity duration-300 w-full h-full"
							[class.opacity-0]="isPlaying()"
							[class.opacity-100]="!isPlaying()"
						/>
						<video
							#videoRef
							class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
							poster="/placeholder.svg"
							(ended)="isPlaying.set(false)"
							[class.opacity-100]="isPlaying()"
							[class.opacity-0]="!isPlaying()"
						>
							<source src="#" type="video/mp4" />
							Seu navegador não suporta vídeos HTML5.
						</video>

						<button
							(click)="togglePlay()"
							class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 bg-[#479cf8]/90 hover:bg-[#479cf8] transition-all duration-300"
							[class.opacity-0]="isPlaying()"
							[class.hover:opacity-100]="isPlaying()"
							[class.opacity-100]="!isPlaying()"
						>
							@if (isPlaying()) {
							<svg
								class="h-6 w-6 text-white mx-auto"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							} @else {
							<svg
								class="h-6 w-6 text-white mx-auto ml-1"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M5 3l14 9-14 9V3z"
								/>
							</svg>
							}
							<span class="sr-only"
								>{{
									isPlaying() ? 'Pausar' : 'Reproduzir'
								}}
								vídeo</span
							>
						</button>
					</div>

					<div class="bg-white p-6">
						<h3 class="text-xl font-bold mb-2">
							Funcionalidades em Destaque
						</h3>
						<p class="text-gray-500">
							Neste vídeo, você conhecerá as principais
							funcionalidades do Aster Pillbox e como ele pode
							ajudar você a gerenciar seus medicamentos de forma
							eficiente.
						</p>
						<div class="mt-4 flex flex-wrap gap-2">
							<button
								class="text-[#479cf8] border-[#479cf8] border px-4 py-2 rounded text-sm"
							>
								Comece Agora
							</button>
							<button
								class="text-[#479cf8] border-[#479cf8] border px-4 py-2 rounded text-sm flex items-center"
							>
								<svg
									class="mr-2 h-4 w-4 text-[#25D366]"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 18a6 6 0 100-12 6 6 0 000 12z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 12h.01M12 12h.01M9 12h.01"
									/>
								</svg>
								Tire suas dúvidas
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
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
export class VideoSection {
	isPlaying = signal(false);
	@ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;

	togglePlay() {
		const video = this.videoRef.nativeElement;
		if (this.isPlaying()) {
			video.pause();
		} else {
			video.play();
		}
		this.isPlaying.set(!this.isPlaying());
	}
}
