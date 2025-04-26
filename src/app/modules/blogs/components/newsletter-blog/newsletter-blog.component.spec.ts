import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterBlogComponent } from './newsletter-blog.component';

describe('NewsletterBlogComponent', () => {
  let component: NewsletterBlogComponent;
  let fixture: ComponentFixture<NewsletterBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
