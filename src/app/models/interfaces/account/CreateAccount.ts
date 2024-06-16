export interface AccountRequest {
	email: string;
	password: string;
	terms_and_conditions: string;
}

export interface AccountResponse {
	id: Number;
	email: string;
	active: boolean;
	terms_and_conditions: boolean;
}
