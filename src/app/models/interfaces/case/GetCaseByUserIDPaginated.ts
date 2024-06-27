export interface GetCaseByUserIDPaginatedRequest {
	id: number;
	page_id: number;
	page_size: number;
}

export interface GetCaseByUserIDPaginatedResponse {
	user_id: number;
	mac_address: string;
	case_name: string;
	row_size: number;
	column_size: number;
	status: boolean;
}
