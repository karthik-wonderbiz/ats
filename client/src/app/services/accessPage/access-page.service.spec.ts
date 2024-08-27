import { TestBed } from '@angular/core/testing';

import { AccessPageService } from './access-page.service';

describe('AccessPageService', () => {
  let service: AccessPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
