import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEntriesListComponent } from './mis-entries-list.component';

describe('MisEntriesListComponent', () => {
  let component: MisEntriesListComponent;
  let fixture: ComponentFixture<MisEntriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisEntriesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
