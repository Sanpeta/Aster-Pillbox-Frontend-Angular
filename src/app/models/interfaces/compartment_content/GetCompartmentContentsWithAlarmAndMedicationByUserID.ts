export interface GetCompartmentContentsWithAlarmAndMedicationByUserIDRequest {
	user_id: number;
}

export interface GetCompartmentContentsWithAlarmAndMedicationByUserIDResponse {
	alarm_id: number;
	case_id: number;
	compartment_id: number;
	medication_id: number;
	user_id: number;
	days_of_week: boolean[];
	time_alarms: string[];
	description: string;
	name: string;
	is_active: boolean;
	index_compartment: number;
	quantity_use_pill: number;
	quantity_total_pill: number;
}
