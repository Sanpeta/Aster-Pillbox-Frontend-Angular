import { Component } from '@angular/core';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { SidenavDashboardComponent } from '../../shared/components/sidenav-dashboard/sidenav-dashboard.component';
import { SidenavTitleDashboardComponent } from '../../shared/components/sidenav-title-dashboard/sidenav-title-dashboard.component';
import { ToolbarDashboardComponent } from '../../shared/components/toolbar-dashboard/toolbar-dashboard.component';

@Component({
	selector: 'app-dashboard-perfil',
	standalone: true,
	imports: [
		ToolbarDashboardComponent,
		SidenavTitleDashboardComponent,
		SidenavDashboardComponent,
		DashboardLayoutComponent,
	],
	templateUrl: './dashboard-perfil.component.html',
	styleUrl: './dashboard-perfil.component.css',
})
export class DashboardPerfilComponent {}
