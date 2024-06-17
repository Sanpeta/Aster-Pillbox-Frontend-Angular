import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { PageActivateAccountComponent } from './modules/page-activate-account/page-activate-account.component';
import { PageCheckYourEmailComponent } from './modules/page-check-your-email/page-check-your-email.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

export const routes: Routes = [
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
		path: 'dashboard',
		loadComponent: () =>
			import('./modules/dashboard/dashboard.component').then(
				(m) => m.DashboardComponent
			),
	},
	{ path: 'check-your-email', component: PageCheckYourEmailComponent },
	{ path: 'activate-account', component: PageActivateAccountComponent },
	{ path: '**', component: PageNotFoundComponent },
];
