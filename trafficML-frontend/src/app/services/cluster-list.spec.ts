import { TestBed } from '@angular/core/testing';

import { ClusterList } from './cluster-list';

describe('ClusterList', () => {
  let service: ClusterList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClusterList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
