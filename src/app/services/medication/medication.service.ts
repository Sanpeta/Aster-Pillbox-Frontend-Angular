import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	CreateMedicationRequest,
	CreateMedicationResponse,
} from '../../models/interfaces/medication/CreateMedication';
import { GetMedicationResponse } from '../../models/interfaces/medication/GetMedication';
import { GetMedicationsByUserIDResponse } from '../../models/interfaces/medication/GetMedicationsByUserID';
import {
	UpdateMedicationRequest,
	UpdateMedicationResponse,
} from '../../models/interfaces/medication/UpdateMedication';

@Injectable({
	providedIn: 'root',
})
export class MedicationService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService,
		private router: Router
	) {}

	public createMedication(
		medication: CreateMedicationRequest
	): Observable<CreateMedicationResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		// Check if token exists
		if (!AUTH_TOKEN) {
			return of(false);
		}
		return this.httpClient.post<CreateMedicationResponse>(
			this.API_URL + '/medication',
			medication,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getMedication(id: number): Observable<GetMedicationResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		return this.httpClient.get<GetMedicationResponse>(
			this.API_URL + '/medication/' + id,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getMedicationsByUserID(): Observable<GetMedicationsByUserIDResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const USER_ID = this.cookie.get('USER_ID');

		return this.httpClient.get<GetMedicationsByUserIDResponse>(
			this.API_URL + '/medications/user/' + USER_ID,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public updateMedication(
		medication: UpdateMedicationRequest
	): Observable<UpdateMedicationResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const USER_ID = this.cookie.get('USER_ID');

		// Check if token exists
		if (!AUTH_TOKEN || !USER_ID) {
			return of(false);
		}

		return this.httpClient.put<UpdateMedicationResponse>(
			this.API_URL + '/medications',
			medication,
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
