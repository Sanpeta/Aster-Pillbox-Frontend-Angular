import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	CreateUserRequest,
	CreateUserResponse,
} from '../../models/interfaces/user/CreateUser';
import { GetUserResponse } from '../../models/interfaces/user/GetUser';
import {
	UpdateUserRequest,
	UpdateUserResponse,
} from '../../models/interfaces/user/UpdateUser';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService,
		private router: Router
	) {}

	public createUser(
		user: CreateUserRequest
	): Observable<CreateUserResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const ACCOUNT_ID = this.cookie.get('ACCOUNT_ID');

		// Check if token exists
		if (!AUTH_TOKEN || !ACCOUNT_ID) {
			return of(false); // Return false as Observable if no token
		}
		return this.httpClient.post<CreateUserResponse>(
			this.API_URL + '/users',
			user,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getUser(): Observable<GetUserResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const ACCOUNT_ID = this.cookie.get('ACCOUNT_ID');

		return this.httpClient.get<GetUserResponse>(
			this.API_URL + '/users/id/' + ACCOUNT_ID,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getUserByAccountID(id: number): Observable<GetUserResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		return this.httpClient.get<GetUserResponse>(
			this.API_URL + '/user/account/' + id,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public updateUser(
		user: UpdateUserRequest
	): Observable<UpdateUserResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const USER_ID = this.cookie.get('USER_ID');

		// Check if token exists
		if (!AUTH_TOKEN || !USER_ID) {
			return of(false);
		}

		return this.httpClient.put<UpdateUserResponse>(
			this.API_URL + '/users',
			user,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public deleteUser() {}
}
