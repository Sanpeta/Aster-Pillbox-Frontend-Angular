import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	Component,
	ElementRef,
	HostListener,
	inject,
	OnDestroy,
	PLATFORM_ID,
	signal,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HomeService } from '../../services/home/home.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { BlogPreviewSection } from './components/blog-preview-section/blog-preview-section.component';
import { FeaturesSection } from './components/features-section/features-section.component';
import { HeroSection } from './components/hero-section/hero-section.component';
import { PricingSection } from './components/pricing-section/pricing-section.component';
import { AppShowcase } from './components/showcase/showcase.component';
import { WhatsAppCommunity } from './components/whatsapp-community-section/whatsapp-community-section.component';

declare let gtag: Function;
declare function gtag_report_conversion(url?: string): void;

interface ContactProfessionalForm {
	name: string;
	email: string;
}

interface MessageForm {
	name: string;
	email: string;
	message: string;
}

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		RouterLink,
		ReactiveFormsModule,
		LoaderComponent,
		HeaderComponent,
		HeroSection,
		FeaturesSection,
		PricingSection,
		BlogPreviewSection,
		WhatsAppCommunity,
		AppShowcase,
	],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	animations: [
		trigger('fadeAnimation', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('300ms', style({ opacity: 1 })),
			]),
			transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
		]),
	],
})
export class HomeComponent implements OnDestroy {
	@ViewChild('homeSection', { static: true }) homeSection!: ElementRef;
	@ViewChild('featuresSection') featuresSection!: ElementRef;
	@ViewChild('plansSection') plansSection!: ElementRef;
	@ViewChild('contactSection') contactSection!: ElementRef;
	@ViewChild('videoSection') videoSection!: ElementRef;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	// Signals para estado reativo
	loading = signal(false);
	isLogged = signal(false);
	currentSection = signal('home');
	scrolling = signal(false);

	private readonly destroy$ = new Subject<void>();
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	// Constantes
	private readonly SCROLL_OFFSET = 100;
	private readonly SCROLL_TIMEOUT = 1000;

