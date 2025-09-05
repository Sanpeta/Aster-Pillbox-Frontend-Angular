import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user/user.service';

@Component({
	selector: 'app-toolbar-dashboard',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './toolbar-dashboard.component.html',
	styleUrl: './toolbar-dashboard.component.css',
})
export class ToolbarDashboardComponent implements OnInit, OnDestroy {
	@Input() isCollapsed = false;
	@Input() isMobileMenuOpen = false;
	@Input() isDarkTheme = false;

	@Output() toggleMobileMenu = new EventEmitter<void>();
	@Output() toggleTheme = new EventEmitter<void>();

	private destroy$ = new Subject<void>();

	public user = {
		image_url: '',
		name: '',
	};

	public notificationCount = 0;
	public hasNotifications = false;

	constructor(
		private userService: UserService,
		private cookie: CookieService,
		private router: Router
	) {}

	ngOnInit() {
		this.loadUserData();
		this.checkNotifications();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private loadUserData() {
		const ACCOUNT_ID = this.cookie.get('ACCOUNT_ID');
		if (ACCOUNT_ID) {
			this.userService
				.getUserByAccountID(parseInt(ACCOUNT_ID))
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						this.user = {
							image_url: response.image_url || '',
							name: response.name || 'Usuário',
						};
					},
					error: (error) => {
						console.error(
							'Erro ao carregar dados do usuário:',
							error
						);
					},
				});
		}
	}

	private checkNotifications() {
		// Simular verificação de notificações
		// Em um caso real, você faria uma chamada para o serviço de notificações
		this.notificationCount = 3;
		this.hasNotifications = this.notificationCount > 0;
	}

	onToggleMobileMenu() {
		this.toggleMobileMenu.emit();
	}

	onToggleTheme() {
		this.toggleTheme.emit();
	}

	getPageTitle(): string {
		const currentUrl = this.router.url;
		const titleMap: { [key: string]: string } = {
			'/dashboard': 'Dashboard',
			'/dashboard/perfil': 'Perfil',
			'/dashboard/pillboxes': 'Caixa de Medicamentos',
			'/dashboard/medications': 'Medicamentos',
			'/dashboard/report': 'Relatório',
			'/dashboard/settings': 'Configurações',
			'/dashboard/support': 'Suporte',
		};

		return titleMap[currentUrl] || 'Dashboard';
	}

	getUserInitials(): string {
		if (!this.user.name) return 'U';
		return this.user.name
			.split(' ')
			.map((part) => part.charAt(0))
			.join('')
			.substring(0, 2)
			.toUpperCase();
	}

	openNotifications() {
		// Implementar abertura do painel de notificações
		console.log('Abrir notificações');
	}

	openUserMenu() {
		// Implementar abertura do menu do usuário
		console.log('Abrir menu do usuário');
	}
}
