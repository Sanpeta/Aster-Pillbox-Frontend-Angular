import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { FooterBlogComponent } from './components/footer-blog/footer-blog.component';
import { HeaderBlogComponent } from './components/header-blog/header-blog.component';
import { NewsletterBlogComponent } from './components/newsletter-blog/newsletter-blog.component';
import { WhastappButtonBlogComponent } from './components/whastapp-button-blog/whastapp-button-blog.component';

interface BlogPost {
	title: string;
	excerpt: string;
	image: string;
	category: string;
	date: string;
	slug: string;
}

@Component({
	selector: 'app-blogs',
	standalone: true,
	imports: [
		CommonModule,
		LoaderComponent,
		HeaderBlogComponent,
		FooterBlogComponent,
		WhastappButtonBlogComponent,
		BlogCardComponent,
		NewsletterBlogComponent,
	],
	templateUrl: './blogs.component.html',
	styleUrl: './blogs.component.css',
})
export class BlogsComponent {
	loading = false;

	blogPosts: BlogPost[] = [
		{
			title: 'Como organizar seus medicamentos de forma eficiente',
			excerpt:
				'Dicas práticas para organizar seus medicamentos e garantir que você nunca perca uma dose.',
			image: '/assets/images/placeholder.svg',
			category: 'Organização',
			date: '10 Abr 2024',
			slug: 'como-organizar-medicamentos',
		},
		{
			title: 'Os benefícios da tecnologia na gestão de medicamentos',
			excerpt:
				'Descubra como a tecnologia pode ajudar você a gerenciar seus medicamentos de forma mais eficiente.',
			image: '/assets/images/placeholder.svg',
			category: 'Tecnologia',
			date: '05 Abr 2024',
			slug: 'beneficios-tecnologia-medicamentos',
		},
		{
			title: 'Como envolver familiares no cuidado com medicamentos',
			excerpt:
				'Estratégias para incluir seus familiares no processo de gestão de medicamentos.',
			image: '/assets/images/placeholder.svg',
			category: 'Família',
			date: '01 Abr 2024',
			slug: 'envolver-familiares-cuidado-medicamentos',
		},
		{
			title: 'Dicas para não esquecer de tomar seus medicamentos',
			excerpt:
				'Estratégias práticas para criar uma rotina e nunca mais esquecer de tomar seus medicamentos.',
			image: '/assets/images/placeholder.svg',
			category: 'Dicas',
			date: '28 Mar 2024',
			slug: 'dicas-nao-esquecer-medicamentos',
		},
		{
			title: 'A importância da adesão ao tratamento medicamentoso',
			excerpt:
				'Entenda por que seguir corretamente o tratamento medicamentoso é fundamental para sua saúde.',
			image: '/assets/images/placeholder.svg',
			category: 'Saúde',
			date: '25 Mar 2024',
			slug: 'importancia-adesao-tratamento',
		},
		{
			title: 'Como o Aster Pillbox pode ajudar idosos a gerenciar medicamentos',
			excerpt:
				'Descubra como o Aster Pillbox pode ser uma ferramenta valiosa para idosos que precisam tomar vários medicamentos.',
			image: '/assets/images/placeholder.svg',
			category: 'Idosos',
			date: '20 Mar 2024',
			slug: 'aster-pillbox-idosos',
		},
	];

	categories: string[] = [
		'Todos',
		'Organização',
		'Tecnologia',
		'Família',
		'Dicas',
		'Saúde',
		'Idosos',
	];
}
