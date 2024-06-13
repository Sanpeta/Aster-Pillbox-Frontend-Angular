import { Component } from '@angular/core';

@Component({
	selector: 'app-toolbar-dashboard',
	standalone: true,
	imports: [],
	templateUrl: './toolbar-dashboard.component.html',
	styleUrl: './toolbar-dashboard.component.scss',
})
export class ToolbarDashboardComponent {
	isDarkTheme = false;

	constructor() {
		// this.isDarkTheme = this.getTheme();
	}

	toggleTheme() {
		this.isDarkTheme = !this.isDarkTheme;
		// this.setTheme(this.isDarkTheme);
	}
}
