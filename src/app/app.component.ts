import { MapService } from './Services/googlemaps.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';


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
  notificationdate: string = 'Fri Jan 12 2018 18:40:38';
  pic: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf6aaQJAo291z97N4QtmDBsG_WhZ9puznRWdlSLIKC5h6RtgqgeQ';

  socket = io('http://localhost:8080/',
  {reconnect: true, transports : ['websocket']});

  constructor(private mapService:MapService){
    this.mapService.getFormattedAddress(this.lat, this.lng).subscribe(
      data => {
        this.address = (<any>data).results[0].formatted_address;
      }, err => {

      }
    );    
  }

  notifications:Object[] = new Array();
  ngOnInit(){
    (<any>this.messages).push(
      {
        txt: 'fsdfd',
        isme: true,
        time: '8:30 1/11/18'
      }
    )

    this.socket.emit('cl-getinitnotif');
    this.socket.on('sv-sendinitnotif', data => {
      for(let item of data){
        this.notifications.unshift(item);
      }
      // console.log(data);
    })

    this.socket.on('sv-newnotification', data => {
      this.notifications.unshift(data);
      // console.log(data);
    });

    this.socket.on('sv-newmessagetoadmin', data => {
      (<any>this.messages).push(
        {
          txt: data.text,
          isme: false,
          time: '8:30 1/11/18'
        }
      )
    });

    this.socket.on('sv-servenotificationdetails', data => {
      //console.log(data);
      this.lat = data.map.lat;
      this.lng = data.map.long
      this.pic = data.pic;
      this.notificationdate = moment(data.timein).format('ddd MMM DD YYYY HH:mm:ss');
      this.mapService.getFormattedAddress(this.lat, this.lng).subscribe(
        data => {
          this.address = (<any>data).results[0].formatted_address;
        }, err => {
  
        }
      ); 
    
      // this.socket.emit('cl-join-room', 4324);

      
    });

  }


   messages:Object =  [] as Object; 
   @ViewChild('chatMessages') chatMessages: ElementRef
   sendNewMessage(txt: HTMLInputElement){
     let newmessage = {
          txt: txt.value,
          isme: true,
          time: '8:30 1/11/18'
        };
    (<any>this.messages).push(newmessage);
    this.socket.emit('cl-sendmessagetoemployee', newmessage);
    txt.value = '';

    this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;

    // this.socket.emit('cl-timein',{
    //   employeeid: 4324,
    //   time: 'Fri, 12 Jan 2018 03:28:36 GMT',
    //   map: { long: 121.0618299, lat: 14.5722277 },
    //   bt: 100,
    //   msg: 'Fhjwtj',
    //   b64: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf6aaQJAo291z97N4QtmDBsG_WhZ9puznRWdlSLIKC5h6RtgqgeQ'
    // });

    
   }

   viewNotification(notification){
     notification.isseen = true;
     this.socket.emit('cl-getnotificationdetails',{notificationid: notification.notificationid})
   }
}
