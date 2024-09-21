import {
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HomeService } from './../../services/home/home.service';

interface sendContactProfessionalForm {
	name: string;
	email: string;
}

interface SendMessageForm {
	name: string;
	email: string;
	message: string;
}

declare let gtag: Function;

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		RouterModule,
		ReactiveFormsModule,
		LoaderComponent,
		DialogComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject();

	public isLogged = false;

	@ViewChild('homeSection') homeSection: ElementRef = {} as ElementRef;
	@ViewChild('functionsSection') functionsSection: ElementRef =
		{} as ElementRef;
	@ViewChild('plansSection') plansSection: ElementRef = {} as ElementRef;
	@ViewChild('contactUsSection') contactUsSection: ElementRef =
		{} as ElementRef;
	@ViewChild('dialogContainer', { read: ViewContainerRef })
	dialogContainer!: ViewContainerRef;

	sendContactProfessionalForm = this.formBuilder.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
	});

	sendMessageForm = this.formBuilder.group({
		name: '',
		email: '',
		message: '',
	});

	public loading = false;

	constructor(
		private formBuilder: FormBuilder,
		private homeService: HomeService,
		private cookie: CookieService,
		private router: Router
	) {}

	ngOnInit(): void {
		if (this.cookie.get('ACCOUNT_EMAIL') && this.cookie.get('AUTH_TOKEN')) {
			this.isLogged = true;
		} else {
			this.isLogged = false;
		}
		gtag('event', 'conversion', {
			send_to: 'AW-352428596/odhaCLzk5tQZELTEhqgB',
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	freePlan(): void {
		if (this.cookie.get('ACCOUNT_EMAIL') && this.cookie.get('AUTH_TOKEN')) {
			this.router.navigate(['/dashboard']);
		} else {
			this.openDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar seu plano grátis.',
				'Ok',
				'Cancelar',
				() => {
					this.router.navigate(['/register']);
				}
			);
		}
	}

	premiumPlan30Days(): void {
		if (this.cookie.get('ACCOUNT_EMAIL') && this.cookie.get('AUTH_TOKEN')) {
			window.open(
				'https://buy.stripe.com/aEU8yQ873gz8gA8aEE?prefilled_email=' +
					this.cookie.get('ACCOUNT_EMAIL'),
				'_blank'
			);
		} else {
			this.openDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar com seu plano premium.',
				'Ok',
				'Cancelar',
				() => {
					this.router.navigate(['/register']);
				}
			);
		}
	}

	premiumPlan1year(): void {
		if (this.cookie.get('ACCOUNT_EMAIL') && this.cookie.get('AUTH_TOKEN')) {
			window.open(
				'https://buy.stripe.com/7sI2ascnjgz8es0cMN?prefilled_email=' +
					this.cookie.get('ACCOUNT_EMAIL'),
				'_blank'
			);
		} else {
			this.openDialog(
				'Necessário uma conta!',
				'Vamos cadastrar para iniciar com seu plano premium.',
				'Ok',
				'Cancelar',
				() => {
					this.router.navigate(['/register']);
				}
			);
		}
	}

	onSubmitContactProfessional(): void {
		this.loading = true;
		if (this.sendContactProfessionalForm.valid) {
			this.homeService
				.sendContactProfessional(
					this.sendContactProfessionalForm
						.value as sendContactProfessionalForm
				)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						this.loading = false;
						this.sendContactProfessionalForm.reset();
						this.openDialog(
							'Enviado com sucesso!',
							'Em breve entraremos em contato.',
							'Ok',
							'',
							() => {}
						);
					},
					error: (error) => {
						this.loading = false;
						this.openDialog(
							'Problema interno',
							'Não foi possivel enviar o formulário.',
							'Ok',
							'',
							() => {}
						);
					},
					complete: () => {
						this.loading = false;
					},
				});
		} else {
			this.loading = false;
			this.openDialog(
				'Campo(s) Inválidos',
				'Favor colocar o nome e um e-mail válido.',
				'Ok',
				'',
				() => {}
			);
		}
	}

	onSubmitMessage(): void {
		this.loading = true;
		if (this.sendMessageForm.valid) {
			this.homeService
				.sendMenssage(this.sendMessageForm.value as SendMessageForm)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						this.loading = false;
						this.sendMessageForm.reset();
						this.openDialog(
							'Enviado com sucesso!',
							'Em breve entraremos em contato.',
							'Ok',
							'',
							() => {}
						);
					},
					error: (error) => {
						this.loading = false;
						this.openDialog(
							'Problema interno',
							'Não foi possivel enviar o formulário.',
							'Ok',
							'',
							() => {}
						);
					},
					complete: () => {
						this.loading = false;
					},
				});
		} else {
			this.loading = false;
			this.openDialog(
				'Campo(s) Inválidos',
				'Favor colocar o nome e um e-mail válido.',
				'Ok',
				'',
				() => {}
			);
		}
	}

	scrollToSection(sectionId: string) {
		switch (sectionId) {
			case 'home':
				this.homeSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'functions':
				this.functionsSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'plans':
				this.plansSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			case 'contact-us':
				this.contactUsSection.nativeElement.scrollIntoView({
					behavior: 'smooth',
				});
				break;
			default:
				break;
		}
	}

	openDialog(
		title: string,
		mensage: string,
		buttonTextConfirm: string,
		buttonTextClose?: any | undefined,
		funcConfirmButton?: any | null
	): void {
		const componentRef =
			this.dialogContainer.createComponent(DialogComponent);

		componentRef.instance.data = {
			title: title,
			mensage: mensage,
			buttonTextConfirm: buttonTextConfirm,
			buttonTextClose: buttonTextClose,
		};

		componentRef.instance.close.subscribe(() => {
			this.dialogContainer.clear(); // Fecha o diálogo
		});

		componentRef.instance.confirm.subscribe(() => {
			// Ação a ser executada se o usuário clicar em "Continuar"
			if (funcConfirmButton) {
				funcConfirmButton();
			}
		});
	}
}
