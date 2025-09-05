import { Component, HostListener, OnInit } from '@angular/core';
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
export class DashboardLayoutComponent implements OnInit {
	isCollapsed = false;
	isMobileMenuOpen = false;
	isDarkTheme = false;

	ngOnInit() {
		this.checkScreenSize();
		// Aplicar tema salvo do localStorage
		const savedTheme = localStorage.getItem('theme');
		this.isDarkTheme = savedTheme === 'dark';
		this.applyTheme();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.checkScreenSize();
	}

	private checkScreenSize() {
		const isMobile = window.innerWidth <= 768;
		if (isMobile) {
			this.isCollapsed = true;
			this.isMobileMenuOpen = false;
		}
	}

	toggleCollapse() {
		this.isCollapsed = !this.isCollapsed;
	}

	toggleMobileMenu() {
		this.isMobileMenuOpen = !this.isMobileMenuOpen;
		// Prevent body scroll when mobile menu is open
		document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
	}

	closeMobileMenu() {
		this.isMobileMenuOpen = false;
		document.body.style.overflow = '';
	}

	toggleTheme() {
		this.isDarkTheme = !this.isDarkTheme;
		localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
		this.applyTheme();
	}

	private applyTheme() {
		if (this.isDarkTheme) {
			document.documentElement.classList.add('dark-theme');
		} else {
			document.documentElement.classList.remove('dark-theme');
		}
	}
}
