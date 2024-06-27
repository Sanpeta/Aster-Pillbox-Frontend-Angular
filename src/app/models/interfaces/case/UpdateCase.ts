export interface UpdateCaseRequest {
	user_id: number;
	mac_address?: string;
	case_name?: string;
	row_size?: number;
	column_size?: number;
	status?: boolean;
}

export interface UpdateCaseResponse {
	user_id: number;
	mac_address: string;
	case_name: string;
	row_size: number;
	column_size: number;
	status: boolean;
}
