import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEmployeesComponent } from './top-employees.component';

describe('TopEmployeesComponent', () => {
  let component: TopEmployeesComponent;
  let fixture: ComponentFixture<TopEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
