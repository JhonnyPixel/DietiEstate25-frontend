import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAppointmentModalComponent } from './select-appointment-modal.component';

describe('SelectAppointmentModalComponent', () => {
  let component: SelectAppointmentModalComponent;
  let fixture: ComponentFixture<SelectAppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAppointmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
