import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPreviewSectionComponent } from './blog-preview-section.component';

describe('BlogPreviewSectionComponent', () => {
  let component: BlogPreviewSectionComponent;
  let fixture: ComponentFixture<BlogPreviewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPreviewSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPreviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
