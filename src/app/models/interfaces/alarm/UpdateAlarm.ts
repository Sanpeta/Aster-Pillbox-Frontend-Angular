export interface UpdateAlarmRequest {
	id: number;
	time_alarm?: string[];
	is_active?: boolean;
	days_of_week?: boolean[];
	description?: string;
}

export interface UpdateAlarmResponse {
	id: number;
	time_alarm: string[];
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
	create_at: string;
}
