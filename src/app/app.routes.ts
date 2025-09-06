import { Routes } from '@angular/router';
import {
	AdminGuard,
	AuthGuard,
	GuestGuard,
	RoleGuard,
} from './guards/auth/auth-guard.service';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

export const routes: Routes = [
	// Página inicial (pública)
	{ path: '', redirectTo: '', pathMatch: 'full' },
	{
		path: '',
		component: HomeComponent,
	},

	// ========================================
	// ROTAS PÚBLICAS DE AUTENTICAÇÃO
	// ========================================
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [GuestGuard], // Renomeado de LoggedGuardService
		data: { title: 'Login', description: 'Entre na sua conta' },
	},
	{
		path: 'register',
		loadComponent: () =>
			import('./modules/register/register.component').then(
				(m) => m.RegisterComponent
			),
		canActivate: [GuestGuard],
		data: { title: 'Cadastro', description: 'Crie sua conta' },
	},
	{
		path: 'recover-password',
		loadComponent: () =>
			import(
				'./modules/recover-password/recover-password.component'
			).then((m) => m.RecoverPasswordComponent),
		canActivate: [GuestGuard],
		data: { title: 'Recuperar Senha', description: 'Redefinir sua senha' },
	},
	{
		path: 'reset-account-password',
		loadComponent: () =>
			import(
				'./modules/page-confirm-recover-password/page-confirm-recover-password.component'
			).then((m) => m.PageConfirmRecoverPasswordComponent),
		data: {
			title: 'Redefinir Senha',
			description: 'Confirme sua nova senha',
		},
	},
	{
		path: 'check-your-email',
		loadComponent: () =>
			import(
				'./modules/page-check-your-email/page-check-your-email.component'
			).then((m) => m.PageCheckYourEmailComponent),
		data: {
			title: 'Verifique seu Email',
			description: 'Instruções enviadas por email',
		},
	},
	{
		path: 'activate-account',
		loadComponent: () =>
			import(
				'./modules/page-activate-account/page-activate-account.component'
			).then((m) => m.PageActivateAccountComponent),
		data: { title: 'Ativar Conta', description: 'Ative sua conta' },
	},

	// ========================================
	// ROTAS PÚBLICAS INFORMATIVAS
	// ========================================
	{
		path: 'blogs',
		loadComponent: () =>
			import('./modules/blogs/blogs.component').then(
				(m) => m.BlogsComponent
			),
		data: { title: 'Blog', description: 'Artigos e novidades' },
	},
	{
		path: 'blog/:slug',
		loadComponent: () =>
			import('./modules/blog/blog.component').then(
				(m) => m.BlogComponent
			),
		data: { title: 'Artigo', description: 'Leia nossos artigos' },
	},
	{
		path: 'terms-and-conditions',
		loadComponent: () =>
			import(
				'./modules/terms-and-conditions/terms-and-conditions.component'
			).then((m) => m.TermsAndConditionsComponent),
		data: { title: 'Termos e Condições', description: 'Termos de uso' },
	},
	{
		path: 'privacy-policy',
		loadComponent: () =>
			import('./modules/privacy-policy/privacy-policy.component').then(
				(m) => m.PrivacyPolicyComponent
			),
		data: {
			title: 'Política de Privacidade',
			description: 'Como protegemos seus dados',
		},
	},
	{
		path: 'stdeula',
		loadComponent: () =>
			import('./modules/stdeula/stdeula.component').then(
				(m) => m.STDEULAComponent
			),
		data: { title: 'EULA', description: 'Acordo de licença' },
	},

	// ========================================
	// DASHBOARD - ROTAS PROTEGIDAS
	// ========================================
	{
		path: 'dashboard',
		component: DashboardLayoutComponent,
		canActivate: [AuthGuard], // Renomeado de AuthGuardService
		data: { requiresAuth: true },
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./modules/dashboard/dashboard.component').then(
						(m) => m.DashboardComponent
					),
				data: { title: 'Dashboard', description: 'Painel principal' },
			},
			{
				path: 'perfil',
				loadComponent: () =>
					import(
						'./modules/dashboard-perfil/dashboard-perfil.component'
					).then((m) => m.DashboardPerfilComponent),
				data: { title: 'Perfil', description: 'Gerenciar perfil' },
			},
			{
				path: 'pillbox',
				loadComponent: () =>
					import(
						'./modules/dashboard-pillbox/dashboard-pillbox.component'
					).then((m) => m.DashboardPillboxComponent),
				data: {
					title: 'Nova Pillbox',
					description: 'Cadastrar pillbox',
				},
			},
			{
				path: 'update-pillbox/:id',
				loadComponent: () =>
					import(
						'./modules/dashboard-update-pillbox/dashboard-update-pillbox.component'
					).then((m) => m.DashboardUpdatePillboxComponent),
				data: {
					title: 'Editar Pillbox',
					description: 'Atualizar pillbox',
				},
			},
			{
				path: 'pillboxes',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-pillboxes/dashboard-list-pillboxes.component'
					).then((m) => m.DashboardListPillboxesComponent),
				data: { title: 'Pillboxes', description: 'Listar pillboxes' },
			},

			// ========================================
			// ROTAS PARA PROFISSIONAIS DE SAÚDE
			// ========================================
			{
				path: 'patients',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-patients/dashboard-list-patients.component'
					).then((m) => m.DashboardListPatientsComponent),
				canActivate: [RoleGuard],
				data: {
					title: 'Pacientes',
					description: 'Gerenciar pacientes',
					roles: [
						'doctor',
						'nurse',
						'caregiver',
						'admin',
						'super_admin',
					],
				},
			},

			// ========================================
			// MEDICAMENTOS
			// ========================================
			{
				path: 'medications',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-medications/dashboard-list-medications.component'
					).then((m) => m.DashboardListMedicationsComponent),
				data: {
					title: 'Medicamentos',
					description: 'Listar medicamentos',
				},
			},
			{
				path: 'medication',
				loadComponent: () =>
					import(
						'./modules/dashboard-medication/dashboard-medication.component'
					).then((m) => m.DashboardMedicationComponent),
				data: {
					title: 'Novo Medicamento',
					description: 'Cadastrar medicamento',
				},
			},
			{
				path: 'update-medication',
				loadComponent: () =>
					import(
						'./modules/dashboard-update-medication/dashboard-update-medication.component'
					).then((m) => m.DashboardUpdateMedicationComponent),
				data: {
					title: 'Editar Medicamento',
					description: 'Atualizar medicamento',
				},
			},

			// ========================================
			// RELATÓRIOS E CONFIGURAÇÕES
			// ========================================
			{
				path: 'report',
				loadComponent: () =>
					import(
						'./modules/dashboard-report/dashboard-report.component'
					).then((m) => m.DashboardReportComponent),
				data: {
					title: 'Relatórios',
					description: 'Visualizar relatórios',
				},
			},
			{
				path: 'settings',
				loadComponent: () =>
					import(
						'./modules/dashboard-settings/dashboard-settings.component'
					).then((m) => m.DashboardSettingsComponent),
				data: {
					title: 'Configurações',
					description: 'Configurações da conta',
				},
			},
			{
				path: 'prices',
				loadComponent: () =>
					import(
						'./modules/dashboard-prices/dashboard-prices.component'
					).then((m) => m.DashboardPricesComponent),
				data: { title: 'Planos', description: 'Gerenciar assinatura' },
			},
			{
				path: 'support',
				loadComponent: () =>
					import(
						'./modules/dashboard-support/dashboard-support.component'
					).then((m) => m.DashboardSupportComponent),
				data: { title: 'Suporte', description: 'Central de ajuda' },
			},

			// ========================================
			// ROTAS ADMINISTRATIVAS
			// ========================================
			{
				path: 'admin',
				canActivate: [AdminGuard],
				data: {
					title: 'Administração',
					description: 'Painel administrativo',
					roles: ['admin', 'super_admin'],
				},
				children: [
					{
						path: '',
						redirectTo: 'accounts',
						pathMatch: 'full',
					},
					// {
					// 	path: 'accounts',
					// 	loadComponent: () =>
					// 		import(
					// 			'./modules/admin/admin-accounts/admin-accounts.component'
					// 		).then((m) => m.AdminAccountsComponent),
					// 	data: {
					// 		title: 'Gerenciar Contas',
					// 		description: 'Administrar usuários',
					// 	},
					// },
					// {
					// 	path: 'analytics',
					// 	loadComponent: () =>
					// 		import(
					// 			'./modules/admin/admin-analytics/admin-analytics.component'
					// 		).then((m) => m.AdminAnalyticsComponent),
					// 	data: {
					// 		title: 'Analytics',
					// 		description: 'Estatísticas do sistema',
					// 	},
					// },
					// {
					// 	path: 'system',
					// 	loadComponent: () =>
					// 		import(
					// 			'./modules/admin/admin-system/admin-system.component'
					// 		).then((m) => m.AdminSystemComponent),
					// 	canActivate: [RoleGuard],
					// 	data: {
					// 		title: 'Sistema',
					// 		description: 'Configurações do sistema',
					// 		roles: ['super_admin'],
					// 	},
					// },
				],
			},
		],
	},

	// ========================================
	// ROTAS DE ERRO
	// ========================================
	// {
	// 	path: 'unauthorized',
	// 	loadComponent: () =>
	// 		import('./modules/unauthorized/unauthorized.component').then(
	// 			(m) => m.UnauthorizedComponent
	// 		),
	// 	data: { title: 'Acesso Negado', description: 'Você não tem permissão' },
	// },
	// {
	// 	path: 'server-error',
	// 	loadComponent: () =>
	// 		import('./modules/server-error/server-error.component').then(
	// 			(m) => m.ServerErrorComponent
	// 		),
	// 	data: { title: 'Erro do Servidor', description: 'Erro interno' },
	// },

	// Página 404 - deve ser sempre a última rota
	{
		path: '**',
		component: PageNotFoundComponent,
		data: {
			title: 'Página não encontrada',
			description: 'A página solicitada não existe',
		},
	},
];
