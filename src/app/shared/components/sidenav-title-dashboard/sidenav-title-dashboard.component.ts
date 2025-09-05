import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-sidenav-title-dashboard',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './sidenav-title-dashboard.component.html',
	styleUrl: './sidenav-title-dashboard.component.css',
})
export class SidenavTitleDashboardComponent {
	@Input() isCollapsed = false;
}
