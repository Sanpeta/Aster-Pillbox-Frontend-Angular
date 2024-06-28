import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	CreateCompartmentRequest,
	CreateCompartmentResponse,
} from '../../models/interfaces/compartment/CreateCompartment';
import { GetCompartmentResponse } from '../../models/interfaces/compartment/GetCompartment';
import {
	UpdateCompartmentRequest,
	UpdateCompartmentResponse,
} from '../../models/interfaces/compartment/UpdateCompartment';

@Injectable({
	providedIn: 'root',
})
export class CompartmentService {
	private API_URL = environment.API_URL;

	constructor(
		private httpClient: HttpClient,
		private cookie: CookieService,
		private router: Router
	) {}

	public createCompartment(
		compartment: CreateCompartmentRequest
	): Observable<CreateCompartmentResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		// Check if token exists
		if (!AUTH_TOKEN) {
			return of(false);
		}
		return this.httpClient.post<CreateCompartmentResponse>(
			this.API_URL + '/compartment',
			compartment,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getCompartment(id: number): Observable<GetCompartmentResponse> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		return this.httpClient.get<GetCompartmentResponse>(
			this.API_URL + '/compartment/' + id,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public getCompartmentsByCaseID(
		id: number
	): Observable<GetCompartmentResponse[]> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		return this.httpClient.get<GetCompartmentResponse[]>(
			this.API_URL + '/compartments/' + id,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `bearer ${AUTH_TOKEN}`,
				},
			}
		);
	}

	public updateCompartment(
		compartment: UpdateCompartmentRequest
	): Observable<UpdateCompartmentResponse | boolean> {
		const AUTH_TOKEN = this.cookie.get('AUTH_TOKEN');

		// Check if token exists
		if (!AUTH_TOKEN) {
			return of(false);
		}

		return this.httpClient.put<UpdateCompartmentResponse>(
			this.API_URL + '/compartment',
			compartment,
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
