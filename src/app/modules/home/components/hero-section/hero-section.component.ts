import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-hero-section',
	standalone: true,
	imports: [CommonModule, RouterModule, NgClass],
	template: `
		<section class="w-full py-12 md:py-24 lg:py-32 bg-white">
			<div class="container px-4 md:px-6">
				<div class="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
					<div class="space-y-4">
						<h1
							class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
						>
							Nunca mais esqueça seus medicamentos
						</h1>
						<p
							class="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
						>
							Organize seus medicamentos, acompanhe seus horários
							e conquiste mais saúde e tranquilidade com o Aster
							Pillbox.
						</p>
						<div class="flex flex-col sm:flex-row gap-4">
							<button
								class="bg-[#0F9D58] hover:bg-[#0b8043] h-12 px-6 text-white rounded inline-flex items-center"
							>
								<svg
									class="mr-2 h-5 w-5"
									viewBox="0 0 24 24"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.609 1.814L13.792 12 3.609 22.186c-.181-.181-.301-.422-.301-.693V2.507c0-.271.12-.512.301-.693zM14.713 12.922L17.136 14l-2.04 1.146-2.015-2.013 1.634-1.633 1.634 1.633-.636-.211zM13.792 12l2.423-2.422L17.136 10l-1.921 1.078-1.423-1.422 1.423-1.422L13.792 12zM4.96 1.296L12.279 5.6 4.96 1.296zM12.279 18.4l-7.32 4.304L12.28 18.4z"
									/>
								</svg>
								Google Play
							</button>
							<button
								class="bg-black hover:bg-gray-800 h-12 px-6 text-white rounded inline-flex items-center"
							>
								<svg
									class="mr-2 h-5 w-5"
									viewBox="0 0 24 24"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M17.05 20.28c-.98.95-2.05.96-3.08.44-1.07-.54-2.1-.56-3.24 0-1.44.73-2.45.53-3.31-.44C2.32 14.83 3.73 6.84 9.62 6.56c1.2.05 2.04.39 2.82.83.78-.51 1.82-.89 3.09-.84 1.83.1 3.22.91 4.05 2.24-3.42 2.11-2.77 6.79.59 8.07-.82 1.95-1.93 3.86-3.12 5.09v-1.67zM12.03 6.5c-.15-2.47 1.7-4.46 3.79-4.5.26 2.91-2.14 4.87-3.79 4.5z"
									/>
								</svg>
								App Store
							</button>
						</div>
						<div class="mt-4">
							<button
								class="text-[#479cf8] border-[#479cf8] h-12 border rounded inline-flex items-center px-4"
							>
								<svg
									class="mr-2 h-4 w-4 text-[#25D366]"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M10 5v14l7-7z"
									/>
								</svg>
								Junte-se à Comunidade
							</button>
							<p class="text-sm text-gray-500 mt-2">
								Participe do grupo exclusivo para dicas de saúde
								e suporte da comunidade Aster!
							</p>
						</div>
					</div>
					<div
						class="mx-auto lg:mx-0 flex justify-center"
						[@fadeInUp]
					>
						<div class="relative">
							<div
								class="relative w-[280px] h-[580px] bg-gray-900 rounded-[40px] p-3 shadow-xl border-[8px] border-gray-800"
							>
								<div
									class="relative w-full h-full rounded-[32px] overflow-hidden bg-white"
								>
									<div
										class="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-10"
									></div>

									<div class="relative w-full h-full">
										<img
											src="/placeholder.svg"
											alt="Aster Pillbox App Preview"
											width="280"
											height="580"
											class="object-cover w-full h-full transition-opacity duration-300"
											[ngClass]="{
												'opacity-0': isPlaying(),
												'opacity-100': !isPlaying()
											}"
										/>
										<video
											#videoRef
											class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
											poster="/placeholder.svg"
											(ended)="isPlaying.set(false)"
											playsinline
											muted
											[ngClass]="{
												'opacity-100': isPlaying(),
												'opacity-0': !isPlaying()
											}"
										>
											<source src="#" type="video/mp4" />
											Seu navegador não suporta vídeos
											HTML5.
										</video>

										<button
											(click)="togglePlay()"
											class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-14 h-14 bg-[#479cf8]/90 hover:bg-[#479cf8] transition-all duration-300"
											[ngClass]="{
												'opacity-0 hover:opacity-100':
													isPlaying(),
												'opacity-100': !isPlaying()
											}"
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
													d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
												/>
											</svg>
											}
											<span class="sr-only"
												>{{
													isPlaying()
														? 'Pausar'
														: 'Reproduzir'
												}}
												vídeo</span
											>
										</button>
									</div>
								</div>
							</div>

							<div
								class="absolute -top-6 -left-6 w-24 h-24 bg-[#479cf8] rounded-full opacity-10"
							></div>
							<div
								class="absolute -bottom-6 -right-6 w-32 h-32 bg-[#479cf8] rounded-full opacity-10"
							></div>
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
					'0.5s ease-out',
					style({ opacity: 1, transform: 'translateY(0)' })
				),
			]),
		]),
	],
})
export class HeroSection {
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
