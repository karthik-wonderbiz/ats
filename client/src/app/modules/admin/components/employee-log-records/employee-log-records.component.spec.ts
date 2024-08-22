import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLogRecordsComponent } from './employee-log-records.component';

describe('EmployeeLogRecordsComponent', () => {
  let component: EmployeeLogRecordsComponent;
  let fixture: ComponentFixture<EmployeeLogRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeLogRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLogRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
