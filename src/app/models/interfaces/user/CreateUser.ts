export interface CreateUserRequest {
	account_id: number;
	name: string;
	age: number;
	genre: 'M' | 'F';
	is_a_caretaker: boolean;
	height: number;
	weight: number;
	date_of_birth: Date;
	cpf_or_id_number: string;
	phone_number: string;
}

export interface CreateUserResponse {
	user_id: number;
	name: string;
	age: string;
	genre: 'M' | 'F';
	is_a_caretaker: string;
	height: string;
	weight: string;
	date_of_birth: string;
	phone_number: string;
}
