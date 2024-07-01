import { TestBed } from '@angular/core/testing';

import { HistoricMedicationService } from './historic-medication.service';

describe('HistoricMedicationService', () => {
	let service: HistoricMedicationService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HistoricMedicationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
