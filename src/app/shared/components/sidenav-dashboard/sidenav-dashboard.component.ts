import { Component } from '@angular/core';
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

	constructor(private accountService: AccountService) {}

	onMenuSelected(menu: string) {
		this.menuSelected = menu;
		console.log(this.menuSelected);
		switch (this.menuSelected) {
			case 'Logout':
				this.accountService.logoutAccount();
				break;
			default:
				console.log('Default');
		}
	}
}
