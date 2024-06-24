import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUpdateMedicationComponent } from './dashboard-update-medication.component';

describe('DashboardUpdateMedicationComponent', () => {
  let component: DashboardUpdateMedicationComponent;
  let fixture: ComponentFixture<DashboardUpdateMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUpdateMedicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUpdateMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
