export interface GetUserRequest {
	id: number;
}

export interface GetUserResponse {
	id: number;
	name: string;
	age: string;
	genre: 'M' | 'F';
	is_a_caretaker: boolean;
	phone_number: string;
}

export interface GetUserByAccountIDRequest {
	id: number;
}

export interface GetUserByAccountIDResponse {
	user_id: number;
	email: string;
	name: string;
	age: string;
	genre: 'M' | 'F';
	is_a_caretaker: boolean;
	height: number;
	weight: number;
	date_of_birth: string;
	cpf_or_id_number: string;
	phone_number: string;
}
