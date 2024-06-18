import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { CookieService } from 'ngx-cookie-service';
import {
	UpdateAccountActivationRequest,
	UpdateAccountActivationResponse,
} from '../../models/interfaces/account-activation/UpdateAccountActivation';
import {
	UpdateAccountResetPasswordRequest,
	UpdateAccountResetPasswordResponse,
} from '../../models/interfaces/account-reset-password/UpdateAccountResetPassword';
import {
	LoginAccountRequest,
	LoginAccountResponse,
} from '../../models/interfaces/auth/Auth';
import {
	AccountRequest,
	AccountResponse,
} from './../../models/interfaces/account/CreateAccount';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private API_URL = environment.API_URL;

	constructor(private http: HttpClient, private cookie: CookieService) {}

	isLoggedIn(): boolean {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		return AUTH_TOKEN ? true : false;
	}

	registerAccount(
		accountRequest: AccountRequest
	): Observable<AccountResponse> {
		return this.http.post<AccountResponse>(
			`${this.API_URL}/accounts`,
			accountRequest,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	createTokenAccountActivate(email: string): Observable<string> {
		return this.http.post<string>(
			`${this.API_URL}/create-activation-account?email=${email}`,
			{},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	activateAccount(
		data: UpdateAccountActivationRequest
	): Observable<UpdateAccountActivationResponse> {
		return this.http.put<UpdateAccountActivationResponse>(
			`${this.API_URL}/activate-account`,
			{
				token: data.token,
				email: data.email,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	createTokenResetPassword(email: string): Observable<string> {
		return this.http.post<string>(
			`${this.API_URL}/create-token-account-password-reset?email=${email}`,
			{},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	updateAccountPassword(
		data: UpdateAccountResetPasswordRequest
	): Observable<UpdateAccountResetPasswordResponse> {
		return this.http.put<UpdateAccountResetPasswordResponse>(
			`${this.API_URL}/reset-account-password`,
			{
				token: data.token,
				account_id: data.account_id,
				password: data.password,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	loginAccount(
		loginRequest: LoginAccountRequest
	): Observable<LoginAccountResponse> {
		return this.http.post<LoginAccountResponse>(
			`${this.API_URL}/login`,
			loginRequest,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
