export interface AccountRequest {
	email: string;
	password: string;
}

export interface AccountResponse {
	id: Number;
	email: string;
	active: boolean;
}
