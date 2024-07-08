import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-toolbar-dashboard',
	standalone: true,
	imports: [IconComponent],
	templateUrl: './toolbar-dashboard.component.html',
	styleUrl: './toolbar-dashboard.component.css',
})
export class ToolbarDashboardComponent implements OnInit {
	private destroy$ = new Subject<void>();

	public user = {
		image_url: '',
		name: '',
	};
	isDarkTheme = false;
	srcImage = 'assets/images/light-mode-icon.svg';

	constructor(
		private userService: UserService,
		private cookie: CookieService
	) {
		// this.isDarkTheme = this.getTheme();
	}

	ngOnInit() {
		const ACCOUNT_ID = this.cookie.get('ACCOUNT_ID');

		this.userService
			.getUserByAccountID(parseInt(ACCOUNT_ID))
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.user = {
						image_url: response.image_url,
						name: response.name,
					};
				},
				complete: () => {},
				error: (error) => {},
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
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
