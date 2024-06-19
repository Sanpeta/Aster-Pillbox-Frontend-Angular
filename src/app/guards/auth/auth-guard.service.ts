import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { AccountService } from '../../services/account/account.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuardService {
	private destroy$ = new Subject<void>();
	private return$: Observable<boolean> | null = null;

	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> {
		return this.accountService.isLoggedIn().pipe(
			map(
				(isAuthenticated: boolean) =>
					isAuthenticated || this.router.parseUrl('/login')
			),
			catchError(() => of(this.router.parseUrl('/login')))
		);
	}
}
