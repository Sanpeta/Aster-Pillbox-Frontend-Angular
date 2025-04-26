import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBlogComponent } from './footer-blog.component';

describe('FooterBlogComponent', () => {
  let component: FooterBlogComponent;
  let fixture: ComponentFixture<FooterBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
