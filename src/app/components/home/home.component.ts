import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  title = 'app';
  lat: number =  14.6390175;
  lng: number = 121.0261686;

  address: string = 'sample address';
  zoom: number = 13;
  timeIn: number = 0;
  pic: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf6aaQJAo291z97N4QtmDBsG_WhZ9puznRWdlSLIKC5h6RtgqgeQ';

  markers: marker[] = [
    {
      lat: 14.600902,
      lng: 120.982561,
      label: 'A',
      draggable: true
    },
    {
      lat: 14.600279,
      lng: 120.992775,
      label: 'B',
      draggable: false
    },
    {
      lat: 14.602605,
      lng: 120.997195,
      label: 'C',
      draggable: true
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}


// just an interface for type safety.
interface marker {
lat: number;
lng: number;
label?: string;
draggable: boolean;
}