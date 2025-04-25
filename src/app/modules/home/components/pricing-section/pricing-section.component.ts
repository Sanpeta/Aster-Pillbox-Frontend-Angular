import {
	animate,
	query,
	stagger,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-pricing-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<section id="plans" class="w-full py-12 md:py-24 bg-white">
			<div class="container px-4 md:px-6">
				<div class="text-center mb-10">
					<h2 class="text-3xl font-bold tracking-tighter">Planos</h2>
					<p
						class="text-gray-500 md:text-lg/relaxed mt-2 max-w-2xl mx-auto"
					>
						Alguns dos planos disponíveis para você escolher.
					</p>
				</div>

				<div
					[@staggerAnimation]
					class="grid grid-cols-1 md:grid-cols-3 gap-6"
				>
					<div
						*ngFor="let plan of plans; index as i"
						class="flex"
						[@fadeInUp]
						(mouseenter)="hoverCard(i)"
					>
						<div
							class="flex flex-col w-full border rounded-lg p-6"
							[class.border-[#479cf8]]="plan.popular"
							[class.shadow-lg]="plan.popular"
						>
							<div class="pb-4">
								<div *ngIf="plan.popular" class="mb-2">
									<div
										class="bg-[#479cf8] text-white px-3 py-1 rounded-full text-xs font-medium inline-block"
									>
										POPULAR
									</div>
								</div>
								<div class="flex items-baseline gap-1">
									<h3 class="text-lg font-bold">
										{{ plan.name }}
									</h3>
									<div
										*ngIf="plan.popular"
										class="flex items-center text-xs text-[#25D366] ml-2"
									>
										<svg
											class="h-3 w-3 mr-1"
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
										<span>Escolha da Comunidade</span>
									</div>
								</div>
								<div class="flex items-baseline mt-2">
									<span class="text-3xl font-bold">{{
										plan.price
									}}</span>
									<span class="text-sm text-gray-500 ml-1">{{
										plan.period
									}}</span>
								</div>
							</div>

							<div class="flex-grow">
								<ul class="space-y-2 mt-4">
									<li
										*ngFor="let feature of plan.features"
										class="flex items-start gap-2"
									>
										<div
											class="rounded-full bg-[#479cf8]/10 p-1 mt-0.5"
										>
											<svg
												class="h-3 w-3 text-[#479cf8]"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<span class="text-sm">{{
											feature
										}}</span>
									</li>
								</ul>
							</div>

							<div class="mt-6">
								<button
									class="w-full px-4 py-2 rounded-md transition-colors"
									[class.bg-[#479cf8]]="plan.popular"
									[class.text-white]="plan.popular"
									[class.border]="!plan.popular"
									[class.border-[#479cf8]]="!plan.popular"
									[class.text-[#479cf8]]="!plan.popular"
									[class.hover:bg-[#479cf8]]="!plan.popular"
									[class.hover:bg-[#3a7fd0]]="plan.popular"
									[class.animate-shake]="hoverStates[i]"
									(mouseenter)="startShake(i)"
									(mouseleave)="stopShake(i)"
								>
									Começar Agora
								</button>
							</div>
						</div>
					</div>
				</div>

				<div
					class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
				>
					<div
						*ngFor="let feature of features"
						class="border rounded-lg p-4"
					>
						<div class="flex items-start gap-2">
							<div class="rounded-full bg-[#479cf8]/10 p-2">
								<svg
									class="h-4 w-4 text-[#479cf8]"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h4 class="text-sm font-medium">
									{{ feature.title }}
								</h4>
								<p class="text-xs text-gray-500 mt-1">
									{{ feature.description }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-8 text-center">
					<button
						class="border border-[#479cf8] text-[#479cf8] px-4 py-2 rounded-md inline-flex items-center"
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
						Ainda com dúvidas? Fale conosco pelo WhatsApp
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
export class PricingSection {
	hoverStates: boolean[] = [];
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
			popular: false,
		},
		{
			name: 'PREMIUM',
			price: 'R$9,90',
			period: '/mês',
			features: [
				'Monitoramento da Tomada de Medicação',
				'Visualização do Histórico de Medicação',
				'Lembretes Personalizados de Medicação',
				'Convite para Cuidadores e Familiares',
				'Calendário de Medicação',
				'Gerenciamento de Estoque de Medicamentos',
			],
			popular: true,
		},
		{
			name: 'PREMIUM',
			price: 'R$99,90',
			period: '/ano',
			features: [
				'Monitoramento da Tomada de Medicação',
				'Visualização do Histórico de Medicação',
				'Lembretes Personalizados de Medicação',
				'Convite para Cuidadores e Familiares',
				'Calendário de Medicação',
				'Gerenciamento de Estoque de Medicamentos',
			],
			popular: false,
		},
	];

	features = [
		{
			title: 'Monitoramento da Tomada de Medicação',
			description:
				'Funcionalidade essencial para todos os usuários, permitindo o registro básico do uso de medicamentos.',
		},
		{
			title: 'Visualização do Histórico de Medicação',
			description:
				'Permite que o usuário acompanhe seu próprio histórico, incentivando o uso do aplicativo.',
		},
		{
			title: 'Lembretes Personalizados de Medicação',
			description:
				'Recurso importante para garantir a adesão ao tratamento, tornando o aplicativo útil para o dia a dia.',
		},
		{
			title: 'Gerenciamento de Estoque de Medicamentos',
			description:
				'Funcionalidade avançada que agrega valor ao plano pago, ajudando o usuário a controlar seus medicamentos.',
		},
	];

	startShake(index: number) {
		if (this.plans[index].popular) {
			this.hoverStates[index] = true;
			setTimeout(() => this.stopShake(index), 500);
		}
	}

	stopShake(index: number) {
		this.hoverStates[index] = false;
	}

	hoverCard(index: number) {
		// Implement hover effect if needed
	}
}
