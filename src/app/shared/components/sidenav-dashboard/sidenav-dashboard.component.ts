import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account/account.service';

@Component({
	selector: 'app-sidenav-dashboard',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './sidenav-dashboard.component.html',
	styleUrl: './sidenav-dashboard.component.css',
})
export class SidenavDashboardComponent implements OnInit {
	@Input() isCollapsed = false;
	@Input() isMobileMenuOpen = false;

	@Output() toggleCollapse = new EventEmitter<void>();
	@Output() closeMobileMenu = new EventEmitter<void>();

	menuSelected = 'Dashboard';
	menuItemsSelected = '';

	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	ngOnInit() {
		// Definir menu selecionado baseado na rota atual
		const currentUrl = this.router.url;
		this.setInitialMenuSelection(currentUrl);
	}

	setInitialMenuSelection(url: string) {
		if (url.includes('/dashboard/perfil')) {
			this.menuSelected = 'Perfil';
		} else if (url.includes('/dashboard/pillboxes')) {
			this.menuSelected = 'List Pillboxes';
		} else if (url.includes('/dashboard/medications')) {
			this.menuSelected = 'List Medications';
		} else if (url.includes('/dashboard/report')) {
			this.menuSelected = 'Report';
		} else if (url.includes('/dashboard/settings')) {
			this.menuSelected = 'Settings';
		} else if (url.includes('/dashboard/support')) {
			this.menuSelected = 'Support';
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
			case 'Support':
				this.router.navigate(['/dashboard', 'support']);
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
			this.accountService.logoutAccount();
		} else {
			// Reset selection if user cancels
			this.menuSelected = this.getPreviousSelection();
		}
	}

	private getPreviousSelection(): string {
		const currentUrl = this.router.url;
		this.setInitialMenuSelection(currentUrl);
		return this.menuSelected;
	}
}
