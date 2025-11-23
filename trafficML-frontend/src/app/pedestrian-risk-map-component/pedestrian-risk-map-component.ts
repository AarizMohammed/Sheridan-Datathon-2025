import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet.heat';

@Component({
  selector: 'app-pedestrian-risk-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedestrian-risk-map-component.html',
  styleUrls: ['./pedestrian-risk-map-component.css'],
})
export class PedestrianRiskMapComponent implements AfterViewInit {
  lat: number = 43.67878;
  lon: number = -79.4000;

  map!: L.Map;
  redHeatPoint!: any;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    // Create map
    this.map = L.map('map', {
      center: [43.7, -79.4],
      zoom: 12,
    });

    // Base tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Base heatmap data
    const heatData = [
      [43.655219, -79.395866, 7145],
      [43.678611, -79.346129, 317],
      [43.689342, -79.299286, 164],
    ];

    // @ts-ignore (Leaflet-heat plugin)
    L.heatLayer(heatData, {
      minOpacity: 0.25,
      radius: 8,
      blur: 12,
      maxZoom: 18,
    }).addTo(this.map);

    // Red heatpoint
    // @ts-ignore
    this.redHeatPoint = L.heatLayer(
      [[this.lat, this.lon, 200]],
      {
        minOpacity: 0.9,
        radius: 15,
        blur: 20,
        maxZoom: 18,
        gradient: { 0.4: 'red', 1.0: 'darkred' },
      }
    ).addTo(this.map);

    this.updateRedHeat();
  }

  updateRedHeat() {
    if (!this.redHeatPoint) return;

    // @ts-ignore
    this.redHeatPoint.setLatLngs([[this.lat, this.lon, 200]]);
    this.map.setView([this.lat, this.lon], 15);
  }

  async predictRisk() {
    this.updateRedHeat();

    const body = { lat: this.lat, lon: this.lon };

    const resultDiv = document.getElementById('result');
    resultDiv!.innerHTML = 'Loading...';

    try {
      const response = await fetch('http://10.80.177.191:8000/PIGC', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Server error ' + response.status);
      const data = await response.json();

      resultDiv!.innerHTML = `
        <h5>Predicted Risk: ${data.risk_level}</h5>
        <h6>Nearest Hotspot Info:</h6>
        <pre>${JSON.stringify(data.nearest_hotspot_info, null, 2)}</pre>
      `;
    } catch (err: any) {
      resultDiv!.innerHTML = `<span style="color:red;">Error: ${err.message}</span>`;
    }
  }
}
