export interface GetHistoricMedicationsForReportRequest {
	user_id: number;
}

export interface HistoricMedicationsForReport {
	id: number;
	name: string;
	active: boolean;
	total_pill_take: number;
	first_use: string;
	last_use: string;
}
