import { GetCompartmentResponse } from './GetCompartment';
export interface GetCompartmentsByCaseIDRequest {
	case_id: number;
}

export interface GetCompartmentsByCaseIDResponse {
	compartments: GetCompartmentResponse[];
}
