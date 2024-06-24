import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekDaysSelectorComponent } from './week-days-selector.component';

describe('WeekDaysSelectorComponent', () => {
	let component: WeekDaysSelectorComponent;
	let fixture: ComponentFixture<WeekDaysSelectorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WeekDaysSelectorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WeekDaysSelectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
