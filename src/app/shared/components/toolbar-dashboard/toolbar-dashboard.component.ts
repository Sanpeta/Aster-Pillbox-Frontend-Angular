import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-toolbar-dashboard',
	standalone: true,
	imports: [IconComponent],
	templateUrl: './toolbar-dashboard.component.html',
	styleUrl: './toolbar-dashboard.component.css',
})
export class ToolbarDashboardComponent {
	isDarkTheme = false;
	srcImage = 'assets/images/light-mode-icon.svg';

	constructor() {
		// this.isDarkTheme = this.getTheme();
	}

	toggleTheme() {
		this.isDarkTheme = !this.isDarkTheme;
		if (this.isDarkTheme) {
			this.srcImage = 'assets/images/dark-mode-icon.svg';
		} else {
			this.srcImage = 'assets/images/light-mode-icon.svg';
		}
		// this.setTheme(this.isDarkTheme);
	}
}
