import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardListPatientsComponent } from './dashboard-list-patients.component';

describe('DashboardListPatientsComponent', () => {
	let component: DashboardListPatientsComponent;
	let fixture: ComponentFixture<DashboardListPatientsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardListPatientsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardListPatientsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
