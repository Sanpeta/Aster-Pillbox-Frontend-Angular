export interface CreateCompartmentRequest {
	case_id: number;
	index_compartment: number;
	description: string;
}

export interface CreateCompartmentResponse {
	id: number;
	case_id: number;
	index_compartment: number;
	description: string;
}
