export interface UpdateAccountActivationRequest {
	email: string;
	token: string;
}

export interface UpdateAccountActivationResponse {
	email: string;
	active: boolean;
}
