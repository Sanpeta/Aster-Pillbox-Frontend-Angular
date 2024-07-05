import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class HomeService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService
	) {}

	public sendContactProfessional(info: {
		name: string;
		email: string;
	}): Observable<boolean> {
		const ACCOUNT_ID = this.cookie.get('ACCOUNT_ID');

		return this.httpClient.post<boolean>(
			this.API_URL + '/contact-site-professional',
			info,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	public sendMenssage(info: {
		name: string;
		email: string;
		message: string;
	}): Observable<boolean> {
		const ACCOUNT_ID = this.cookie.get('ACCOUNT_ID');

		return this.httpClient.post<boolean>(
			this.API_URL + '/contact-site-message',
			info,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
