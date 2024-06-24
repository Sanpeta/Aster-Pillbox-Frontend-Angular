import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMedicationComponent } from './dashboard-medication.component';

describe('DashboardMedicationComponent', () => {
	let component: DashboardMedicationComponent;
	let fixture: ComponentFixture<DashboardMedicationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardMedicationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardMedicationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
