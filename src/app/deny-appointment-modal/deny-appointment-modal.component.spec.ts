import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenyAppointmentModalComponent } from './deny-appointment-modal.component';

describe('DenyAppointmentModalComponent', () => {
  let component: DenyAppointmentModalComponent;
  let fixture: ComponentFixture<DenyAppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenyAppointmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenyAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
