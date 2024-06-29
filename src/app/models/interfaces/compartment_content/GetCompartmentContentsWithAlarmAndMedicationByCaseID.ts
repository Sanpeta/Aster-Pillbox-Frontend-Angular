export interface GetCompartmentContentsWithAlarmAndMedicationByCaseIDRequest {
	case_id: number;
}

export interface GetCompartmentContentsWithAlarmAndMedicationByCaseIDResponse {
	compartment_id: number;
	alarm_id: number;
	medication_id: number;
	time_alarms: string[];
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
	index_compartment: number;
	name: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
	case_id: number;
}
