import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth/auth-guard.service';
import { LoggedGuardService } from './guards/logged/logged-guard.service';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { LoginComponent } from './modules/login/login.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [LoggedGuardService],
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
				path: 'pillboxes',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-pillboxes/dashboard-list-pillboxes.component'
					).then((m) => m.DashboardListPillboxesComponent),
			},
			{
				path: 'alarms',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-alarms/dashboard-list-alarms.component'
					).then((m) => m.DashboardListAlarmsComponent),
			},
			{
				path: 'patients',
				loadComponent: () =>
					import(
						'./modules/dashboard-list-patients/dashboard-list-patients.component'
					).then((m) => m.DashboardListPatientsComponent),
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
