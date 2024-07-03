import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	CreateHistoricMedicationRequest,
	CreateHistoricMedicationResponse,
} from '../../models/interfaces/historic-medication/CreateHistoricMedication';
import { HistoricMedicationsForReport } from '../../models/interfaces/historic-medication/GetHistoricMedicationsForReport';

@Injectable({
	providedIn: 'root',
})
export class HistoricMedicationService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService,
		private router: Router
	) {}

	public createHistoricMedication(
		info: CreateHistoricMedicationRequest
	): Observable<CreateHistoricMedicationResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		// Check if token exists
		if (!AUTH_TOKEN) {
			return of(false);
		}
		return this.httpClient.post<CreateHistoricMedicationResponse>(
			this.API_URL + '/historic-medication',
			info,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getHistoricMedicationForReport(): Observable<
		HistoricMedicationsForReport[] | boolean
	> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
		const USER_ID = this.cookie.get('USER_ID');

		// Check if token exists
		if (!AUTH_TOKEN || !USER_ID) {
			return of(false);
		}

		return this.httpClient.get<HistoricMedicationsForReport[]>(
			this.API_URL + '/historic-medications-for-report/' + USER_ID,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	// public getCompartmentContentsWithAlarmAndMedicationByCompartmentID(
	// 	compartment_id: number
	// ): Observable<GetCompartmentContentsWithAlarmAndMedicationByCompartmentIDResponse> {
	// 	const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

	// 	return this.httpClient.get<GetCompartmentContentsWithAlarmAndMedicationByCompartmentIDResponse>(
	// 		this.API_URL +
	// 			'/compartment-contents/compartiment-with-alarm-and-medication/' +
	// 			compartment_id,
	// 		{
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `bearer ${AUTH_TOKEN}`,
	// 			},
	// 		}
	// 	);
	// }

	// public getCompartmentContentsWithAlarmAndMedicationByCaseID(
	// 	case_id: number
	// ): Observable<GetCompartmentContentsWithAlarmAndMedicationByCaseIDResponse> {
	// 	const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

	// 	return this.httpClient.get<GetCompartmentContentsWithAlarmAndMedicationByCaseIDResponse>(
	// 		this.API_URL +
	// 			'/compartment-contents/case-with-alarm-and-medication/' +
	// 			case_id,
	// 		{
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `bearer ${AUTH_TOKEN}`,
	// 			},
	// 		}
	// 	);
	// }

	// public getCompartmentContentsWithAlarmAndMedicationByUserID(): Observable<
	// 	GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse[]
	// > {
	// 	const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
	// 	const USER_ID = this.cookie.get('USER_ID');

	// 	return this.httpClient.get<
	// 		GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse[]
	// 	>(
	// 		this.API_URL +
	// 			'/compartment-contents/user-with-alarm-and-medication/' +
	// 			USER_ID,
	// 		{
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `bearer ${AUTH_TOKEN}`,
	// 			},
	// 		}
	// 	);
	// }

	// public updateCompartmentOnlyContentAlarmAndCompartment(
	// 	info: UpdateCompartmentContentOnlyCompartmentAndAlarmRequest
	// ): Observable<
	// 	UpdateCompartmentContentOnlyCompartmentAndAlarmResponse | boolean
	// > {
	// 	const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

	// 	// Check if token exists
	// 	if (!AUTH_TOKEN) {
	// 		return of(false);
	// 	}

	// 	return this.httpClient.put<UpdateCompartmentContentOnlyCompartmentAndAlarmResponse>(
	// 		this.API_URL + '/compartment-content/alarm',
	// 		info,
	// 		{
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `bearer ${AUTH_TOKEN}`,
	// 			},
	// 		}
	// 	);
	// }

	// public updateCompartmentOnlyContentMedicationAndCompartment(
	// 	info: UpdateCompartmentContentOnlyCompartmentAndAlarmRequest
	// ): Observable<
	// 	UpdateCompartmentContentOnlyCompartmentAndAlarmResponse | boolean
	// > {
	// 	const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');
	// 	const USER_ID = this.cookie.get('USER_ID');

	// 	// Check if token exists
	// 	if (!AUTH_TOKEN || !USER_ID) {
	// 		return of(false);
	// 	}

	// 	return this.httpClient.put<UpdateCompartmentContentOnlyCompartmentAndAlarmResponse>(
	// 		this.API_URL + '/compartment-content/medication',
	// 		info,
	// 		{
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `bearer ${AUTH_TOKEN}`,
	// 			},
	// 		}
	// 	);
	// }

	// public deleteUser() {}
}
