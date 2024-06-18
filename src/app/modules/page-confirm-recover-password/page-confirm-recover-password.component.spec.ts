import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConfirmRecoverPasswordComponent } from './page-confirm-recover-password.component';

describe('PageConfirmRecoverPasswordComponent', () => {
  let component: PageConfirmRecoverPasswordComponent;
  let fixture: ComponentFixture<PageConfirmRecoverPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageConfirmRecoverPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageConfirmRecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
