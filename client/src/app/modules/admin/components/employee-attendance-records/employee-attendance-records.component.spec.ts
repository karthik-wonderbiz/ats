import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceRecordsComponent } from './employee-attendance-records.component';

describe('EmployeeAttendanceRecordsComponent', () => {
  let component: EmployeeAttendanceRecordsComponent;
  let fixture: ComponentFixture<EmployeeAttendanceRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeAttendanceRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAttendanceRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
