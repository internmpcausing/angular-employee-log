import { SocketService } from './../../../services/socket.service';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { ChatComponent } from './chat/chat.component';


@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit{

  constructor(private socketService:SocketService){


    let s = localStorage.getItem('selectedEmployeeId');
    if (s) this.socketService.leaveOneRoom(s);
    localStorage.removeItem('selectedEmployeeId');
  }

  firstLoad = false;
  employee;
  employeeTimeIn;
  @ViewChild(ChatComponent) chatComponent:ChatComponent
  displayNotifDetails(notifDetails){
    console.log(notifDetails);
    this.employeeTimeIn = notifDetails;
    this.employee = notifDetails.employee;
    
    this.displayGallery(notifDetails);
    
    this.firstLoad = true;
    // this.lat = notifDetails.map.lat;
    // this.lng = notifDetails.map.lng
    // this.pic = notifDetails.pic.thumb;
    // this.battery = notifDetails.batteryStatus;
    // this.timeIn = notifDetails.timeIn;
    // this.address = notifDetails.map.formattedAddress;
    
    setTimeout(() => {
      this.chatComponent.requestInitMessages(notifDetails);
    }, 1)
   
  }

  picGallery = {
    layout: 'column',
    isRowLayout: true,
    imagesCount: 0,
    opacity: 0
  }

  showSlideShow = false;
  displayGallery(employeeTimeIn){
    this.picGallery.opacity = 0;
    let firstImage = new Image();

    firstImage.onload = () => {
      this.picGallery.layout = 'column';
      this.picGallery.isRowLayout = true;

      if (firstImage.height > firstImage.width) {
        this.picGallery.layout = 'row';
        this.picGallery.isRowLayout = false;
      }
      this.picGallery.opacity = 1;
    }
    
    
    this.picGallery.imagesCount = employeeTimeIn.pics.length;
    firstImage.src = employeeTimeIn.pics[0].original;
  }

  selectedImageIndex = 0;
  onShowSlideShowClick(index){
    this.selectedImageIndex = index;
    this.showSlideShow = true;
  }

  onCloseSlideShowClick(){
    this.showSlideShow = false;
  }
  
  ngOnInit(){
    
    // console.log(Math.floor(Date.now() /1000));
    // let fds = moment.unix(Math.floor(Date.now() /1000));
    // console.log(fds);
    // this.socketService.socket.emit('cl-timeIn',{
    //   employeeId: '5a5f185480a25f2aac4abf20',
    //   timeIn: Math.floor(Date.now() /1000),
    //   pic: 'fdfsdfd',
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
