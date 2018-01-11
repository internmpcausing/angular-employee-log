import { MapService } from './Services/googlemaps.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  pic: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf6aaQJAo291z97N4QtmDBsG_WhZ9puznRWdlSLIKC5h6RtgqgeQ';

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
    (<any>this.messages).push(
      {
        txt: 'fsdfd',
        isme: true,
        time: '8:30 1/11/18'
      }
    )
    console.log(this.messages);
    this.socket.on('initRate', (data) => {
      console.log(data);
      this.socket.emit('signalz', 'received');
    });
    console.log('fgsdf');

    this.socket.emit('get-init-notif');

    this.socket.on('send-init-notif', data => {
      console.log(data);
    })

    this.socket.on('sv-get-pic', data => {
      console.log(data);
      this.pic = data;
    })

    

   }

   messages:Object =  [] as Object;
   @ViewChild('chatMessages') chatMessages: ElementRef
   sendNewMessage(txt: HTMLInputElement){
    (<any>this.messages).push(
      {
        txt: txt.value,
        isme: false,
        time: '8:30 1/11/18'
      }
    )
    txt.value = '';

    this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
   }
}
