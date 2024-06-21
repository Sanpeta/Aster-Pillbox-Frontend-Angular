import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMedicationsComponent } from './card-medications.component';

describe('CardMedicationsComponent', () => {
	let component: CardMedicationsComponent;
	let fixture: ComponentFixture<CardMedicationsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardMedicationsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardMedicationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
