import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonMenuComponent } from '../button-menu/button-menu.component';
import { IconComponent } from '../icon/icon.component';
import { MenuItemsComponent } from '../menu-items/menu-items.component';
import { AccountService } from './../../../services/account/account.service';

@Component({
	selector: 'app-sidenav-dashboard',
	standalone: true,
	imports: [ButtonMenuComponent, IconComponent, MenuItemsComponent],
	templateUrl: './sidenav-dashboard.component.html',
	styleUrl: './sidenav-dashboard.component.css',
})
export class SidenavDashboardComponent {
	menuSelected = 'Dashboard';
	menuItemsSelected = '';

	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	onMenuSelected(menu: string) {
		this.menuSelected = menu;

		switch (this.menuSelected) {
			case 'Dashboard':
				this.router.navigate(['/dashboard']);
				break;
			case 'Perfil':
				this.router.navigate(['/dashboard', 'perfil']);
				break;
			case 'Pillbox':
				this.menuItemsSelected = 'Pillbox';
				this.router.navigate(['/dashboard', 'pillbox']);
				break;
			case 'List Pillboxes':
				this.menuItemsSelected = 'Pillbox';
				this.router.navigate(['/dashboard', 'pillboxes']);
				break;
			case 'List Patients':
				this.menuItemsSelected = 'Patient';
				this.router.navigate(['/dashboard', 'patients']);
				break;
			case 'List Medications':
				this.menuItemsSelected = 'List Medications';
				this.router.navigate(['/dashboard', 'medications']);
				break;
			// case 'Information':
			// 	this.router.navigate(['/dashboard', 'information']);
			// 	break;
			// case 'Feedback':
			// 	this.router.navigate(['/dashboard', 'feedback']);
			// 	break;
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
				this.accountService.logoutAccount();
				break;
			default:
				console.log('Default');
		}
	}
}
