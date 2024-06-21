import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavDashboardComponent } from '../../shared/components/sidenav-dashboard/sidenav-dashboard.component';
import { SidenavTitleDashboardComponent } from '../../shared/components/sidenav-title-dashboard/sidenav-title-dashboard.component';
import { ToolbarDashboardComponent } from '../../shared/components/toolbar-dashboard/toolbar-dashboard.component';

@Component({
	selector: 'app-dashboard-layout',
	standalone: true,
	imports: [
		ToolbarDashboardComponent,
		SidenavDashboardComponent,
		SidenavTitleDashboardComponent,
		RouterOutlet,
	],
	templateUrl: './dashboard-layout.component.html',
	styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {}
