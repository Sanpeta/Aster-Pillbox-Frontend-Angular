export interface UpdateAccountResetPasswordRequest {
	email: string;
	token: string;
	password: string;
}

export interface UpdateAccountResetPasswordResponse {
	account_id: number;
	active: boolean;
}
