import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { LoginComponent } from './modules/login/login.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

export const routes: Routes = [
	{ path: '**', component: PageNotFoundComponent },
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{
		path: 'register',
		loadComponent: () =>
			import('./modules/register/register.component').then(
				(m) => m.RegisterComponent
			),
	},
	{
		path: 'recover-password',
		loadComponent: () =>
			import(
				'./modules/recover-password/recover-password.component'
			).then((m) => m.RecoverPasswordComponent),
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
		loadComponent: () =>
			import('./modules/dashboard/dashboard.component').then(
				(m) => m.DashboardComponent
			),
		canActivate: [AuthGuardService],
	},
];
