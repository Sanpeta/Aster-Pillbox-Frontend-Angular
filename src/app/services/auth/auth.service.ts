import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import {
	ChangePasswordRequest,
	CheckAuthResponse,
	DisableMFARequest,
	EnableMFARequest,
	ForgotPasswordRequest,
	ForgotPasswordResponse,
	LoginRequest,
	LoginResponse,
	LogoutResponse,
	MFAResponse,
	MFASetupResponse,
	RefreshTokenRequest,
	RefreshTokenResponse,
	RegisterRequest,
	RegisterResponse,
	ResendVerificationRequest,
	ResetPasswordRequest,
	ResetPasswordResponse,
	UserInfo,
	VerifyEmailRequest,
	VerifyEmailResponse,
	VerifyMFARequest,
} from '../../models/interfaces/auth/auth.interface';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private API_URL = environment.API_URL;
	private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	constructor(
		private http: HttpClient,
		private cookie: CookieService,
		private router: Router
	) {
		// Verificar se há token salvo ao inicializar o serviço
		this.checkStoredAuth();
	}

	// ========================================
	// MÉTODOS DE AUTENTICAÇÃO BÁSICA
	// ========================================

	/**
	 * Registra um novo usuário
	 */
	register(request: RegisterRequest): Observable<RegisterResponse> {
		return this.http
			.post<RegisterResponse>(`${this.API_URL}/register`, request, {
				headers: this.getHeaders(),
			})
			.pipe(catchError(this.handleError));
	}

	/**
	 * Realiza login do usuário
	 */
	login(request: LoginRequest): Observable<LoginResponse> {
		return this.http
			.post<LoginResponse>(`${this.API_URL}/login`, request, {
				headers: this.getHeaders(),
			})
			.pipe(
				tap((response) => this.handleSuccessfulAuth(response)),
				catchError(this.handleError)
			);
	}

	/**
	 * Verifica email do usuário
	 */
	verifyEmail(request: VerifyEmailRequest): Observable<VerifyEmailResponse> {
		return this.http
			.post<VerifyEmailResponse>(
				`${this.API_URL}/verify-email`,
				request,
				{ headers: this.getHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Inicia processo de recuperação de senha
	 */
	forgotPassword(
		request: ForgotPasswordRequest
	): Observable<ForgotPasswordResponse> {
		return this.http
			.post<ForgotPasswordResponse>(
				`${this.API_URL}/forgot-password`,
				request,
				{ headers: this.getHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Redefine senha com token
	 */
	resetPassword(
		request: ResetPasswordRequest
	): Observable<ResetPasswordResponse> {
		return this.http
			.post<ResetPasswordResponse>(
				`${this.API_URL}/reset-password`,
				request,
				{ headers: this.getHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Renova token de acesso
	 */
	refreshToken(
		request: RefreshTokenRequest
	): Observable<RefreshTokenResponse> {
		return this.http
			.post<RefreshTokenResponse>(
				`${this.API_URL}/refresh-token`,
				request,
				{ headers: this.getHeaders() }
			)
			.pipe(
				tap((response) => this.updateAccessToken(response)),
				catchError(this.handleError)
			);
	}

	/**
	 * Reenvia email de verificação
	 */
	resendVerification(
		request: ResendVerificationRequest
	): Observable<RegisterResponse> {
		return this.http
			.post<RegisterResponse>(
				`${this.API_URL}/resend-verification`,
				request,
				{ headers: this.getHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	// ========================================
	// MÉTODOS AUTENTICADOS
	// ========================================

	/**
	 * Verifica se token é válido
	 */
	checkAuth(): Observable<CheckAuthResponse> {
		return this.http
			.get<CheckAuthResponse>(`${this.API_URL}/auth/check`, {
				headers: this.getAuthHeaders(),
			})
			.pipe(
				tap((response) => {
					if (response.success) {
						this.isAuthenticatedSubject.next(true);
					}
				}),
				catchError(this.handleError)
			);
	}

	/**
	 * Realiza logout
	 */
	logout(): Observable<LogoutResponse> {
		return this.http
			.post<LogoutResponse>(
				`${this.API_URL}/auth/logout`,
				{},
				{ headers: this.getAuthHeaders() }
			)
			.pipe(
				tap(() => this.handleLogout()),
				catchError(this.handleError)
			);
	}

	/**
	 * Altera senha do usuário autenticado
	 */
	changePassword(request: ChangePasswordRequest): Observable<any> {
		return this.http
			.put(`${this.API_URL}/auth/change-password`, request, {
				headers: this.getAuthHeaders(),
			})
			.pipe(catchError(this.handleError));
	}

	// ========================================
	// MÉTODOS MFA
	// ========================================

	/**
	 * Habilita MFA
	 */
	enableMFA(request: EnableMFARequest): Observable<MFASetupResponse> {
		return this.http
			.post<MFASetupResponse>(
				`${this.API_URL}/auth/mfa/enable`,
				request,
				{ headers: this.getAuthHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Desabilita MFA
	 */
	disableMFA(request: DisableMFARequest): Observable<MFAResponse> {
		return this.http
			.post<MFAResponse>(`${this.API_URL}/auth/mfa/disable`, request, {
				headers: this.getAuthHeaders(),
			})
			.pipe(catchError(this.handleError));
	}

	/**
	 * Verifica código MFA
	 */
	verifyMFA(request: VerifyMFARequest): Observable<MFAResponse> {
		return this.http
			.post<MFAResponse>(`${this.API_URL}/auth/mfa/verify`, request, {
				headers: this.getAuthHeaders(),
			})
			.pipe(catchError(this.handleError));
	}

	// ========================================
	// MÉTODOS DE ESTADO E UTILITÁRIOS
	// ========================================

	/**
	 * Verifica se usuário está logado
	 */
	isLoggedIn(): boolean {
		const token = this.getAccessToken();
		const refreshToken = this.getRefreshToken();
		return !!(token && refreshToken);
	}

	/**
	 * Obtém usuário atual
	 */
	getCurrentUser(): UserInfo | null {
		return this.currentUserSubject.value;
	}

	/**
	 * Obtém token de acesso
	 */
	getAccessToken(): string | null {
		return this.cookie.get('access_token') || null;
	}

	/**
	 * Obtém refresh token
	 */
	getRefreshToken(): string | null {
		return this.cookie.get('refresh_token') || null;
	}

	/**
	 * Força logout local (sem chamar API)
	 */
	forceLogout(): void {
		this.handleLogout();
	}

	// ========================================
	// MÉTODOS PRIVADOS
	// ========================================

	private checkStoredAuth(): void {
		const token = this.getAccessToken();
		const userStr = this.cookie.get('current_user');

		if (token && userStr) {
			try {
				const user = JSON.parse(userStr);
				this.currentUserSubject.next(user);
				this.isAuthenticatedSubject.next(true);
			} catch (error) {
				this.handleLogout();
			}
		}
	}

	private handleSuccessfulAuth(response: LoginResponse): void {
		// Salvar tokens
		this.cookie.set('access_token', response.access_token, {
			expires: new Date(response.expires_at),
			secure: environment.production,
			sameSite: 'Strict',
		});

		this.cookie.set('refresh_token', response.refresh_token, {
			expires: 30, // 30 dias
			secure: environment.production,
			sameSite: 'Strict',
		});

		// Salvar informações do usuário
		this.cookie.set('current_user', JSON.stringify(response.user), {
			expires: 30,
			secure: environment.production,
			sameSite: 'Strict',
		});

		// Atualizar subjects
		this.currentUserSubject.next(response.user);
		this.isAuthenticatedSubject.next(true);
	}

	private updateAccessToken(response: RefreshTokenResponse): void {
		this.cookie.set('access_token', response.access_token, {
			expires: new Date(response.expires_at),
			secure: environment.production,
			sameSite: 'Strict',
		});
	}

	private handleLogout(): void {
		// Limpar cookies
		this.cookie.delete('access_token');
		this.cookie.delete('refresh_token');
		this.cookie.delete('current_user');

		// Atualizar subjects
		this.currentUserSubject.next(null);
		this.isAuthenticatedSubject.next(false);

		// Redirecionar para login
		this.router.navigate(['/auth/login']);
	}

	private getHeaders(): HttpHeaders {
		return new HttpHeaders({
			'Content-Type': 'application/json',
		});
	}

	private getAuthHeaders(): HttpHeaders {
		const token = this.getAccessToken();
		return new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		});
	}

	private handleError(error: any): Observable<never> {
		let errorMessage = 'An error occurred';

		if (error.error instanceof ErrorEvent) {
			// Client-side error
			errorMessage = `Error: ${error.error.message}`;
		} else {
			// Server-side error
			if (error.error && error.error.message) {
				errorMessage = error.error.message;
			} else if (error.message) {
				errorMessage = error.message;
			} else {
				errorMessage = `Error Code: ${error.status}\nMessage: ${error.statusText}`;
			}
		}

		console.error('Auth Service Error:', error);
		return throwError(() => new Error(errorMessage));
	}
}
