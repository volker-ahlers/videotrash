import { TestBed } from '@angular/core/testing';

import { MessagesDummiService } from './messagesDummi.service';

describe('MessagesDummiService', () => {
  let service: MessagesDummiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesDummiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
