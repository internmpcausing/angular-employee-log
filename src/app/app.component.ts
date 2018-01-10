import { MapService } from './Services/googlemaps.service';
import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  lat: number = 37.4224764;
  lng: number = -122.0842499;
  address: string;
  zoom: number = 11;

  socket = io('http://localhost:8080/',
  {reconnect: true, transports : ['websocket']});

  constructor(private mapService:MapService){
    this.mapService.getFormattedAddress(this.lat, this.lng).subscribe(
      data => {
        //console.log((<any>data).results[0].formatted_address);
        this.address = (<any>data).results[0].formatted_address;
      }, err => {

      }
    );    
  }
   ngOnInit(){
    this.socket.on('initRate', (data) => {
      console.log(data);
      this.socket.emit('signalz', 'received');
    });
    console.log('fgsdf');
    this.socket.emit('get-init-data', 'fdsf');

    this.socket.on('send-init-rate', data => {
      console.log(data);
    })
   }
}
