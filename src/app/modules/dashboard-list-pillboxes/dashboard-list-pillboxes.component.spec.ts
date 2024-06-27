import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardListPillboxesComponent } from './dashboard-list-pillboxes.component';

describe('DashboardListPillboxsComponent', () => {
	let component: DashboardListPillboxesComponent;
	let fixture: ComponentFixture<DashboardListPillboxesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardListPillboxesComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardListPillboxesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
