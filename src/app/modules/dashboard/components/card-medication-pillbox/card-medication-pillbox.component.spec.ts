import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMedicationPillboxComponent } from './card-medication-pillbox.component';

describe('CardMedicationPillboxComponent', () => {
	let component: CardMedicationPillboxComponent;
	let fixture: ComponentFixture<CardMedicationPillboxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardMedicationPillboxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardMedicationPillboxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
