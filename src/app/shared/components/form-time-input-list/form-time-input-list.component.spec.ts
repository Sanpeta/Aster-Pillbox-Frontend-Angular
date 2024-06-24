import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTimeInputListComponent } from './form-time-input-list.component';

describe('FormTimeInputListComponent', () => {
	let component: FormTimeInputListComponent;
	let fixture: ComponentFixture<FormTimeInputListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormTimeInputListComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FormTimeInputListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
