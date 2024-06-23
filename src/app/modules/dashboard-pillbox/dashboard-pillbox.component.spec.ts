import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPillboxComponent } from './dashboard-pillbox.component';

describe('DashboardPillboxComponent', () => {
	let component: DashboardPillboxComponent;
	let fixture: ComponentFixture<DashboardPillboxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardPillboxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardPillboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
