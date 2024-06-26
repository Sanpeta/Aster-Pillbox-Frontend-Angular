export interface CreateUserRequest {
	account_id: number;
	name: string;
	age: string;
	genre: string;
	need_a_caretaker: boolean;
	height: string;
	weight: string;
	date_of_birth: string;
	cpf_or_id_number: string;
	phone_number: string;
	blood_type: string;
	screen_for_elder: boolean;
}

export interface CreateUserResponse {
	user_id: number;
	name: string;
	age: string;
	genre: string;
	need_a_caretaker: boolean;
	screen_for_elder: boolean;
	blood_type: string;
	height: string;
	weight: string;
	date_of_birth: string;
	phone_number: string;
}
