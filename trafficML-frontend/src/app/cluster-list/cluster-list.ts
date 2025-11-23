import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TrafficService} from '../services/traffic.service';
import { inject } from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ClusterModel} from '../models/cluster-model';
import {NeighbourhoodsTag} from '../neighbourhoods-tag/neighbourhoods-tag';

@Component({
  selector: 'app-cluster-list',
  standalone: true,
  imports: [
    NeighbourhoodsTag
  ],
  templateUrl: './cluster-list.html',
  styleUrl: './cluster-list.css',
})
export class ClusterList {
  private trafficService = inject(TrafficService);

  clusters = toSignal(this.trafficService.getClusters(), {
    initialValue: []
  });
  parseName(str: string): string {
    return str.replace(/\(\d+\)/, '').trim();
  }

  parseNumber(str: string): number {
    const match = str.match(/\((\d+)\)/);
    return match ? Number(match[1]) : 0;
  }
}
