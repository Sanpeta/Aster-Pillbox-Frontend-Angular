export interface UpdateUserRequest {
	id: number;
	name?: string;
	age?: string;
	genre?: string;
	need_a_caretaker?: boolean;
	height?: string;
	weight?: string;
	date_of_birth?: string;
	cpf_or_id_number?: string;
	phone_number?: string;
	blood_type?: string;
	screen_for_elder?: boolean;
	image_url: string;
}

export interface UpdateUserResponse {
	user_id: number;
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
	image_url: string;
}
