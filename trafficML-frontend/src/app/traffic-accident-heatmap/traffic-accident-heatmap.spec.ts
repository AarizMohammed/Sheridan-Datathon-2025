import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficAccidentHeatmap } from './traffic-accident-heatmap';

describe('TrafficAccidentHeatmap', () => {
  let component: TrafficAccidentHeatmap;
  let fixture: ComponentFixture<TrafficAccidentHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficAccidentHeatmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficAccidentHeatmap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
