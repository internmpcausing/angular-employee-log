import { MapService } from './Services/googlemaps.service';
import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'app';
  lat: number = 37.4224764;
  lng: number = -122.0842499;
  address: string;
  zoom: number = 11;

  constructor(private mapService:MapService){
    this.mapService.getFormattedAddress(this.lat, this.lng).subscribe(
      data => {
        //console.log((<any>data).results[0].formatted_address);
        this.address = (<any>data).results[0].formatted_address;
      }, err => {

      }
    );
  }
}
