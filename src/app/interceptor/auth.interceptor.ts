import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { RefreshTokenRequest } from '../models/interfaces/auth/auth.interface';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> =
		new BehaviorSubject<any>(null);

	constructor(private authService: AuthService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		// Adicionar token de autorização se disponível
		const authToken = this.authService.getAccessToken();

		if (authToken && !this.isPublicEndpoint(request.url)) {
			request = this.addTokenHeader(request, authToken);
		}

		return next.handle(request).pipe(
			catchError((error) => {
				if (
					error instanceof HttpErrorResponse &&
					!request.url.includes('auth/login') &&
					error.status === 401
				) {
					return this.handle401Error(request, next);
				}

				return throwError(() => error);
			})
		);
	}

	private addTokenHeader(
		request: HttpRequest<any>,
		token: string
	): HttpRequest<any> {
		return request.clone({
			headers: request.headers.set('Authorization', `Bearer ${token}`),
		});
	}

	private isPublicEndpoint(url: string): boolean {
		const publicEndpoints = [
			'/auth/login',
			'/auth/register',
			'/auth/verify-email',
			'/auth/forgot-password',
			'/auth/reset-password',
			'/auth/refresh-token',
			'/auth/resend-verification',
			'/accounts/check-email',
		];

		return publicEndpoints.some((endpoint) => url.includes(endpoint));
	}

	private handle401Error(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);

			const refreshToken = this.authService.getRefreshToken();

			if (refreshToken) {
				const refreshRequest: RefreshTokenRequest = {
					refresh_token: refreshToken,
				};

				return this.authService.refreshToken(refreshRequest).pipe(
					switchMap((response: any) => {
						this.isRefreshing = false;
						this.refreshTokenSubject.next(response.access_token);

						return next.handle(
							this.addTokenHeader(request, response.access_token)
						);
					}),
					catchError((err) => {
						this.isRefreshing = false;
						this.authService.forceLogout();
						return throwError(() => err);
					})
				);
			}
		}

		return this.refreshTokenSubject.pipe(
			filter((token) => token !== null),
			take(1),
			switchMap((token) =>
				next.handle(this.addTokenHeader(request, token))
			)
		);
	}
}
