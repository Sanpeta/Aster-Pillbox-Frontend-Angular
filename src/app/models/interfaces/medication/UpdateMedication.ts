export interface UpdateMedicationRequest {
	id: number;
	user_id?: number;
	name?: string;
	dosage?: string;
	quantity_use_pill?: number;
	quantity_total_pill?: number;
	description?: string;
	active?: boolean;
}

export interface UpdateMedicationResponse {
	id: number;
	name: string;
	dosage: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
	description: string;
	active: boolean;
	created_at: string;
}
