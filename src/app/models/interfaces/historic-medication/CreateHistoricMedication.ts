export interface CreateHistoricMedicationRequest {
	user_id: number;
	medication_id: number;
	quantity_pill_take: number;
	time_of_medication_take: string;
	original_time_of_medication_take: string;
}

export interface CreateHistoricMedicationResponse {
	id: number;
	user_id: number;
	medication_id: number;
	quantity_pill_take: number;
	time_of_medication_take: string;
	original_time_of_medication_take: string;
}
