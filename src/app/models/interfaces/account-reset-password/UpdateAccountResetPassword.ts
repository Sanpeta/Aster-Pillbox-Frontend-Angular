export interface UpdateAccountResetPasswordRequest {
	account_id: number;
	token: string;
	password: string;
}

export interface UpdateAccountResetPasswordResponse {
	account_id: number;
	active: boolean;
}
