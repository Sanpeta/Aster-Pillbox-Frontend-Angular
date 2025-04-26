import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhastappButtonBlogComponent } from './whastapp-button-blog.component';

describe('WhastappButtonBlogComponent', () => {
  let component: WhastappButtonBlogComponent;
  let fixture: ComponentFixture<WhastappButtonBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhastappButtonBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhastappButtonBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
