import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownProfilesComponent } from './unknown-profiles.component';

describe('UnknownProfilesComponent', () => {
  let component: UnknownProfilesComponent;
  let fixture: ComponentFixture<UnknownProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnknownProfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnknownProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
