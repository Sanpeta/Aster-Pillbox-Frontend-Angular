import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	HostListener,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { HomeService } from '../../services/home/home.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { BlogPreviewSection } from './components/blog-preview-section/blog-preview-section.component';
import { ContactSection } from './components/contact-section/contact-section.component';
import { FeaturesSection } from './components/features-section/features-section.component';
import { HeroSection } from './components/hero-section/hero-section.component';
import { PricingSection } from './components/pricing-section/pricing-section.component';
import { ProfessionalSection } from './components/professional-section/professional-section.component';
import { AppShowcase } from './components/showcase/showcase.component';
import { VideoSection } from './components/video-section/video-section.component';
import { WhatsAppCommunity } from './components/whatsapp-community-section/whatsapp-community-section.component';

declare let gtag: Function;
declare function gtag_report_conversion(url?: string): void;

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		RouterLink,
		ReactiveFormsModule,
		LoaderComponent,
		HeroSection,
		FeaturesSection,
		PricingSection,
		ContactSection,
		BlogPreviewSection,
		WhatsAppCommunity,
		VideoSection,
		ProfessionalSection,
		AppShowcase,
	],
	templateUrl: './home.component.html',
	animations: [
		trigger('fadeAnimation', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('300ms', style({ opacity: 1 })),
			]),
			transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
		]),
		trigger('slideInOut', [
			transition(':enter', [
				style({ transform: 'translateY(-20px)', opacity: 0 }),
				animate(
					'300ms ease-out',
					style({ transform: 'translateY(0)', opacity: 1 })
				),
			]),
			transition(':leave', [
				animate(
					'300ms ease-in',
					style({ transform: 'translateY(-20px)', opacity: 0 })
				),
			]),
		]),
	],
})
export class HomeComponent {
	@ViewChild('homeSection') homeSection!: ElementRef;
	@ViewChild('featuresSection') featuresSection!: ElementRef;
	@ViewChild('plansSection') plansSection!: ElementRef;
	@ViewChild('contactSection') contactSection!: ElementRef;
	@ViewChild('videoSection') videoSection!: ElementRef;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	loading = false;
	isLogged = false;
	isMobileMenuOpen = false;
	currentSection = 'home';
	scrolling = false;

	// Número WhatsApp oficial da empresa
	private readonly WHATSAPP_NUMBER = '5547992820932';

	sendContactProfessionalForm = this.formBuilder.group({
		name: ['', [Validators.required, Validators.minLength(3)]],
		email: ['', [Validators.required, Validators.email]],
	});

	sendMessageForm = this.formBuilder.group({
		name: ['', [Validators.required, Validators.minLength(3)]],
		email: ['', [Validators.required, Validators.email]],
		message: ['', [Validators.required, Validators.minLength(10)]],
	});

	constructor(
		private formBuilder: FormBuilder,
		private homeService: HomeService,
		private cookie: CookieService,
		private router: Router
	) {
		this.checkLoginStatus();
		this.initGoogleAnalytics();
	}

	@HostListener('window:scroll', ['$event'])
	onWindowScroll() {
		if (!this.scrolling) {
			this.detectCurrentSection();
		}
	}

	private checkLoginStatus(): void {
		if (this.cookie.get('ACCOUNT_EMAIL') && this.cookie.get('AUTH_TOKEN')) {
			this.isLogged = true;
		}
	}

	private initGoogleAnalytics(): void {
		gtag('event', 'conversion', {
			send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
		});
	}

	toggleMobileMenu(): void {
		this.isMobileMenuOpen = !this.isMobileMenuOpen;
	}

	closeMobileMenu(): void {
		this.isMobileMenuOpen = false;
	}

	detectCurrentSection(): void {
		const scrollPosition = window.scrollY + 100;

		const sections = [
			{ id: 'home', el: this.homeSection?.nativeElement },
			{ id: 'features', el: this.featuresSection?.nativeElement },
			{ id: 'plans', el: this.plansSection?.nativeElement },
			{ id: 'contact', el: this.contactSection?.nativeElement },
			{ id: 'video', el: this.videoSection?.nativeElement },
		].filter((section) => section.el);

		for (let i = sections.length - 1; i >= 0; i--) {
			const section = sections[i];
			if (section.el.offsetTop <= scrollPosition) {
				if (this.currentSection !== section.id) {
					this.currentSection = section.id;
				}
				break;
			}
		}
	}

	scrollToSection(sectionId: string) {
		this.scrolling = true;
		this.closeMobileMenu();

		switch (sectionId) {
			case 'home':
				this.homeSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'features':
				this.featuresSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'plans':
				this.plansSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'contact':
				this.contactSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'video':
				this.videoSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			default:
				break;
		}

		setTimeout(() => {
			this.currentSection = sectionId;
			this.scrolling = false;
		}, 1000);
	}

	openWhatsApp() {
		const message = encodeURIComponent(
			'Olá! Gostaria de saber mais sobre o Aster Pillbox.'
		);
		window.open(
			`https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`,
			'_blank'
		);

		// Registra evento de conversão
		gtag('event', 'contact', {
			method: 'WhatsApp',
			send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
		});
	}

