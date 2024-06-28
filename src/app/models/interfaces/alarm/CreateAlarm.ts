export interface CreateAlarmRequest {
	time_alarm: string;
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
	create_at: string;
}

export interface CreateAlarmResponse {
	id: number;
	time_alarm: string;
	is_active: boolean;
	days_of_week: boolean[];
	description: string;
	create_at: string;
}