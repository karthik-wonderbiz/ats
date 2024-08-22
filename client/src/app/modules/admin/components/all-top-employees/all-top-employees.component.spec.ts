import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTopEmployeesComponent } from './all-top-employees.component';

describe('AllTopEmployeesComponent', () => {
  let component: AllTopEmployeesComponent;
  let fixture: ComponentFixture<AllTopEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllTopEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTopEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
