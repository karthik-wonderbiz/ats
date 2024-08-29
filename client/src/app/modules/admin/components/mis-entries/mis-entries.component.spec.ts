import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEntriesComponent } from './mis-entries.component';

describe('MisEntriesComponent', () => {
  let component: MisEntriesComponent;
  let fixture: ComponentFixture<MisEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
