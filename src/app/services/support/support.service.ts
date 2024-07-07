import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class SupportService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService
	) {}

	public sendMessageSupport(info: {
		topic: string;
		message: string;
	}): Observable<boolean> {
		const ACCOUNT_EMAIL = this.cookie.get('ACCOUNT_EMAIL');
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		if (!AUTH_TOKEN) {
			throw new Error('AUTH_TOKEN is not defined');
		}

		if (!ACCOUNT_EMAIL) {
			throw new Error('ACCOUNT_EMAIL is not defined');
		}

		const message = {
			...info,
			email: ACCOUNT_EMAIL,
		};

		return this.httpClient.post<boolean>(
			this.API_URL + '/contact-support-dashboard-message',
			message,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}
}
