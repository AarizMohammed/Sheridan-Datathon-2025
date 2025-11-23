import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ClusterList} from './cluster-list/cluster-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClusterList, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('trafficML-frontend');
}
