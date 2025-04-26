import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-header-blog',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './header-blog.component.html',
	styleUrls: ['./header-blog.component.scss'],
})
export class HeaderBlogComponent {
	isLogged = false;
	isMobileMenuOpen = false;
	currentSection = 'home';
	scrolling = false;
}
