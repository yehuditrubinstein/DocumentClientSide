import { TestBed } from '@angular/core/testing';

import { NewDocumentService } from './new-document.service';

describe('NewDocumentService', () => {
  let service: NewDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
