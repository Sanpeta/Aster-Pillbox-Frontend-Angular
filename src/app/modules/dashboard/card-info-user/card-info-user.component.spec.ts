import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoUserComponent } from './card-info-user.component';

describe('CardInfoUserComponent', () => {
	let component: CardInfoUserComponent;
	let fixture: ComponentFixture<CardInfoUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardInfoUserComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardInfoUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
