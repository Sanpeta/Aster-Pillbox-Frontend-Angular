export interface CreateAlarmRequest {
	time_alarms: string[];
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
}

export interface CreateAlarmResponse {
	id: number;
	time_alarms: string[];
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
	create_at: string;
}
