import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarredListingsComponent } from './starred-listings.component';

describe('StarredListingsComponent', () => {
  let component: StarredListingsComponent;
  let fixture: ComponentFixture<StarredListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarredListingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarredListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
