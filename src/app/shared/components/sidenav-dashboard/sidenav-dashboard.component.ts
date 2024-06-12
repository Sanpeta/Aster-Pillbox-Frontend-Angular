import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ButtonMenuComponent } from '../button-menu/button-menu.component';

@Component({
	selector: 'app-sidenav-dashboard',
	standalone: true,
	imports: [MatSidenavModule, MatButtonModule, MatIcon, ButtonMenuComponent],
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
