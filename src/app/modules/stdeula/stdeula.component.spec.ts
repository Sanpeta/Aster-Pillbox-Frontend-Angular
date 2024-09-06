import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STDEULAComponent } from './stdeula.component';

describe('STDEULAComponent', () => {
	let component: STDEULAComponent;
	let fixture: ComponentFixture<STDEULAComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [STDEULAComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(STDEULAComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
