import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folium-map',
  imports: [],
  templateUrl: './folium-map.html',
  styleUrl: './folium-map.css',
})
export class FoliumMap implements OnInit, OnDestroy {

  iframeUrl: any;
  lastCoord: any = null;
  messageListener: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.reloadMap();

    this.messageListener = (event: MessageEvent) => {
      if (event.data?.lat && event.data?.lng) {
        this.lastCoord = event.data;
        console.log("Picked coordinate:", this.lastCoord);
      }
    };

    window.addEventListener("message", this.messageListener);
  }

  ngOnDestroy(): void {
    if (this.messageListener) {
      window.removeEventListener("message", this.messageListener);
    }
  }

  reloadMap() {
    const url = `http://localhost:8000/heatmap?nocache=${Date.now()}`;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log("Map reloaded:", url);
  }
}
