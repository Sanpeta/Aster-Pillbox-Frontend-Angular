import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth/auth-guard.service';
import { LoggedGuardService } from './guards/logged/logged-guard.service';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

export const routes: Routes = [
	{ path: '', redirectTo: '', pathMatch: 'full' },
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [LoggedGuardService],
	},
	{
		path: 'blogs',
		loadComponent: () =>
			import('./modules/blogs/blogs.component').then(
				(m) => m.BlogsComponent
			),
	},
	{
		path: 'register',
		loadComponent: () =>
			import('./modules/register/register.component').then(
				(m) => m.RegisterComponent
			),
		canActivate: [LoggedGuardService],
	},
	{
		path: 'terms-and-conditions',
		loadComponent: () =>
			import(
				'./modules/terms-and-conditions/terms-and-conditions.component'
			).then((m) => m.TermsAndConditionsComponent),
	},
	{
		path: 'privacy-policy',
		loadComponent: () =>
			import('./modules/privacy-policy/privacy-policy.component').then(
				(m) => m.PrivacyPolicyComponent
			),
	},
	{
		path: 'stdeula',
		loadComponent: () =>
			import('./modules/stdeula/stdeula.component').then(
				(m) => m.STDEULAComponent
			),
	},
	{
		path: 'recover-password',
		loadComponent: () =>
			import(
				'./modules/recover-password/recover-password.component'
			).then((m) => m.RecoverPasswordComponent),
		canActivate: [LoggedGuardService],
	},
	{
		path: 'reset-account-password',
		loadComponent: () =>
			import(
				'./modules/page-confirm-recover-password/page-confirm-recover-password.component'
			).then((m) => m.PageConfirmRecoverPasswordComponent),
	},
	{
		path: 'check-your-email',
		loadComponent: () =>
			import(
				'./modules/page-check-your-email/page-check-your-email.component'
			).then((m) => m.PageCheckYourEmailComponent),
	},
	{
		path: 'activate-account',
		loadComponent: () =>
			import(
				'./modules/page-activate-account/page-activate-account.component'
			).then((m) => m.PageActivateAccountComponent),
	},
	{
		path: 'dashboard',
		component: DashboardLayoutComponent,
		canActivate: [AuthGuardService],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./modules/dashboard/dashboard.component').then(
						(m) => m.DashboardComponent
					),
			},
			{
				path: 'perfil',
				loadComponent: () =>
					import(
						'./modules/dashboard-perfil/dashboard-perfil.component'
					).then((m) => m.DashboardPerfilComponent),
			},
			{
				path: 'pillbox',
				loadComponent: () =>
					import(
						'./modules/dashboard-pillbox/dashboard-pillbox.component'
					).then((m) => m.DashboardPillboxComponent),
			},
			{
				path: 'update-pillbox/:id',
				loadComponent: () =>
					import(
						'./modules/dashboard-update-pillbox/dashboard-update-pillbox.component'
					).then((m) => m.DashboardUpdatePillboxComponent),
			},
			{
				path: 'pillboxes',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-pillboxes/dashboard-list-pillboxes.component'
					).then((m) => m.DashboardListPillboxesComponent),
			},
			{
				path: 'patients',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-patients/dashboard-list-patients.component'
					).then((m) => m.DashboardListPatientsComponent),
			},
			{
				path: 'medications',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-medications/dashboard-list-medications.component'
					).then((m) => m.DashboardListMedicationsComponent),
			},
			{
				path: 'medication',
				loadComponent: () =>
					import(
						'./modules/dashboard-medication/dashboard-medication.component'
					).then((m) => m.DashboardMedicationComponent),
			},
			{
				path: 'update-medication',
				loadComponent: () =>
					import(
						'./modules/dashboard-update-medication/dashboard-update-medication.component'
					).then((m) => m.DashboardUpdateMedicationComponent),
			},
			{
				path: 'report',
				loadComponent: () =>
					import(
						'./modules/dashboard-report/dashboard-report.component'
					).then((m) => m.DashboardReportComponent),
			},
			{
				path: 'settings',
				loadComponent: () =>
					import(
						'./modules/dashboard-settings/dashboard-settings.component'
					).then((m) => m.DashboardSettingsComponent),
			},
			{
				path: 'prices',
				loadComponent: () =>
					import(
						'./modules/dashboard-prices/dashboard-prices.component'
					).then((m) => m.DashboardPricesComponent),
			},
			{
				path: 'support',
				loadComponent: () =>
					import(
						'./modules/dashboard-support/dashboard-support.component'
					).then((m) => m.DashboardSupportComponent),
			},
		],
	},
	{ path: '**', component: PageNotFoundComponent },
];
