export interface GetUserRequest {
	id: number;
}

export interface GetUserResponse {
	user_id: number;
	name: string;
	age: string;
	genre: string;
	need_a_caretaker: boolean;
	screen_for_elder: boolean;
	blood_type: string;
	height: string;
	weight: string;
	cpf_or_id_number: string;
	date_of_birth: string;
	phone_number: string;
	image_url: string;
}

export interface GetUserByAccountIDRequest {
	id: number;
}

export interface GetUserByAccountIDResponse {
	user_id: number;
	name: string;
	age: string;
	genre: string;
	need_a_caretaker: boolean;
	screen_for_elder: boolean;
	blood_type: string;
	height: string;
	weight: string;
	cpf_or_id_number: string;
	date_of_birth: string;
	phone_number: string;
	image_url: string;
}