	freePlan(): void {
		if (this.isLogged) {
			this.router.navigate(['/dashboard']);
			this.trackPlanSelection('free');
		} else {
			this.openDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar seu plano grátis.',
				'Cadastrar',
				'Cancelar',
				() => {
					this.router.navigate(['/register'], {
						queryParams: { plan: 'free' },
					});
				}
			);
		}
	}

	premiumPlan30Days(): void {
		if (this.isLogged) {
			const stripeUrl = `https://buy.stripe.com/aEU8yQ873gz8gA8aEE?prefilled_email=${this.cookie.get(
				'ACCOUNT_EMAIL'
			)}`;
			window.open(stripeUrl, '_blank');
			this.trackPlanSelection('monthly');
		} else {
			this.openDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar com seu plano premium mensal.',
				'Cadastrar',
				'Cancelar',
				() => {
					this.router.navigate(['/register'], {
						queryParams: { plan: 'monthly' },
					});
				}
			);
		}
	}

	premiumPlan1year(): void {
		if (this.isLogged) {
			const stripeUrl = `https://buy.stripe.com/7sI2ascnjgz8es0cMN?prefilled_email=${this.cookie.get(
				'ACCOUNT_EMAIL'
			)}`;
			window.open(stripeUrl, '_blank');
			this.trackPlanSelection('yearly');
		} else {
			this.openDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar com seu plano premium anual.',
				'Cadastrar',
				'Cancelar',
				() => {
					this.router.navigate(['/register'], {
						queryParams: { plan: 'yearly' },
					});
				}
			);
		}
	}

	private trackPlanSelection(planType: string): void {
		gtag('event', 'plan_selection', {
			plan_type: planType,
			send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
		});
	}

	onSubmitContactProfessional(): void {
		if (this.sendContactProfessionalForm.invalid) {
			this.highlightFormErrors(this.sendContactProfessionalForm);
			this.openDialog(
				'Campo(s) Inválidos',
				'Favor preencher seu nome (mínimo 3 caracteres) e um e-mail válido.',
				'Entendi'
			);
			return;
		}

		this.loading = true;
		this.homeService
			.sendContactProfessional({
				name: this.sendContactProfessionalForm.value.name || '',
				email: this.sendContactProfessionalForm.value.email || '',
			})
			.subscribe({
				next: () => {
					this.loading = false;
					this.sendContactProfessionalForm.reset();
					this.openDialog(
						'Enviado com sucesso!',
						'Em breve um de nossos profissionais entrará em contato para responder suas dúvidas e ajudá-lo a começar.',
						'Ok',
						'',
						() => {
							gtag_report_conversion();
							gtag('event', 'professional_contact', {
								send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
							});
						}
					);
				},
				error: (error) => {
					this.loading = false;
					console.error(
						'Erro ao enviar formulário de contato profissional:',
						error
					);
					this.openDialog(
						'Problema no envio',
						'Não foi possível enviar o formulário. Por favor, tente novamente ou entre em contato pelo WhatsApp.',
						'Ok',
						'Usar WhatsApp',
						undefined,
						() => this.openWhatsApp()
					);
				},
			});
	}

	onSubmitMessage(): void {
		if (this.sendMessageForm.invalid) {
			this.highlightFormErrors(this.sendMessageForm);
			this.openDialog(
				'Campo(s) Inválidos',
				'Favor preencher todos os campos corretamente (nome, email válido e mensagem com pelo menos 10 caracteres).',
				'Entendi'
			);
			return;
		}

		this.loading = true;
		this.homeService
			.sendMenssage({
				name: this.sendMessageForm.value.name as string,
				email: this.sendMessageForm.value.email as string,
				message: this.sendMessageForm.value.message as string,
			})
			.subscribe({
				next: () => {
					this.loading = false;
					this.sendMessageForm.reset();
					this.openDialog(
						'Mensagem enviada!',
						'Agradecemos seu contato. Nossa equipe responderá em até 24 horas úteis.',
						'Ok',
						'',
						() => {
							gtag('event', 'contact_form_submission', {
								send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
							});
						}
					);
				},
				error: (error) => {
					this.loading = false;
					console.error('Erro ao enviar mensagem:', error);
					this.openDialog(
						'Problema no envio',
						'Não foi possível enviar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.',
						'Ok',
						'Usar WhatsApp',
						undefined,
						() => this.openWhatsApp()
					);
				},
			});
	}

	private highlightFormErrors(form: any): void {
		Object.keys(form.controls).forEach((key) => {
			const control = form.get(key);
			if (control.invalid) {
				control.markAsTouched();
			}
		});
	}

	openDialog(
		title: string,
		message: string,
		buttonTextConfirm: string,
		buttonTextClose: string = '',
		funcConfirmButton?: () => void,
		funcCloseButton?: () => void
	): void {
		const componentRef =
			this.dialogContainer.createComponent(DialogComponent);
		componentRef.instance.data = {
			title,
			mensage: message,
			buttonTextConfirm,
			buttonTextClose: buttonTextClose || '',
		};

		componentRef.instance.close.subscribe(() => {
			this.dialogContainer.clear();
			if (funcCloseButton) {
				funcCloseButton();
			}
		});

		componentRef.instance.confirm.subscribe(() => {
			this.dialogContainer.clear();
			if (funcConfirmButton) {
				funcConfirmButton();
			}
		});
	}
}
