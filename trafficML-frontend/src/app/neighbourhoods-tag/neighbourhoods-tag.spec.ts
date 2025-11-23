import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighbourhoodsTag } from './neighbourhoods-tag';

describe('NeighbourhoodsTag', () => {
  let component: NeighbourhoodsTag;
  let fixture: ComponentFixture<NeighbourhoodsTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeighbourhoodsTag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeighbourhoodsTag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
