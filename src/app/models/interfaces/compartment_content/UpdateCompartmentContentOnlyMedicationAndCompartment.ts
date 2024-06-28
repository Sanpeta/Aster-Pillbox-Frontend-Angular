export interface UpdateCompartmentContentOnlyCompartmentAndAlarmRequest {
	medication_id: number;
	compartment_id: number;
}

export interface UpdateCompartmentContentOnlyCompartmentAndAlarmResponse {
	compartment_id: number;
	alarm_id: number;
	medication_id: number;
}
