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
	selector: 'app-contact-section',
	standalone: true,
	imports: [CommonModule, RouterModule, ReactiveFormsModule],
	template: `
		<section id="contact" class="w-full py-12 md:py-24 bg-white">
			<div class="container px-4 md:px-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					<div [@fadeInLeft] class="space-y-4">
						<h2 class="text-3xl font-bold tracking-tighter">
							Fale Conosco
						</h2>
						<p class="text-gray-500 md:text-lg/relaxed">
							Mande sua mensagem ou dúvida para nós e entraremos
							em contato assim que possível.
						</p>

						<div
							class="bg-[#479cf8]/5 rounded-lg p-6 border border-[#479cf8]/20"
						>
							<h3 class="text-lg font-medium mb-4">
								Informações de Contato
							</h3>
							<ul class="space-y-3">
								<li class="flex items-center gap-3">
									<div
										class="rounded-full bg-[#479cf8]/10 p-2"
									>
										<svg
											class="h-4 w-4 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<rect
												width="20"
												height="16"
												x="2"
												y="4"
												rx="2"
											/>
											<path
												d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
											/>
										</svg>
									</div>
									<span>contato&#64;astertechltda.com</span>
								</li>
								<li class="flex items-center gap-3">
									<div
										class="rounded-full bg-[#479cf8]/10 p-2"
									>
										<svg
											class="h-4 w-4 text-[#479cf8]"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
											/>
										</svg>
									</div>
									<span>(XX) XXXX-XXXX</span>
								</li>
								<li class="flex items-center gap-3">
									<div
										class="rounded-full bg-[#25D366]/10 p-2"
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
												d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<span>(XX) XXXXX-XXXX (WhatsApp)</span>
								</li>
							</ul>
						</div>
					</div>

					<div [@fadeInRight]>
						<form
							[formGroup]="form"
							(ngSubmit)="onSubmit()"
							class="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
						>
							<div class="space-y-2">
								<label
									for="name"
									class="text-sm font-medium leading-none"
									>Nome</label
								>
								<input
									id="name"
									formControlName="name"
									class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									required
								/>
							</div>
							<div class="space-y-2">
								<label
									for="email"
									class="text-sm font-medium leading-none"
									>Email</label
								>
								<input
									id="email"
									type="email"
									formControlName="email"
									class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									required
								/>
							</div>
							<div class="space-y-2">
								<label
									for="message"
									class="text-sm font-medium leading-none"
									>Mensagem</label
								>
								<textarea
									id="message"
									formControlName="message"
									class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									rows="5"
									required
								></textarea>
							</div>
							<button
								type="submit"
								class="w-full bg-[#479cf8] hover:bg-[#3a7fd0] h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white"
							>
								Enviar
							</button>

							<div class="text-center mt-4">
								<p class="text-sm text-gray-500 mb-2">
									Ou fale diretamente pelo WhatsApp
								</p>
								<button
									type="button"
									class="border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
									Falar pelo WhatsApp
								</button>
								<p class="text-xs text-gray-500 mt-2">
									Respondemos em até 2 horas 🕒
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	animations: [
		trigger('fadeInLeft', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(-20px)' }),
				animate(
					'500ms ease-out',
					style({ opacity: 1, transform: 'translateX(0)' })
				),
			]),
		]),
		trigger('fadeInRight', [
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
export class ContactSection {
	form = new FormGroup({
		name: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
		message: new FormControl('', [Validators.required]),
	});

	onSubmit() {
		if (this.form.valid) {
			console.log('Form submitted:', this.form.value);
		}
	}
}
