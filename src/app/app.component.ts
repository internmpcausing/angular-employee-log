import { NavLinks } from './services/navlinks.service';



import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { SocketService } from './services/socket.service';
import { ChatComponent } from './components/logs/chat/chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  lat: number = 51.678418;
  lng: number = 7.809007;
  address: string = 'sample address';
  zoom: number = 17;
  timeIn: number = 0;
  pic: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf6aaQJAo291z97N4QtmDBsG_WhZ9puznRWdlSLIKC5h6RtgqgeQ';


  constructor(private socketService:SocketService,
            private navLinks:NavLinks){
    this.socketService.connect();
  }

  @ViewChild(ChatComponent) chatComponent:ChatComponent
  displayNotifDetails(notifDetails){
    this.lat = notifDetails.map.lat;
    this.lng = notifDetails.map.lng
    this.pic = notifDetails.pic.thumb;
    
    this.timeIn = notifDetails.timeIn;
    this.address = notifDetails.map.formattedAddress;
    this.chatComponent.requestInitMessages(notifDetails.id);
  }
  
  


  ngOnInit(){
    // console.log(Math.floor(Date.now() /1000));
    // let fds = moment.unix(Math.floor(Date.now() /1000));
    // console.log(fds);
    // this.socketService.socket.emit('cl-timeIn',{
    //   employeeId: '5a61960599a85149c7682c99',
    //   timeIn: Math.floor(Date.now() /1000),
    //   pic: 'https://media.istockphoto.com/photos/love-selfie-picture-id533647449?k=6&m=533647449&s=612x612&w=0&h=81v4NJXuBksOp2CZS_DxX1hQ2M6J-4ibK9Cujwj3fnc=',
    //   map: {
    //     lng: -122.0842499,
    //     lat: 37.4224764,
    //     formattedAddress: 'dsasdsad'
    //   },
    //   batteryStatus: 65
    // });

      
  


    // (<any>this.messages).push(
    //   {
    //     txt: 'fsdfd',
    //     isme: true,
    //     time: '8:30 1/11/18'
    //   }
    // )

    // this.socket.emit('cl-getinitnotif');
    // this.socket.on('sv-sendinitnotif', data => {
    //   for(let item of data){
    //     this.notifications.unshift(item);
    //   }
    //   // console.log(data);
    // })

    // this.socket.on('sv-newnotification', data => {
    //   this.notifications.unshift(data);
    //   // console.log(data);
    // });

    // this.socket.on('sv-newmessagetoadmin', data => {
    //   (<any>this.messages).push(
    //     {
    //       txt: data.text,
    //       isme: false,
    //       time: '8:30 1/11/18'
    //     }
    //   )
    // });

    // this.socket.on('sv-servenotificationdetails', data => {
    //   //console.log(data);
    //   this.lat = data.map.lat;
    //   this.lng = data.map.long
    //   this.pic = data.pic;
    //   this.notificationdate = moment(data.timein).format('ddd MMM DD YYYY HH:mm:ss');
    //   this.address = data.map.formattedaddress;

      

      
    // });

    // this.socket.emit('cl-getinitlog', {employeeid: 4324});

    // // this.socket.emit('cl-timein',{
    // //   employeeid: 4324,
    // //   time: 'Fri, 12 Jan 2018 03:28:36 GMT',
    // //   map: { long: 121.0618299, lat: 14.5722277 },
    // //   bt: 100,
    // //   msg: 'Fhjwtj',
    // //   b64: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf6aaQJAo291z97N4QtmDBsG_WhZ9puznRWdlSLIKC5h6RtgqgeQ'
    // // });

  }


   

   

}
