import { TestBed } from '@angular/core/testing';

import { MlopsService } from './mlops.service';

describe('MlopsService', () => {
  let service: MlopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MlopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
