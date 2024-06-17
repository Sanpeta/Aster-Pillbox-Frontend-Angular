export interface UpdateAccountActivationRequest {
	account_id: number;
	token: string;
}

export interface UpdateAccountActivationResponse {
	account_id: number;
	active: boolean;
}
