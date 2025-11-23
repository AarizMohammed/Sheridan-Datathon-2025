import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoliumMap } from './folium-map';

describe('FoliumMap', () => {
  let component: FoliumMap;
  let fixture: ComponentFixture<FoliumMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoliumMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoliumMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
