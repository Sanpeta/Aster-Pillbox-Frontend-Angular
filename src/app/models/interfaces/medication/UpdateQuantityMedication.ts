export interface UpdateQuantityMedicationRequest {
	id: number;
	quantity_use_pill: number;
}

export interface UpdateQuantityMedicationResponse {
	id: number;
	name: string;
	dosage: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
	description: string;
	active: boolean;
	created_at: string;
}
