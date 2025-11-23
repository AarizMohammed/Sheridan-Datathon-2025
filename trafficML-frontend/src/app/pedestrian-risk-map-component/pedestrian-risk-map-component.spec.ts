import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedestrianRiskMapComponent } from './pedestrian-risk-map-component';

describe('PedestrianRiskMapComponent', () => {
  let component: PedestrianRiskMapComponent;
  let fixture: ComponentFixture<PedestrianRiskMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedestrianRiskMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedestrianRiskMapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
