export interface CompartmentContet {
	compartment_id: number;
	alarm_id: number;
	medication_id: number;
}

export interface GetCompartmentContentsByCompartmentIDRequest {
	compartment_id: number;
}

export interface GetCompartmentContentsByCompartmentIDResponse {
	compartment_contents: CompartmentContet[];
}
