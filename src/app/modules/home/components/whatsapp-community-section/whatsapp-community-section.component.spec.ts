import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappCommunitySectionComponent } from './whatsapp-community-section.component';

describe('WhatsappCommunitySectionComponent', () => {
  let component: WhatsappCommunitySectionComponent;
  let fixture: ComponentFixture<WhatsappCommunitySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappCommunitySectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappCommunitySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
