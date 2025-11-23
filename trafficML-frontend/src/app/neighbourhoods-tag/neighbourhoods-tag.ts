import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-neighbourhoods-tag',
  imports: [],
  templateUrl: './neighbourhoods-tag.html',
  styleUrl: './neighbourhoods-tag.css',
})
export class NeighbourhoodsTag {
  @Input() name: string = '';
  @Input() number: number = 0;
}
