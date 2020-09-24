import { TestBed } from '@angular/core/testing';

import { EditDocService } from './edit-doc.service';

describe('EditDocService', () => {
  let service: EditDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
