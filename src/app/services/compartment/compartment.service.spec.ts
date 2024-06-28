import { TestBed } from '@angular/core/testing';

import { CompartmentService } from './compartment.service';

describe('CompartmentService', () => {
	let service: CompartmentService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CompartmentService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
