import { TestBed } from '@angular/core/testing';

import { PLCconnectService } from './plcconnect.service';

describe('PLCconnectService', () => {
  let service: PLCconnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PLCconnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
