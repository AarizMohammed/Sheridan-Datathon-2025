import { Routes } from '@angular/router';
import {ClusterList} from './cluster-list/cluster-list';
import {TrafficAccidentHeatmap} from './traffic-accident-heatmap/traffic-accident-heatmap';
import {PedestrianRiskMapComponent} from './pedestrian-risk-map-component/pedestrian-risk-map-component';

export const routes: Routes = [
  {path: '', component: ClusterList},
  {path: 'heatmap', component: TrafficAccidentHeatmap},
  {path: 'pedestrian', component: PedestrianRiskMapComponent}
];
