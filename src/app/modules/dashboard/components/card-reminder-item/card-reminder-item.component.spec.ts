import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReminderItemComponent } from './card-reminder-item.component';

describe('CardReminderItemComponent', () => {
	let component: CardReminderItemComponent;
	let fixture: ComponentFixture<CardReminderItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardReminderItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardReminderItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
