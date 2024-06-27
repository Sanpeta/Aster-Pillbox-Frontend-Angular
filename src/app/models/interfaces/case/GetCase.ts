export interface GetCaseRequest {
	id: number;
}

export interface GetCaseResponse {
	id: number;
	user_id: number;
	mac_address: string;
	case_name: string;
	row_size: number;
	column_size: number;
	status: boolean;
}
