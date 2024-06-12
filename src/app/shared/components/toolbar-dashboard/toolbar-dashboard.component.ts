import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
	selector: 'app-toolbar-dashboard',
	standalone: true,
	imports: [MatToolbarModule, MatButtonModule, MatIconModule],
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
