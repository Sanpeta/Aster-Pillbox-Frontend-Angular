export interface GetCasesByUserIDPaginatedRequest {
	id: number;
	page_id: number;
	page_size: number;
}

export interface GetCasesByUserIDPaginatedResponse {
	user_id: number;
	mac_address: string;
	case_name: string;
	row_size: number;
	column_size: number;
	status: boolean;
}
