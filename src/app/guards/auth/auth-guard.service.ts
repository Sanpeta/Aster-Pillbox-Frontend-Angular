import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		return this.checkAuth(state.url);
	}

	private checkAuth(redirectUrl: string): Observable<boolean | UrlTree> {
		// Primeiro verifica se há token local
		if (!this.authService.isLoggedIn()) {
			return of(
				this.router.createUrlTree(['/auth/login'], {
					queryParams: { returnUrl: redirectUrl },
				})
			);
		}

		// Verifica se o token é válido no servidor
		return this.authService.checkAuth().pipe(
			map((response) => {
				if (response.success) {
					return true;
				} else {
					return this.router.createUrlTree(['/auth/login'], {
						queryParams: { returnUrl: redirectUrl },
					});
				}
			}),
			catchError((error) => {
				console.error('Auth check failed:', error);
				this.authService.forceLogout();
				return of(
					this.router.createUrlTree(['/auth/login'], {
						queryParams: { returnUrl: redirectUrl },
					})
				);
			})
		);
	}
}

@Injectable({
	providedIn: 'root',
})
export class RoleGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		const requiredRoles = route.data['roles'] as Array<string>;
		const currentUser = this.authService.getCurrentUser();

		if (!currentUser) {
			return this.router.createUrlTree(['/auth/login']);
		}

		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		const hasRequiredRole = requiredRoles.includes(currentUser.role);

		if (hasRequiredRole) {
			return true;
		} else {
			return this.router.createUrlTree(['/unauthorized']);
		}
	}
}

@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		const currentUser = this.authService.getCurrentUser();

		if (!currentUser) {
			return this.router.createUrlTree(['/auth/login']);
		}

		const isAdmin =
			currentUser.role === 'admin' || currentUser.role === 'super_admin';

		if (isAdmin) {
			return true;
		} else {
			return this.router.createUrlTree(['/unauthorized']);
		}
	}
}

@Injectable({
	providedIn: 'root',
})
export class GuestGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		if (this.authService.isLoggedIn()) {
			return this.router.createUrlTree(['/dashboard']);
		}

		return true;
	}
}
