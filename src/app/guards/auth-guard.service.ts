import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account/account.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuardService {
	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		if (this.accountService.isLoggedIn()) {
			// Verifica se o usuário está logado
			return true;
		} else {
			// Redireciona para a página de login
			return this.router.parseUrl('/login'); // Cria um UrlTree para a rota de login
		}
	}
}
