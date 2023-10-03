import { TestBed } from '@angular/core/testing';

import { CsrfService } from './csrf.service';

describe('CsrfService', () => {
  let service: CsrfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsrfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
