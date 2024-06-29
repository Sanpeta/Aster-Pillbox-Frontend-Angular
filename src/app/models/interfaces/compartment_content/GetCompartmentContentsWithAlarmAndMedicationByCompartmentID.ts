export interface GetCompartmentContentsWithAlarmAndMedicationByCompartmentIDRequest {
	compartment_id: number;
}

export interface GetCompartmentContentsWithAlarmAndMedicationByCompartmentIDResponse {
	compartment_id: number;
	alarm_id: number;
	medication_id: number;
	time_alarms: string[];
	is_active: boolean;
	days_of_week: boolean[];
	index_compartment: number;
	description: string;
	name: string;
	quantity_use_pill: number;
	quantity_total_pill: number;
}
