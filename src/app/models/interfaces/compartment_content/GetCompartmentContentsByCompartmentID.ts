export interface GetCompartmentContentsByCompartmentIDRequest {
	compartment_id: number;
}

export interface GetCompartmentContetsByCompartmentIDResponse {
	compartment_id: number;
	alarm_id: number;
	medication_id: number;
}
