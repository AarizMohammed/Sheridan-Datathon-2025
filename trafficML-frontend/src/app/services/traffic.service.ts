import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ClusterModel} from '../models/cluster-model';

@Injectable({
  providedIn: 'root'
})
export class TrafficService {
  private apiUrl = 'http://10.80.177.191:8000/MIPA';

  constructor(private http: HttpClient) { }

  getClusters(): Observable<ClusterModel[]> {
    return this.http.get<ClusterModel[]>(this.apiUrl);
  }
}
