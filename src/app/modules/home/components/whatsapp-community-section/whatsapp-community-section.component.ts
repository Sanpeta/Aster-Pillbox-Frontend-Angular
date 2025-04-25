import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-whatsapp-community',
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<section class="w-full py-12 md:py-24 bg-white">
			<div class="container px-4 md:px-6">
				<div
					[@fadeInUp]
					class="bg-[#479cf8]/5 rounded-lg p-8 border border-[#479cf8]/20"
				>
					<div
						class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
					>
						<div>
							<div
								class="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-3 py-1 rounded-full text-sm font-medium mb-4"
							>
								<svg
									class="h-4 w-4"
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
								Comunidade Aster
							</div>
							<h2
								class="text-3xl font-bold tracking-tighter mb-4"
							>
								Faça parte da Comunidade Aster no WhatsApp!
							</h2>
							<p class="text-gray-500 md:text-lg/relaxed mb-6">
								Troque experiências, receba lembretes exclusivos
								e dicas de saúde com outros usuários.
							</p>

							<ul class="space-y-3 mb-6">
								<li
									*ngFor="let item of benefits"
									class="flex items-start gap-2"
								>
									<div
										class="rounded-full bg-[#25D366]/10 p-1 mt-0.5"
									>
										<svg
											class="h-4 w-4 text-[#25D366]"
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
									<span>{{ item }}</span>
								</li>
							</ul>

							<button
								class="bg-[#25D366] hover:bg-[#1da851] h-12 px-6 rounded-md text-white flex items-center"
							>
								<svg
									class="mr-2 h-5 w-5"
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
								Entrar no Grupo Agora
							</button>

							<div class="text-sm text-gray-500 mt-4 space-y-2">
								<p>
									Mais de 5.000 pessoas já estão usando o
									Aster Pillbox no grupo. Cadastre-se e faça
									parte você também!
								</p>
								<p>
									Grupo exclusivo com cupons de desconto para
									quem participa 🎁
								</p>
							</div>
						</div>

						<div class="relative">
							<div
								class="absolute -top-6 -left-6 w-24 h-24 bg-[#25D366] rounded-full opacity-10"
							></div>
							<div
								class="absolute -bottom-6 -right-6 w-32 h-32 bg-[#25D366] rounded-full opacity-10"
							></div>

							<div
								class="relative bg-white rounded-lg shadow-lg p-6 border"
							>
								<div class="flex items-center gap-3 mb-4">
									<div
										class="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center"
									>
										<svg
											class="h-6 w-6 text-white"
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
									</div>
									<div>
										<h3 class="font-bold">
											Comunidade Aster Pillbox
										</h3>
										<p class="text-sm text-gray-500">
											5.243 membros
										</p>
									</div>
								</div>

								<div class="space-y-4">
									<div
										*ngFor="let msg of messages"
										class="rounded-lg p-3 max-w-[80%] text-sm"
										[class.ml-auto]="
											msg.sender === 'system'
										"
										[class.bg-[#dcf8c6]]="
											msg.sender === 'system'
										"
										[class.bg-gray-100]="
											msg.sender === 'user'
										"
									>
										<p>{{ msg.text }}</p>
										<p
											class="text-xs text-right text-gray-500 mt-1"
										>
											{{ msg.time }}
										</p>
									</div>
								</div>

								<div class="mt-4 flex items-center gap-2">
									<div
										class="bg-gray-100 rounded-full flex-grow p-2 text-sm text-gray-400"
									>
										Digite uma mensagem...
									</div>
									<button
										class="rounded-full w-10 h-10 p-0 bg-[#25D366] flex items-center justify-center"
									>
										<svg
											class="h-5 w-5 text-white"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path d="m3 3 3 9-3 9 19-9Z" />
											<path d="M6 12h16" />
										</svg>
									</button>
								</div>
							</div>
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
export class WhatsAppCommunity {
	benefits = [
		'Suporte 24h da comunidade',
		'Avisos sobre atualizações do app',
		'Conteúdo exclusivo para membros',
	];

	messages = [
		{
			text: 'Olá! Bem-vindo à comunidade Aster Pillbox! 👋',
			time: '10:30',
			sender: 'system',
		},
		{
			text: 'Aqui você pode tirar dúvidas, compartilhar experiências e receber dicas sobre saúde e medicamentos.',
			time: '10:31',
			sender: 'system',
		},
		{
			text: 'Oi! Acabei de baixar o app e estou adorando! Como faço para configurar lembretes para meus medicamentos?',
			time: '10:35',
			sender: 'user',
		},
		{
			text: 'Vamos te ajudar! Veja este tutorial rápido que preparamos: [link]',
			time: '10:36',
			sender: 'system',
		},
	];
}
