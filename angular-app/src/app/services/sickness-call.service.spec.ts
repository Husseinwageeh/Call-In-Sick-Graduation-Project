import { TestBed } from '@angular/core/testing';

import { SicknessCallService } from './sickness-call.service';

describe('SicknessCallService', () => {
  let service: SicknessCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SicknessCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
