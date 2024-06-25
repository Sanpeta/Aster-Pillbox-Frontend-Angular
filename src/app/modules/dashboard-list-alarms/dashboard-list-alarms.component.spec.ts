import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardListAlarmsComponent } from './dashboard-list-alarms.component';

describe('DashboardListAlarmsComponent', () => {
	let component: DashboardListAlarmsComponent;
	let fixture: ComponentFixture<DashboardListAlarmsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardListAlarmsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardListAlarmsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
