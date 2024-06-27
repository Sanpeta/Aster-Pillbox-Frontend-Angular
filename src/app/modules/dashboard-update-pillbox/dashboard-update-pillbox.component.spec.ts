import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUpdatePillboxComponent } from './dashboard-update-pillbox.component';

describe('DashboardUpdatePillboxComponent', () => {
	let component: DashboardUpdatePillboxComponent;
	let fixture: ComponentFixture<DashboardUpdatePillboxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardUpdatePillboxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardUpdatePillboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
