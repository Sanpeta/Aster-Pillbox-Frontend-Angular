import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	CreateCaseRequest,
	CreateCaseResponse,
} from '../../models/interfaces/case/CreateCase';
import { GetCaseResponse } from '../../models/interfaces/case/GetCase';
import {
	UpdateCaseRequest,
	UpdateCaseResponse,
} from '../../models/interfaces/case/UpdateCase';

@Injectable({
	providedIn: 'root',
})
export class CaseService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService,
		private router: Router
	) {}

	public createCase(
		caseRequest: CreateCaseRequest
	): Observable<CreateCaseResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		// Check if token exists
		if (!AUTH_TOKEN) {
			return of(false); // Return false as Observable if no token
		}
		return this.httpClient.post<CreateCaseResponse>(
			this.API_URL + '/case',
			caseRequest,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getCase(id: number): Observable<GetCaseResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		return this.httpClient.get<GetCaseResponse>(
			this.API_URL + '/case/' + id,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getCasesByUserID(): Observable<GetCaseResponse[]> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const USER_ID = this.cookie.get('USER_ID');

		return this.httpClient.get<GetCaseResponse[]>(
			this.API_URL + '/cases/user/' + USER_ID,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getCasesByUserIDPaginated(
		page_id: number,
		page_size: number
	): Observable<GetCaseResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const USER_ID = this.cookie.get('USER_ID');

		return this.httpClient.get<GetCaseResponse>(
			this.API_URL +
				'/cases/user?id=' +
				USER_ID +
				'&page_id=' +
				page_id +
				'&page_size=' +
				page_size,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public updateCase(
		user: UpdateCaseRequest
	): Observable<UpdateCaseResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const USER_ID = this.cookie.get('USER_ID');

		// Check if token exists
		if (!AUTH_TOKEN || !USER_ID) {
			return of(false);
		}

		return this.httpClient.put<UpdateCaseResponse>(
			this.API_URL + '/case',
			user,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public deleteCase(id: number) {}
}
