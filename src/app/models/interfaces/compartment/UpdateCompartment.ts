export interface UpdateCompartmentRequest {
	id: number;
	case_id: number;
	index_compartment: number;
	description: string;
}

export interface UpdateCompartmentResponse {
	id: number;
	case_id: number;
	index_compartment: number;
	description: string;
}
