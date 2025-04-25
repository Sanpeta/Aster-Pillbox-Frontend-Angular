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
	selector: 'app-features-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<section id="features" class="w-full py-12 md:py-24 bg-gray-50">
			<div class="container px-4 md:px-6">
				<div class="text-center mb-10">
					<h2 class="text-3xl font-bold tracking-tighter">
						Funcionalidades
					</h2>
					<p
						class="text-gray-500 md:text-lg/relaxed mt-2 max-w-2xl mx-auto"
					>
						Conheça os recursos que tornam o Aster Pillbox a melhor
						solução para gerenciar seus medicamentos.
					</p>
				</div>

				<div
					[@staggerAnimation]
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					<div
						*ngFor="let feature of features; index as i"
						class="h-full"
					>
						<div
							class="h-full transition-all duration-200 hover:shadow-md bg-white rounded-lg overflow-hidden"
						>
							<div class="p-6 flex flex-col h-full">
								<div class="mb-4">
									<ng-container [ngSwitch]="feature.icon">
										<svg
											*ngSwitchCase="'clock'"
											class="h-10 w-10 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<svg
											*ngSwitchCase="'history'"
											class="h-10 w-10 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<svg
											*ngSwitchCase="'bell'"
											class="h-10 w-10 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
											/>
										</svg>
										<svg
											*ngSwitchCase="'package'"
											class="h-10 w-10 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
											/>
										</svg>
										<svg
											*ngSwitchCase="'calendar'"
											class="h-10 w-10 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<svg
											*ngSwitchCase="'users'"
											class="h-10 w-10 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
											/>
										</svg>
									</ng-container>
								</div>
								<h3 class="text-xl font-bold mb-2">
									{{ feature.title }}
								</h3>
								<p class="text-gray-500 flex-grow">
									{{ feature.description }}
								</p>
								<div class="mt-4 flex flex-wrap gap-2">
									<button
										class="text-[#479cf8] border-[#479cf8] border px-4 py-2 rounded text-sm"
									>
										Comece Agora
									</button>
									<button
										class="text-[#479cf8] border-[#479cf8] border px-4 py-2 rounded text-sm"
									>
										Veja como funciona
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-12 bg-[#479cf8] rounded-lg p-6 text-white">
					<div
						class="flex flex-col md:flex-row items-center justify-between gap-4"
					>
						<div class="flex items-center gap-4">
							<svg
								class="h-8 w-8"
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
							<div>
								<h3 class="text-xl font-bold">
									Quer mais dicas de saúde?
								</h3>
								<p>Participe da nossa comunidade no WhatsApp</p>
							</div>
						</div>
						<button
							class="bg-white text-[#479cf8] px-6 py-2 rounded-md whitespace-nowrap font-medium"
						>
							Participar Agora →
						</button>
					</div>
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
	],
})
export class FeaturesSection {
	features = [
		{
			icon: 'clock',
			title: 'Monitoramento da Tomada de Medicação',
			description:
				'Aster Pillbox monitora cada vez que um medicamento é tomado, registrando o horário e compartimento do qual a medicação foi retirada.',
		},
		{
			icon: 'history',
			title: 'Visualização do Histórico de Medicação',
			description:
				'O aplicativo permite visualizar o histórico de uso de medicamentos, mostrando datas e horários em que os medicamentos foram tomados. Gráfico intuitivo ajudam em acompanhar o progresso ao longo do tempo.',
		},
		{
			icon: 'bell',
			title: 'Lembretes Personalizados de Medicação',
			description:
				'Crie alarmes personalizados para cada medicamento, definindo horários e dias da semana específicos. Receba notificações no celular para garantir que você não perca nenhuma dose.',
		},
		{
			icon: 'package',
			title: 'Gerenciamento de Estoque de Medicamentos',
			description:
				'Acompanhe a quantidade de cada medicamento em seu estoque e receba alertas quando estiverem acabando. Evite surpresas e garanta que você sempre tenha seus medicamentos disponíveis.',
		},
		{
			icon: 'calendar',
			title: 'Calendário de Medicação',
			description:
				'Visualize sua programação de medicamentos em um calendário intuitivo, com cores e ícones para facilitar a identificação de cada medicamento e horário.',
		},
		{
			icon: 'users',
			title: 'Convite para Cuidadores e Familiares',
			description:
				'Convide seus cuidadores ou familiares para acompanhar seu tratamento através do aplicativo. Eles poderão receber notificações sobre seus medicamentos e visualizar seu histórico de uso, proporcionando mais segurança e suporte.',
		},
	];
}
