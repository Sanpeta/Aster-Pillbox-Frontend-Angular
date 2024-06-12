import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavTitleDashboardComponent } from './sidenav-title-dashboard.component';

describe('SidenavTitleDashboardComponent', () => {
  let component: SidenavTitleDashboardComponent;
  let fixture: ComponentFixture<SidenavTitleDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavTitleDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavTitleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
