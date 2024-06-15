import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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

	constructor(private http: HttpClient) {}

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
