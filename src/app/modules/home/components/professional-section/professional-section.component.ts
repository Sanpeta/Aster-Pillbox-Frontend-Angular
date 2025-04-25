import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-professional-section',
	standalone: true,
	imports: [CommonModule, RouterModule, ReactiveFormsModule],
	template: `
		<section class="w-full py-12 md:py-24 bg-gray-50">
			<div class="container px-4 md:px-6">
				<div class="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
					<div [@slideInLeft] class="space-y-4">
						<h2 class="text-3xl font-bold tracking-tighter">
							Aster Pillbox para Profissionais
						</h2>
						<p class="text-gray-500 md:text-lg/relaxed">
							Deixe seu dado de contato e entraremos em contato
							para apresentar todos os benefícios do Aster Pillbox
							para sua prática profissional.
						</p>

						<form
							[formGroup]="form"
							(ngSubmit)="onSubmit()"
							class="space-y-4"
						>
							<div class="space-y-2">
								<label
									for="name"
									class="text-sm font-medium leading-none"
									>Nome Completo</label
								>
								<input
									id="name"
									formControlName="name"
									class="max-w-lg flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									required
								/>
							</div>

							<div class="space-y-2">
								<label
									for="email"
									class="text-sm font-medium leading-none"
									>E-mail para Contato</label
								>
								<input
									id="email"
									type="email"
									formControlName="email"
									class="max-w-lg flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									required
								/>
							</div>

							<button
								type="submit"
								class="bg-[#479cf8] hover:bg-[#3a7fd0] h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white"
							>
								Solicitar
							</button>

							<p class="text-xs text-gray-500 mt-2">
								Ao enviar, você concorda em receber atualizações
								sobre o Aster Pillbox por e-mail e WhatsApp.
							</p>
						</form>

						<div class="mt-6">
							<button
								class="flex items-center gap-2 h-10 px-4 py-2 border rounded-md bg-background hover:bg-accent hover:text-accent-foreground"
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
								Prefere falar agora? Junte-se ao WhatsApp de
								Profissionais
							</button>
						</div>
					</div>

					<div [@slideInRight] class="mx-auto lg:mx-0 relative">
						<div
							class="absolute -top-6 -left-6 w-24 h-24 bg-[#479cf8] rounded-full opacity-20"
						></div>
						<div
							class="absolute -bottom-6 -right-6 w-32 h-32 bg-[#479cf8] rounded-full opacity-20"
						></div>
						<div class="relative bg-white p-6 rounded-lg shadow-lg">
							<h3 class="text-xl font-bold mb-4">
								Benefícios para Profissionais
							</h3>
							<ul class="space-y-3">
								<li
									*ngFor="let benefit of benefits"
									class="flex items-start gap-2"
								>
									<div
										class="rounded-full bg-[#479cf8]/10 p-1 mt-0.5"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#479cf8"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
									<span>{{ benefit }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	animations: [
		trigger('slideInLeft', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(-20px)' }),
				animate(
					'500ms ease-out',
					style({ opacity: 1, transform: 'translateX(0)' })
				),
			]),
		]),
		trigger('slideInRight', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(20px)' }),
				animate(
					'500ms ease-out',
					style({ opacity: 1, transform: 'translateX(0)' })
				),
			]),
		]),
	],
})
export class ProfessionalSection {
	form = new FormGroup({
		name: new FormControl('Sidnei de Souza Junior', [Validators.required]),
		email: new FormControl('contato@astertech.site', [
			Validators.required,
			Validators.email,
		]),
	});

	benefits = [
		'Monitoramento remoto de pacientes',
		'Relatórios detalhados de adesão ao tratamento',
		'Integração com sistemas de prontuário eletrônico',
		'Descontos especiais para indicações de pacientes',
	];

	onSubmit() {
		if (this.form.valid) {
			console.log('Form submitted:', this.form.value);
		}
	}
}
