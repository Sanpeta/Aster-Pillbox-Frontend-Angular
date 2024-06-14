export interface UpdateAccountRequest {
	id: number;
	email: string;
	password: string;
	active: boolean;
	password_changed_at: Date;
	last_login: string;
}

export interface UpdateAccountResponse {
	id: number;
	email: string;
	active: boolean;
	password_changed_at: Date;
}
