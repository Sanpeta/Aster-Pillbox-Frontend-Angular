import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
	standalone: true,
	imports: [AsyncPipe, DashboardLayoutComponent],
})
export class DashboardComponent {}
