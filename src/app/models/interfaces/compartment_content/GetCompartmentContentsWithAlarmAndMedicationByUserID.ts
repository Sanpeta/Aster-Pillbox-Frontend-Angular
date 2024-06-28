interface CompartmentContentsWithAlarmAndMedicationByUserID {
	compartment_id: number;
	alarm_id: number;
	medication_id: number;
	time_alarm: string;
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
	name: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
	case_id: number;
	user_id: number;
}

export interface GetCompartmentContentsWithAlarmAndMedicationByUserIDRequest {
	compartment_id: number;
}

export interface GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse {
	compartment_contents_with_alarm_and_medication_by_user_id: CompartmentContentsWithAlarmAndMedicationByUserID[];
}
