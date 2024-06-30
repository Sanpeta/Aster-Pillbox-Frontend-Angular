import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	CreateAlarmRequest,
	CreateAlarmResponse,
} from '../../models/interfaces/alarm/CreateAlarm';
import { GetAlarmResponse } from '../../models/interfaces/alarm/GetAlarm';
import {
	UpdateAlarmRequest,
	UpdateAlarmResponse,
} from '../../models/interfaces/alarm/UpdateAlarm';

@Injectable({
	providedIn: 'root',
})
export class AlarmService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService,
		private router: Router
	) {}

	public createAlarm(
		alarm: CreateAlarmRequest
	): Observable<CreateAlarmResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		// Check if token exists
		if (!AUTH_TOKEN) {
			return of(false);
		}
		return this.httpClient.post<CreateAlarmResponse>(
			this.API_URL + '/alarm',
			alarm,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getAlarm(id: number): Observable<GetAlarmResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		return this.httpClient.get<GetAlarmResponse>(
			this.API_URL + '/alarm/' + id,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public updateAlarm(
		alarm: UpdateAlarmRequest
	): Observable<UpdateAlarmResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		// Check if token exists
		if (!AUTH_TOKEN) {
			return of(false);
		}

		return this.httpClient.put<UpdateAlarmResponse>(
			this.API_URL + '/alarm',
			alarm,
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
