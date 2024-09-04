import { TestBed } from '@angular/core/testing';

import { FacesService } from './faces.service';

describe('FacesService', () => {
  let service: FacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
