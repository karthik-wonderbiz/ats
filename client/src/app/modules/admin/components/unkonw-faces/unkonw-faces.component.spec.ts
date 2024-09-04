import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnkonwFacesComponent } from './unkonw-faces.component';

describe('UnkonwFacesComponent', () => {
  let component: UnkonwFacesComponent;
  let fixture: ComponentFixture<UnkonwFacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnkonwFacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnkonwFacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
