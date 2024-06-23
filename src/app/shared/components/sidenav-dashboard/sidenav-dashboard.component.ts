import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonMenuComponent } from '../button-menu/button-menu.component';
import { IconComponent } from '../icon/icon.component';
import { AccountService } from './../../../services/account/account.service';

@Component({
	selector: 'app-sidenav-dashboard',
	standalone: true,
	imports: [ButtonMenuComponent, IconComponent],
	templateUrl: './sidenav-dashboard.component.html',
	styleUrl: './sidenav-dashboard.component.css',
})
export class SidenavDashboardComponent {
	menuSelected = 'Dashboard';

	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	onMenuSelected(menu: string) {
		this.menuSelected = menu;
		console.log(this.menuSelected);
		switch (this.menuSelected) {
			case 'Dashboard':
				this.router.navigate(['/dashboard']);
				break;
			case 'Perfil':
				this.router.navigate(['/dashboard', 'perfil']);
				break;
			case 'Pillbox':
				this.router.navigate(['/dashboard', 'pillbox']);
				break;
			case 'Medication':
				this.router.navigate(['/dashboard', 'medication']);
				break;
			case 'Information':
				this.router.navigate(['/dashboard', 'information']);
				break;
			case 'Feedback':
				this.router.navigate(['/dashboard', 'feedback']);
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
