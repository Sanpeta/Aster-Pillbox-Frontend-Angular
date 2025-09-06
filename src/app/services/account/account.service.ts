import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import {
	AccountActivityResponse,
	AccountResponse,
	AccountsListResponse,
	AccountStatsResponse,
	BulkOperationResponse,
	CreateAccountRequest,
	ListAccountsByOrganizationRequest,
	MessageResponse,
	SearchAccountsRequest,
	SearchAccountsResponse,
} from '../../models/interfaces/account/account.interface';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private API_URL = environment.API_URL;

	constructor(private http: HttpClient, private cookie: CookieService) {}

	// ========================================
	// MÉTODOS DE USUÁRIO AUTENTICADO
	// ========================================

	/**
	 * Obtém a conta do usuário autenticado
	 */
	getCurrentAccount(): Observable<AccountResponse> {
		return this.http
			.get<AccountResponse>(`${this.API_URL}/account`, {
				headers: this.getAuthHeaders(),
			})
			.pipe(catchError(this.handleError));
	}

	/**
	 * Lista contas por organização (admin only)
	 */
	listAccountsByOrganization(
		organizationId: string,
		request?: ListAccountsByOrganizationRequest
	): Observable<AccountsListResponse> {
		let params = new HttpParams();

		if (request?.limit) {
			params = params.set('limit', request.limit.toString());
		}
		if (request?.offset) {
			params = params.set('offset', request.offset.toString());
		}
		if (request?.is_active !== undefined) {
			params = params.set('is_active', request.is_active.toString());
		}

		return this.http
			.get<AccountsListResponse>(
				`${this.API_URL}/admin/organizations/${organizationId}/accounts`,
				{
					headers: this.getAuthHeaders(),
					params: params,
				}
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Lista membros da organização (para gestores da organização)
	 */
	listOrganizationMembers(
		organizationId: string,
		request?: ListAccountsByOrganizationRequest
	): Observable<AccountsListResponse> {
		let params = new HttpParams();

		if (request?.limit) {
			params = params.set('limit', request.limit.toString());
		}
		if (request?.offset) {
			params = params.set('offset', request.offset.toString());
		}
		if (request?.is_active !== undefined) {
			params = params.set('is_active', request.is_active.toString());
		}

		return this.http
			.get<AccountsListResponse>(
				`${this.API_URL}/organizations/${organizationId}/members`,
				{
					headers: this.getAuthHeaders(),
					params: params,
				}
			)
			.pipe(catchError(this.handleError));
	}

	// ========================================
	// MÉTODOS ADICIONAIS DE BUSCA E STATS
	// ========================================

	/**
	 * Busca contas com filtros (admin only)
	 */
	searchAccounts(
		request: SearchAccountsRequest
	): Observable<SearchAccountsResponse> {
		let params = new HttpParams().set('query', request.query);

		if (request.role) {
			params = params.set('role', request.role);
		}
		if (request.is_active !== undefined) {
			params = params.set('is_active', request.is_active.toString());
		}
		if (request.limit) {
			params = params.set('limit', request.limit.toString());
		}
		if (request.offset) {
			params = params.set('offset', request.offset.toString());
		}

		return this.http
			.get<SearchAccountsResponse>(
				`${this.API_URL}/admin/accounts/search`,
				{
					headers: this.getAuthHeaders(),
					params: params,
				}
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Obtém estatísticas de contas (admin only)
	 */
	getAccountStats(): Observable<AccountStatsResponse> {
		return this.http
			.get<AccountStatsResponse>(`${this.API_URL}/admin/accounts/stats`, {
				headers: this.getAuthHeaders(),
			})
			.pipe(catchError(this.handleError));
	}

	/**
	 * Obtém atividade de uma conta específica (admin only)
	 */
	getAccountActivity(accountId: string): Observable<AccountActivityResponse> {
		return this.http
			.get<AccountActivityResponse>(
				`${this.API_URL}/admin/accounts/${accountId}/activity`,
				{ headers: this.getAuthHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Operação em massa de contas (admin only)
	 */
	bulkUpdateAccounts(
		accountIds: string[],
		updates: Record<string, any>
	): Observable<BulkOperationResponse> {
		const request = {
			account_ids: accountIds,
			updates: updates,
		};

		return this.http
			.patch<BulkOperationResponse>(
				`${this.API_URL}/admin/accounts/bulk`,
				request,
				{ headers: this.getAuthHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Ativa uma conta específica (admin only)
	 */
	activateAccount(accountId: string): Observable<MessageResponse> {
		return this.http
			.patch<MessageResponse>(
				`${this.API_URL}/admin/accounts/${accountId}/activate`,
				{},
				{ headers: this.getAuthHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Desativa uma conta específica (admin only)
	 */
	deactivateAccount(
		accountId: string,
		reason?: string
	): Observable<MessageResponse> {
		const body = reason ? { reason } : {};

		return this.http
			.patch<MessageResponse>(
				`${this.API_URL}/admin/accounts/${accountId}/deactivate`,
				body,
				{ headers: this.getAuthHeaders() }
			)
			.pipe(catchError(this.handleError));
	}

	// ========================================
	// MÉTODOS DE VALIDAÇÃO E VERIFICAÇÃO
	// ========================================

	/**
	 * Valida dados de conta
	 */
	validateAccount(
		accountData: Partial<CreateAccountRequest>
	): Observable<any> {
		return this.http
			.post(`${this.API_URL}/accounts/validate`, accountData, {
				headers: this.getHeaders(),
			})
			.pipe(catchError(this.handleError));
	}

	// ========================================
	// MÉTODOS PRIVADOS
	// ========================================

	private getHeaders(): HttpHeaders {
		return new HttpHeaders({
			'Content-Type': 'application/json',
		});
	}

	private getAuthHeaders(): HttpHeaders {
		const token = this.cookie.get('access_token');
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

		console.error('Account Service Error:', error);
		return throwError(() => new Error(errorMessage));
	}
}
