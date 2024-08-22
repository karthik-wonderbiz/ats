import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStatusDetailsComponent } from './employee-status-details.component';

describe('EmployeeStatusDetailsComponent', () => {
  let component: EmployeeStatusDetailsComponent;
  let fixture: ComponentFixture<EmployeeStatusDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeStatusDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeStatusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
