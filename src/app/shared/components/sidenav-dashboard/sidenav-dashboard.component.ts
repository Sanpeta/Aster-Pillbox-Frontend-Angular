import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonMenuComponent } from '../button-menu/button-menu.component';
import { IconComponent } from '../icon/icon.component';
import { AccountService } from './../../../services/account/account.service';

@Component({
	selector: 'app-sidenav-dashboard',
	standalone: true,
	imports: [ButtonMenuComponent, IconComponent, CommonModule],
	templateUrl: './sidenav-dashboard.component.html',
	styleUrl: './sidenav-dashboard.component.css',
})
export class SidenavDashboardComponent implements OnInit {
	menuSelected = 'Dashboard';
	menuItemsSelected = '';
	isCollapsed = false;
	userName = '';
	userRole = '';
	userInitials = '';

	// Detectar tamanho da tela para colapsar automaticamente em mobile
	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.checkScreenSize();
	}

	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	ngOnInit() {
		this.checkScreenSize();
		this.loadUserInfo();

		// Definir menu selecionado baseado na rota atual
		const currentUrl = this.router.url;
		this.setInitialMenuSelection(currentUrl);
	}

	loadUserInfo() {
		// // Exemplo - idealmente você buscaria esses dados do seu AccountService
		// this.accountService.getCurrentUser().subscribe((user) => {
		// 	if (user) {
		// 		this.userName = user.name || 'Usuário';
		// 		this.userRole = user.role || 'Paciente';
		// 		this.userInitials = this.getInitials(this.userName);
		// 	}
		// });
	}

	getInitials(name: string): string {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((part) => part.charAt(0))
			.join('')
			.substring(0, 2)
			.toUpperCase();
	}

	checkScreenSize() {
		this.isCollapsed = window.innerWidth < 768;
	}

	toggleCollapse() {
		this.isCollapsed = !this.isCollapsed;
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

	onMenuSelected(menu: string) {
		this.menuSelected = menu;

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
				// Adicionar confirmação antes de sair
				if (confirm('Tem certeza que deseja sair?')) {
					this.accountService.logoutAccount();
				}
				break;
			default:
				console.log('Default');
		}
	}
}
