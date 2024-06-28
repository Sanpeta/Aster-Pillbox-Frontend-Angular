export interface GetCompartmentRequest {
	id: number;
}

export interface GetCompartmentResponse {
	id: number;
	case_id: number;
	index_compartment: number;
	description: string;
}
