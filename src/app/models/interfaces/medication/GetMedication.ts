export interface GetMedicationRequest {
	id: number;
}

export interface GetMedicationResponse {
	id: number;
	name: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
	description: string;
	active: boolean;
	created_at: string;
}
