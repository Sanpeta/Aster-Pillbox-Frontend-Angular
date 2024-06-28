export interface CreateMedicationRequest {
	user_id: number;
	name: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
	description: string;
	active: boolean;
}

export interface CreateMedicationResponse {
	id: number;
	name: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
	description: string;
	active: boolean;
	created_at: string;
}
