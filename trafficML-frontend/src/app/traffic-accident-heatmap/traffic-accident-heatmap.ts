import { Component } from '@angular/core';
import {FoliumMap} from '../folium-map/folium-map';

@Component({
  selector: 'app-traffic-accident-heatmap',
  imports: [
    FoliumMap
  ],
  templateUrl: './traffic-accident-heatmap.html',
  styleUrl: './traffic-accident-heatmap.css',
})
export class TrafficAccidentHeatmap {

}
