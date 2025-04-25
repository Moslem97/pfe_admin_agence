import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentReviewComponent } from './admin-document-review.component';

describe('AdminDocumentReviewComponent', () => {
  let component: AdminDocumentReviewComponent;
  let fixture: ComponentFixture<AdminDocumentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocumentReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDocumentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
