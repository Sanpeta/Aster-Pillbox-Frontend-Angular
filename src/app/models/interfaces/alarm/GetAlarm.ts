export interface GetAlarmRequest {
	id: number;
}

export interface GetAlarmResponse {
	id: number;
	time_alarms: string[];
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
	create_at: string;
}
