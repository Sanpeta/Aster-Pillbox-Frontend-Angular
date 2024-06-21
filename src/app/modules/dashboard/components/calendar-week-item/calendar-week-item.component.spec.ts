import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekItemComponent } from './calendar-week-item.component';

describe('CalendarWeekItemComponent', () => {
  let component: CalendarWeekItemComponent;
  let fixture: ComponentFixture<CalendarWeekItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarWeekItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
