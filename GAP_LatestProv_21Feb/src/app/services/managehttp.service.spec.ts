import { TestBed } from '@angular/core/testing';

import { ManagehttpService } from './managehttp.service';

describe('ManagehttpService', () => {
  let service: ManagehttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagehttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
