import {
	animate,
	query,
	stagger,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-blog-preview-section',
	standalone: true,
	imports: [CommonModule, RouterModule, NgOptimizedImage],
	template: `
		<section id="blog" class="w-full py-12 md:py-24 bg-gray-50">
			<div class="container px-4 md:px-6">
				<div
					class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
				>
					<div>
						<h2 class="text-3xl font-bold tracking-tighter">
							Blog
						</h2>
						<p class="text-gray-500 md:text-lg/relaxed mt-2">
							Artigos e dicas para ajudar você a cuidar melhor da
							sua saúde.
						</p>
					</div>
					<a routerLink="/blog" class="mt-4 md:mt-0">
						<button
							class="border border-[#479cf8] text-[#479cf8] px-4 py-2 rounded-md"
						>
							Ver todos os artigos
						</button>
					</a>
				</div>

				<div
					[@staggerAnimation]
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					<div
						*ngFor="let post of blogPosts; index as i"
						[@fadeInUp]
						class="h-full"
					>
						<div
							class="h-full border rounded-lg overflow-hidden bg-white"
						>
							<div class="relative h-48">
								<img
									[ngSrc]="post.image || '/placeholder.svg'"
									[alt]="post.title"
									fill
									class="object-cover transition-transform duration-300 hover:scale-105"
									priority
								/>
								<div class="absolute top-2 left-2">
									<div
										class="bg-[#479cf8] text-white px-3 py-1 rounded-full text-xs font-medium"
									>
										{{ post.category }}
									</div>
								</div>
							</div>
							<div class="p-6">
								<div class="text-sm text-gray-500 mb-2">
									{{ post.date }}
								</div>
								<h3 class="text-xl font-bold mb-2">
									{{ post.title }}
								</h3>
								<p class="text-gray-500">{{ post.excerpt }}</p>
							</div>
							<div class="p-6 pt-0 flex flex-wrap gap-2">
								<a
									[routerLink]="['/blog', post.slug]"
									class="inline-block"
								>
									<button
										class="border border-[#479cf8] text-[#479cf8] px-4 py-2 rounded-md text-sm"
									>
										Leia mais →
									</button>
								</a>
								<button
									class="border border-[#479cf8] text-[#479cf8] px-4 py-2 rounded-md text-sm flex items-center"
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
											d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
									Discuta este tema no nosso grupo
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-10 text-center">
					<button
						class="bg-[#479cf8] hover:bg-[#3a7fd0] text-white px-6 py-3 rounded-md flex items-center justify-center mx-auto"
					>
						<svg
							class="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						Quer receber dicas de saúde semanalmente? Clique aqui
						para entrar no grupo 💬
					</button>
				</div>
			</div>
		</section>
	`,
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
	],
})
export class BlogPreviewSection {
	blogPosts = [
		{
			title: 'Como organizar seus medicamentos de forma eficiente',
			excerpt:
				'Dicas práticas para organizar seus medicamentos e garantir que você nunca perca uma dose.',
			image: '/placeholder.svg',
			category: 'Organização',
			date: '10 Abr 2024',
			slug: 'como-organizar-medicamentos',
		},
		{
			title: 'Os benefícios da tecnologia na gestão de medicamentos',
			excerpt:
				'Descubra como a tecnologia pode ajudar você a gerenciar seus medicamentos de forma mais eficiente.',
			image: '/placeholder.svg',
			category: 'Tecnologia',
			date: '05 Abr 2024',
			slug: 'beneficios-tecnologia-medicamentos',
		},
		{
			title: 'Como envolver familiares no cuidado com medicamentos',
			excerpt:
				'Estratégias para incluir seus familiares no processo de gestão de medicamentos.',
			image: '/placeholder.svg',
			category: 'Família',
			date: '01 Abr 2024',
			slug: 'envolver-familiares-cuidado-medicamentos',
		},
	];
}
