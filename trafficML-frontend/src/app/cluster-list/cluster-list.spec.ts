import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterList } from './cluster-list';

describe('ClusterList', () => {
  let component: ClusterList;
  let fixture: ComponentFixture<ClusterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
