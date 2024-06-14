import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { RecoverPasswordComponent } from './modules/recover-password/recover-password.component';
import { RegisterComponent } from './modules/register/register.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'recover-password', component: RecoverPasswordComponent },
	{ path: 'register', component: RegisterComponent },
];
