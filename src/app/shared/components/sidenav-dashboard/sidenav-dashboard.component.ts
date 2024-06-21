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
	menuSelected = 'Home';

	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	onMenuSelected(menu: string) {
		this.menuSelected = menu;
		console.log(this.menuSelected);
		switch (this.menuSelected) {
			case 'Logout':
				this.accountService.logoutAccount();
				break;
			case 'Perfil':
				this.router.navigate(['/dashboard', 'perfil']);
				break;
			default:
				console.log('Default');
		}
	}
}
