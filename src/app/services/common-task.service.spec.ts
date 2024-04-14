import { TestBed } from '@angular/core/testing';

import { CommonTaskService } from './common-task.service';

describe('CommonTaskService', () => {
  let service: CommonTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
