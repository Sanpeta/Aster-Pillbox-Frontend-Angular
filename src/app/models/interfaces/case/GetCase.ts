export interface GetCaseRequest {
	id: number;
}

export interface GetCaseResponse {
	user_id: number;
	mac_address: string;
	case_name: string;
	row_size: number;
	column_size: number;
	status: boolean;
}
