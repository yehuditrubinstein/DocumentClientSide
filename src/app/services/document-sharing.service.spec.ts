import { TestBed } from '@angular/core/testing';

import { DocumentSharingService } from './document-sharing.service';

describe('DocumentSharingService', () => {
  let service: DocumentSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
