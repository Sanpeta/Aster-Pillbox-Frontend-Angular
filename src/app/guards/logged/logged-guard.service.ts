import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../../services/account/account.service'; // Seu serviço de autenticação

@Injectable({
	providedIn: 'root',
})
export class LoggedGuardService implements CanActivate {
	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	canActivate(): Observable<boolean | UrlTree> {
		return this.accountService.isLoggedIn().pipe(
			map(
				(isAuthenticated: boolean) =>
					!isAuthenticated || this.router.parseUrl('/dashboard')
			) // Redireciona para o dashboard se estiver autenticado
		);
	}
}
