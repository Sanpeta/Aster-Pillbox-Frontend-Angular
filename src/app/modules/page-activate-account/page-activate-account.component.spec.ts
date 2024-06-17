import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageActivateAccountComponent } from './page-activate-account.component';

describe('PageActivateAccountComponent', () => {
	let component: PageActivateAccountComponent;
	let fixture: ComponentFixture<PageActivateAccountComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PageActivateAccountComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PageActivateAccountComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
