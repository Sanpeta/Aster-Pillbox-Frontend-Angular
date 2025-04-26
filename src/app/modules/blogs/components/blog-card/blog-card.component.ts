import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
interface BlogPost {
	title: string;
	excerpt: string;
	image: string;
	category: string;
	date: string;
	slug: string;
}

@Component({
	selector: 'app-blog-card',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './blog-card.component.html',
	styleUrl: './blog-card.component.css',
})
export class BlogCardComponent {
	@Input() post!: BlogPost;
}
