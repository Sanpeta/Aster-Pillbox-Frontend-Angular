import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarDashboardComponent } from './toolbar-dashboard.component';

describe('ToolbarDashboardComponent', () => {
	let component: ToolbarDashboardComponent;
	let fixture: ComponentFixture<ToolbarDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ToolbarDashboardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ToolbarDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
