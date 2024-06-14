export interface LoginAccountRequest {
	email: string;
	password: string;
}

export interface LoginAccountResponse {
	access_token: string;
	account: Account;
}

interface Account {
	id: number;
	email: string;
	active: boolean;
}
