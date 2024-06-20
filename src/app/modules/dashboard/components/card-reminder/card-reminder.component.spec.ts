import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReminderComponent } from './card-reminder.component';

describe('CardReminderComponent', () => {
	let component: CardReminderComponent;
	let fixture: ComponentFixture<CardReminderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardReminderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardReminderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
