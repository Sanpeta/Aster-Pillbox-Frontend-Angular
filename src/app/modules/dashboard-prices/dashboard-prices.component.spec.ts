import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPricesComponent } from './dashboard-prices.component';

describe('DashboardPricesComponent', () => {
  let component: DashboardPricesComponent;
  let fixture: ComponentFixture<DashboardPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPricesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
