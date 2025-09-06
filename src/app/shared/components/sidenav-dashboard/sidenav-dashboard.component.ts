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
import { Subject, takeUntil } from 'rxjs';

import { UserInfo } from '../../../models/interfaces/auth/auth.interface';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
	selector: 'app-sidenav-dashboard',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './sidenav-dashboard.component.html',
	styleUrl: './sidenav-dashboard.component.css',
})
export class SidenavDashboardComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	@Input() isCollapsed = false;
	@Input() isMobileMenuOpen = false;

	@Output() toggleCollapse = new EventEmitter<void>();
	@Output() closeMobileMenu = new EventEmitter<void>();

	menuSelected = 'Dashboard';
	menuItemsSelected = '';
	currentUser: UserInfo | null = null;
	isLoggingOut = false;

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {
		// Definir menu selecionado baseado na rota atual
		const currentUrl = this.router.url;
		this.setInitialMenuSelection(currentUrl);

		// Observar informações do usuário atual
		this.authService.currentUser$
			.pipe(takeUntil(this.destroy$))
			.subscribe((user) => {
				this.currentUser = user;
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	setInitialMenuSelection(url: string) {
		if (url.includes('/dashboard/perfil')) {
			this.menuSelected = 'Perfil';
		} else if (url.includes('/dashboard/pillboxes')) {
			this.menuSelected = 'List Pillboxes';
		} else if (url.includes('/dashboard/patients')) {
			this.menuSelected = 'Patients';
		} else if (url.includes('/dashboard/medications')) {
			this.menuSelected = 'List Medications';
		} else if (url.includes('/dashboard/report')) {
			this.menuSelected = 'Report';
		} else if (url.includes('/dashboard/settings')) {
			this.menuSelected = 'Settings';
		} else if (url.includes('/dashboard/prices')) {
			this.menuSelected = 'Prices';
		} else if (url.includes('/dashboard/support')) {
			this.menuSelected = 'Support';
		} else if (url.includes('/dashboard/admin')) {
			this.menuSelected = 'Admin';
		} else {
			this.menuSelected = 'Dashboard';
		}
	}

	onToggleCollapse() {
		this.toggleCollapse.emit();
	}

	onMenuSelected(menu: string) {
		this.menuSelected = menu;

		// Fechar menu mobile após seleção
		if (this.isMobileMenuOpen) {
			this.closeMobileMenu.emit();
		}

		switch (this.menuSelected) {
			case 'Dashboard':
				this.router.navigate(['/dashboard']);
				break;
			case 'Perfil':
				this.router.navigate(['/dashboard', 'perfil']);
				break;
			case 'List Pillboxes':
				this.menuItemsSelected = 'Pillbox';
				this.router.navigate(['/dashboard', 'pillboxes']);
				break;
			case 'Patients':
				this.menuItemsSelected = 'Patients';
				this.router.navigate(['/dashboard', 'patients']);
				break;
			case 'List Medications':
				this.menuItemsSelected = 'List Medications';
				this.router.navigate(['/dashboard', 'medications']);
				break;
			case 'Report':
				this.router.navigate(['/dashboard', 'report']);
				break;
			case 'Settings':
				this.router.navigate(['/dashboard', 'settings']);
				break;
			case 'Prices':
				this.router.navigate(['/dashboard', 'prices']);
				break;
			case 'Support':
				this.router.navigate(['/dashboard', 'support']);
				break;
			case 'Admin':
				this.router.navigate(['/dashboard', 'admin']);
				break;
			case 'Logout':
				this.handleLogout();
				break;
			default:
				console.log('Menu não reconhecido:', menu);
		}
	}

	private handleLogout() {
		const confirmed = confirm('Tem certeza que deseja sair?');
		if (confirmed) {
			this.performLogout();
		} else {
			// Reset selection if user cancels
			this.menuSelected = this.getPreviousSelection();
		}
	}

	private performLogout() {
		this.isLoggingOut = true;

		this.authService
			.logout()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					console.log('Logout successful:', response);
					this.isLoggingOut = false;
					// O AuthService já cuida do redirecionamento
				},
				error: (error) => {
					console.error('Logout error:', error);
					this.isLoggingOut = false;
					// Forçar logout local mesmo se houver erro na API
					this.authService.forceLogout();
				},
			});
	}

	private getPreviousSelection(): string {
		const currentUrl = this.router.url;
		this.setInitialMenuSelection(currentUrl);
		return this.menuSelected;
	}

	// Métodos públicos para o template
	public get userDisplayName(): string {
		if (!this.currentUser) return 'Usuário';

		// Se houver nome no futuro, usar ele
		// return this.currentUser.name || this.currentUser.email;

		// Por enquanto, usar email
		return this.currentUser.email;
	}

	public get userRole(): string {
		if (!this.currentUser) return '';

		// Mapear roles para exibição em português
		const roleMap: { [key: string]: string } = {
			patient: 'Paciente',
			caregiver: 'Cuidador',
			family_member: 'Familiar',
			doctor: 'Médico',
			nurse: 'Enfermeiro',
			pharmacist: 'Farmacêutico',
			admin: 'Administrador',
			super_admin: 'Super Admin',
		};

		return roleMap[this.currentUser.role] || this.currentUser.role;
	}

	public get showAdminMenu(): boolean {
		return (
			this.currentUser?.role === 'admin' ||
			this.currentUser?.role === 'super_admin'
		);
	}

	public get showPatientsMenu(): boolean {
		// Apenas profissionais de saúde podem ver lista de pacientes
		const healthcareProfessionals = [
			'doctor',
			'nurse',
			'caregiver',
			'admin',
			'super_admin',
		];
		return this.currentUser
			? healthcareProfessionals.includes(this.currentUser.role)
			: false;
	}

	public get showPricesMenu(): boolean {
		// Mostrar preços para pacientes e familiares principalmente
		const canSeePrices = [
			'patient',
			'family_member',
			'admin',
			'super_admin',
		];
		return this.currentUser
			? canSeePrices.includes(this.currentUser.role)
			: false;
	}

	public get isUserVerified(): boolean {
		return this.currentUser?.is_verified || false;
	}

	public get hasMFAEnabled(): boolean {
		return this.currentUser?.mfa_enabled || false;
	}

	// Método para obter avatar/iniciais do usuário
	public getUserInitials(): string {
		if (!this.currentUser?.email) return 'U';

		const email = this.currentUser.email;
		const parts = email.split('@')[0].split('.');

		if (parts.length >= 2) {
			return (parts[0][0] + parts[1][0]).toUpperCase();
		} else {
			return email.substring(0, 2).toUpperCase();
		}
	}

	// Método para verificar se uma rota está ativa
	public isRouteActive(route: string): boolean {
		return this.router.url.includes(route);
	}

	// Método para obter classe CSS baseada no status do usuário
	public getUserStatusClass(): string {
		if (!this.currentUser) return 'user-status-unknown';

		if (!this.currentUser.is_verified) return 'user-status-unverified';
		if (this.currentUser.mfa_enabled) return 'user-status-secure';

		return 'user-status-verified';
	}

	// Método para navegar para perfil do usuário
	public navigateToProfile(): void {
		this.onMenuSelected('Perfil');
	}

	// Método para verificar permissões específicas
	public hasPermission(permission: string): boolean {
		if (!this.currentUser?.permissions) return false;

		// Verificar se o usuário tem a permissão específica
		return this.currentUser.permissions[permission] === true;
	}
}