	// Forms com tipagem
	sendContactProfessionalForm!: FormGroup;
	sendMessageForm!: FormGroup;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly homeService: HomeService,
		private readonly cookie: CookieService,
		private readonly router: Router,
		private readonly title: Title,
		private readonly meta: Meta
	) {
		this.initializeForms();
		this.setupSEO();
		this.checkLoginStatus();

		if (this.isBrowser) {
			this.initGoogleAnalytics();
		}
	}

	@HostListener('window:scroll', ['$event'])
	onWindowScroll(): void {
		if (!this.scrolling() && this.isBrowser) {
			this.detectCurrentSection();
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private initializeForms(): void {
		this.sendContactProfessionalForm = this.formBuilder.group({
			name: [
				'',
				[
					Validators.required,
					Validators.minLength(3),
					this.nameValidator,
				],
			],
			email: ['', [Validators.required, Validators.email]],
		});

		this.sendMessageForm = this.formBuilder.group({
			name: [
				'',
				[
					Validators.required,
					Validators.minLength(3),
					this.nameValidator,
				],
			],
			email: ['', [Validators.required, Validators.email]],
			message: ['', [Validators.required, Validators.minLength(10)]],
		});
	}

	private setupSEO(): void {
		this.title.setTitle(
			'Aster Pillbox - Nunca mais esqueça seus medicamentos | Gestão Inteligente de Medicação'
		);

		this.meta.updateTag({
			name: 'description',
			content:
				'Organize seus medicamentos, acompanhe horários e conquiste mais saúde com o Aster Pillbox. Lembretes inteligentes, controle de estoque e histórico completo.',
		});

		this.meta.updateTag({
			name: 'keywords',
			content:
				'medicamentos, lembrete medicação, pillbox, saúde, tratamento médico, gestão medicamentos',
		});
		this.meta.updateTag({ name: 'author', content: 'Aster Tech' });
		this.meta.updateTag({ name: 'robots', content: 'index,follow' });
		this.meta.updateTag({
			name: 'viewport',
			content: 'width=device-width, initial-scale=1.0',
		});

		// Open Graph
		this.meta.updateTag({
			property: 'og:title',
			content: 'Aster Pillbox - Gestão Inteligente de Medicação',
		});
		this.meta.updateTag({
			property: 'og:description',
			content:
				'Nunca mais esqueça seus medicamentos. Organize, acompanhe e conquiste mais saúde com o Aster Pillbox.',
		});
		this.meta.updateTag({ property: 'og:type', content: 'website' });
		this.meta.updateTag({
			property: 'og:url',
			content: 'https://astertechltda.com',
		});
		this.meta.updateTag({
			property: 'og:image',
			content: 'https://astertechltda.com/assets/images/og-image.jpg',
		});

		// Twitter Cards
		this.meta.updateTag({
			name: 'twitter:card',
			content: 'summary_large_image',
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: 'Aster Pillbox - Gestão Inteligente de Medicação',
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content:
				'Nunca mais esqueça seus medicamentos. Organize, acompanhe e conquiste mais saúde com o Aster Pillbox.',
		});
		this.meta.updateTag({
			name: 'twitter:image',
			content: 'https://astertechltda.com/assets/images/og-image.jpg',
		});
	}

	private nameValidator(
		control: AbstractControl
	): { [key: string]: any } | null {
		const value = control.value;
		if (!value) return null;

		// Verifica se contém apenas letras e espaços
		const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
		return nameRegex.test(value) ? null : { invalidName: true };
	}

	private checkLoginStatus(): void {
		const email = this.cookie.get('ACCOUNT_EMAIL');
		const token = this.cookie.get('AUTH_TOKEN');
		this.isLogged.set(!!(email && token));
	}

	private initGoogleAnalytics(): void {
		if (typeof gtag !== 'undefined') {
			gtag('event', 'conversion', {
				send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
			});
		}
	}

	private detectCurrentSection(): void {
		if (!this.isBrowser) return;

		const scrollPosition = window.scrollY + this.SCROLL_OFFSET;
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
				if (this.currentSection() !== section.id) {
					this.currentSection.set(section.id);
				}
				break;
			}
		}
	}

	onNavigationClick(sectionId: string): void {
		this.scrollToSection(sectionId);
	}

	scrollToSection(sectionId: string): void {
		if (!this.isBrowser) return;

		this.scrolling.set(true);

		const sectionMap: { [key: string]: ElementRef } = {
			home: this.homeSection,
			features: this.featuresSection,
			plans: this.plansSection,
			contact: this.contactSection,
			video: this.videoSection,
		};

		const section = sectionMap[sectionId];
		if (section?.nativeElement) {
			section.nativeElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}

		setTimeout(() => {
			this.currentSection.set(sectionId);
			this.scrolling.set(false);
		}, this.SCROLL_TIMEOUT);
	}

	freePlan(): void {
		if (this.isLogged()) {
			this.router.navigate(['/dashboard']);
			this.trackPlanSelection('free');
		} else {
			this.showPlanDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar seu plano grátis.',
				() =>
					this.router.navigate(['/register'], {
						queryParams: { plan: 'free' },
					})
			);
		}
	}

	premiumPlan30Days(): void {
		if (this.isLogged()) {
			const email = this.cookie.get('ACCOUNT_EMAIL');
			const stripeUrl = `https://buy.stripe.com/aEU8yQ873gz8gA8aEE?prefilled_email=${email}`;
			window.open(stripeUrl, '_blank', 'noopener,noreferrer');
			this.trackPlanSelection('monthly');
		} else {
			this.showPlanDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar com seu plano premium mensal.',
				() =>
					this.router.navigate(['/register'], {
						queryParams: { plan: 'monthly' },
					})
			);
		}
	}

	premiumPlan1year(): void {
		if (this.isLogged()) {
			const email = this.cookie.get('ACCOUNT_EMAIL');
			const stripeUrl = `https://buy.stripe.com/7sI2ascnjgz8es0cMN?prefilled_email=${email}`;
			window.open(stripeUrl, '_blank', 'noopener,noreferrer');
			this.trackPlanSelection('yearly');
		} else {
			this.showPlanDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar com seu plano premium anual.',
				() =>
					this.router.navigate(['/register'], {
						queryParams: { plan: 'yearly' },
					})
			);
		}
	}

	private showPlanDialog(
		title: string,
		message: string,
		confirmAction: () => void
	): void {
		this.openDialog(title, message, 'Cadastrar', 'Cancelar', confirmAction);
	}

	private trackPlanSelection(planType: string): void {
		this.trackEvent('plan_selection', planType);
	}

	private trackEvent(eventName: string, value: string): void {
		if (this.isBrowser && typeof gtag !== 'undefined') {
			gtag('event', eventName, {
				plan_type: value,
				send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
			});
		}
	}

	onSubmitContactProfessional(): void {
		if (
			!this.validateForm(this.sendContactProfessionalForm, 'professional')
		) {
			return;
		}

		this.loading.set(true);
		const formData: ContactProfessionalForm = {
			name: this.sendContactProfessionalForm.value.name,
			email: this.sendContactProfessionalForm.value.email,
		};

		this.homeService
			.sendContactProfessional(formData)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => this.handleContactSuccess('professional'),
				error: (error) =>
					this.handleContactError(error, 'professional'),
			});
	}

	onSubmitMessage(): void {
		if (!this.validateForm(this.sendMessageForm, 'message')) {
			return;
		}

		this.loading.set(true);
		const formData: MessageForm = {
			name: this.sendMessageForm.value.name,
			email: this.sendMessageForm.value.email,
			message: this.sendMessageForm.value.message,
		};

		this.homeService
			.sendMenssage(formData)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => this.handleContactSuccess('message'),
				error: (error) => this.handleContactError(error, 'message'),
			});
	}

	private validateForm(
		form: FormGroup,
		type: 'professional' | 'message'
	): boolean {
		if (form.invalid) {
			this.markFormGroupTouched(form);
			const message =
				type === 'professional'
					? 'Favor preencher seu nome (mínimo 3 caracteres) e um e-mail válido.'
					: 'Favor preencher todos os campos corretamente (nome, email válido e mensagem com pelo menos 10 caracteres).';

			this.openDialog('Campo(s) Inválidos', message, 'Entendi');
			return false;
		}
		return true;
	}

	private markFormGroupTouched(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach((key) => {
			const control = formGroup.get(key);
			control?.markAsTouched();

			if (control && 'controls' in control) {
				this.markFormGroupTouched(control as FormGroup);
			}
		});
	}

	private handleContactSuccess(type: 'professional' | 'message'): void {
		this.loading.set(false);

		if (type === 'professional') {
			this.sendContactProfessionalForm.reset();
			this.openDialog(
				'Enviado com sucesso!',
				'Em breve um de nossos profissionais entrará em contato para responder suas dúvidas e ajudá-lo a começar.',
				'Ok',
				'',
				() => {
					if (typeof gtag_report_conversion !== 'undefined') {
						gtag_report_conversion();
					}
					this.trackEvent('professional_contact', 'success');
				}
			);
		} else {
			this.sendMessageForm.reset();
			this.openDialog(
				'Mensagem enviada!',
				'Agradecemos seu contato. Nossa equipe responderá em até 24 horas úteis.',
				'Ok',
				'',
				() => this.trackEvent('contact_form_submission', 'success')
			);
		}
	}

	private handleContactError(
		error: any,
		type: 'professional' | 'message'
	): void {
		this.loading.set(false);
		console.error(`Erro ao enviar ${type}:`, error);

		this.openDialog(
			'Problema no envio',
			'Não foi possível enviar. Por favor, tente novamente ou entre em contato conosco.',
			'Ok'
		);
	}

	private openDialog(
		title: string,
		message: string,
		buttonTextConfirm: string,
		buttonTextClose: string = '',
		funcConfirmButton?: () => void,
		funcCloseButton?: () => void
	): void {
		if (!this.dialogContainer) return;

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
			funcCloseButton?.();
		});

		componentRef.instance.confirm.subscribe(() => {
			this.dialogContainer.clear();
			funcConfirmButton?.();
		});
	}
}
