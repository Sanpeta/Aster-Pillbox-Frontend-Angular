export interface GetCaseByUserIDRequest {
	id: number;
}

export interface GetCaseByUserIDResponse {
	user_id: number;
	mac_address: string;
	case_name: string;
	row_size: number;
	col_size: number;
	status: boolean;
}
