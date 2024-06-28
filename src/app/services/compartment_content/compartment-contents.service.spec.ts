import { TestBed } from '@angular/core/testing';

import { CompartmentContentsService } from './compartment-contents.service';

describe('CompartmentContentsService', () => {
	let service: CompartmentContentsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CompartmentContentsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
