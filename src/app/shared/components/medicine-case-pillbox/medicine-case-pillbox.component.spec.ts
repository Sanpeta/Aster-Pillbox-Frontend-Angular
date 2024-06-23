import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineCasePillboxComponent } from './medicine-case-pillbox.component';

describe('MedicineCasePillboxComponent', () => {
	let component: MedicineCasePillboxComponent;
	let fixture: ComponentFixture<MedicineCasePillboxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MedicineCasePillboxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MedicineCasePillboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
