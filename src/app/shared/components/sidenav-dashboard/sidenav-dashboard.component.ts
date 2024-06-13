import { Component } from '@angular/core';
import { ButtonMenuComponent } from '../button-menu/button-menu.component';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-sidenav-dashboard',
	standalone: true,
	imports: [ButtonMenuComponent, IconComponent],
	templateUrl: './sidenav-dashboard.component.html',
	styleUrl: './sidenav-dashboard.component.scss',
})
export class SidenavDashboardComponent {
	menuSelected = 'Home';

	onMenuSelected(menu: string) {
		this.menuSelected = menu;
		console.log(this.menuSelected);
	}
}
