import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	animations: [
		trigger('slideInOut', [
			transition(':enter', [
				style({ transform: 'translateY(-100%)', opacity: 0 }),
				animate(
					'300ms ease-out',
					style({ transform: 'translateY(0)', opacity: 1 })
				),
			]),
			transition(':leave', [
				animate(
					'250ms ease-in',
					style({ transform: 'translateY(-100%)', opacity: 0 })
				),
			]),
		]),
		trigger('fadeBackdrop', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('200ms ease-out', style({ opacity: 1 })),
			]),
			transition(':leave', [
				animate('200ms ease-in', style({ opacity: 0 })),
			]),
		]),
	],
})
export class HeaderComponent {
	@Input() currentSection: string = 'home';
	@Input() isLogged: boolean = false;

	@Output() navigationClick = new EventEmitter<string>();

	// Signals para estado reativo
	isMobileMenuOpen = signal(false);
	isScrolled = signal(false);

	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	// Navigation items configuration
	readonly navigationItems = [
		{ id: 'home', label: 'Home', ariaLabel: 'Ir para seção inicial' },
		{
			id: 'features',
			label: 'Funcionalidades',
			ariaLabel: 'Ir para funcionalidades',
		},
		{ id: 'plans', label: 'Planos', ariaLabel: 'Ir para planos' },
		{ id: 'contact', label: 'Fale Conosco', ariaLabel: 'Ir para contato' },
	];

	constructor(
		private readonly router: Router,
		private readonly cookie: CookieService
	) {
		if (this.isBrowser) {
			this.setupScrollListener();
		}
	}

	private setupScrollListener(): void {
		window.addEventListener(
			'scroll',
			() => {
				const scrolled = window.scrollY > 10;
				this.isScrolled.set(scrolled);
			},
			{ passive: true }
		);
	}

	toggleMobileMenu(): void {
		this.isMobileMenuOpen.update((isOpen) => !isOpen);

		// Prevent body scroll when menu is open
		if (this.isBrowser) {
			document.body.style.overflow = this.isMobileMenuOpen()
				? 'hidden'
				: 'auto';
		}
	}

	closeMobileMenu(): void {
		this.isMobileMenuOpen.set(false);

		if (this.isBrowser) {
			document.body.style.overflow = 'auto';
		}
	}

	onNavigationClick(sectionId: string): void {
		this.navigationClick.emit(sectionId);
		this.closeMobileMenu();
	}

	onKeyboardNavigate(event: KeyboardEvent, sectionId: string): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.onNavigationClick(sectionId);
		}
	}

	navigateToDashboard(): void {
		this.router.navigate(['/dashboard']);
		this.closeMobileMenu();
	}

	navigateToLogin(): void {
		this.router.navigate(['/login']);
		this.closeMobileMenu();
	}

	navigateToBlog(): void {
		this.router.navigate(['/blog']);
		this.closeMobileMenu();
	}

	// Handle backdrop click to close mobile menu
	onBackdropClick(event: Event): void {
		if (event.target === event.currentTarget) {
			this.closeMobileMenu();
		}
	}

	// Handle escape key to close mobile menu
	onEscapeKey(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			this.closeMobileMenu();
		}
	}
}
