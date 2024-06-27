export interface CreateCaseRequest {
	user_id: number;
	mac_address?: string;
	case_name: string;
	row_size: number;
	column_size: number;
	status: boolean;
}

export interface CreateCaseResponse {
	user_id: number;
	mac_address: string;
	case_name: string;
	row_size: number;
	column_size: number;
	status: boolean;
}
