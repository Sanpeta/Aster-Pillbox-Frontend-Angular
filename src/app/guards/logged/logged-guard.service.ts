import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AccountService } from '../../services/account/account.service';

@Injectable({
	providedIn: 'root',
})
export class LoggedGuardService {
	constructor(
		private readonly accountService: AccountService,
		private readonly router: Router
	) {}

	canActivate(): Observable<boolean | UrlTree> {
		return this.accountService.isLoggedIn().pipe(
			map((isAuthenticated: boolean) =>
				isAuthenticated ? this.router.parseUrl('/dashboard') : true
			),
			catchError(() => of(true))
		);
	}
}
