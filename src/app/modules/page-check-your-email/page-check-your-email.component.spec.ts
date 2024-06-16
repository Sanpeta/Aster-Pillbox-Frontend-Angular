import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCheckYourEmailComponent } from './page-check-your-email.component';

describe('PageCheckYourEmailComponent', () => {
	let component: PageCheckYourEmailComponent;
	let fixture: ComponentFixture<PageCheckYourEmailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PageCheckYourEmailComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PageCheckYourEmailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
