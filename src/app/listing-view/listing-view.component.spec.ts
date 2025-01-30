import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingViewComponent } from './listing-view.component';

describe('ListingViewComponent', () => {
  let component: ListingViewComponent;
  let fixture: ComponentFixture<ListingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
