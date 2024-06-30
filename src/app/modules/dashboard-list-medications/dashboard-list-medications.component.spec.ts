import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardListMedicationsComponent } from './dashboard-list-medications.component';

describe('DashboardListMedicationsComponent', () => {
	let component: DashboardListMedicationsComponent;
	let fixture: ComponentFixture<DashboardListMedicationsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardListMedicationsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardListMedicationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
