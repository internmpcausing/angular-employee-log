
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from './../../../services/chat.service';
import { SocketService } from '../../../services/socket.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private chatService:ChatService, private socketService:SocketService) { }

  ngOnInit() {
    this.socketService.socket.on('sv-newMessageFromEmployee', (newMessage) => {
      this.employee.messages.push(newMessage);
  });
  }

  employee = {
    messages: [],
    id: 0,
    pic: {
      thumb: '',
      original: ''
    }
  };
  getInitMessages(notificationId){
    this.employee.messages = [];
    this.chatService.getInitMessages(notificationId).subscribe(employee => this.displayInitMessages(employee));
  }

  
  displayInitMessages(employee){
    this.employee = employee;
  }

   @ViewChild('chatMessages') chatMessages: ElementRef
   sendNewMessage(txt: HTMLInputElement){

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
     let t = txt.value.toString().trim();
     if (!t) {
      txt.value = '';
       return
      };
     let newMessage = {
        content: t,
        isMe: false,
        sentAt: Math.floor(Date.now() /1000)
      };
      
    this.employee.messages.push(newMessage);
    (<any>newMessage).employeeId = this.employee.id;
    this.socketService.socket.emit('cl-sendNewMessage', newMessage);
    //this.chatService.sendMessage(newMessage).subscribe(newMessage => this.displayNewMessage(newMessage));
    txt.value = '';
    this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
   }

   displayNewMessage(newMessage){
    console.log(newMessage);
    this.employee.messages.push(newMessage);
    
   }

}
