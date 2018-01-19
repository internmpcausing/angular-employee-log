
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

    

    this.chatService.displayInitMessages().subscribe(_employee => this.displayInitMessages(_employee));

    this.chatService.employeeTyping().subscribe(() => this.employeeTyping());
    // this.socketService.socket.on('sv-newMessageFromEmployee', (_newMessage) => {
    //   console.log(_newMessage);
    // })
    this.chatService.displayNewMessage().subscribe(_newMessage => this.displayNewMessage(_newMessage));
  }

  employee;
  messages = [];
  requestInitMessages(notifDetails){
    console.log(notifDetails);
    this.chatService.requestInitMessages(notifDetails.id);
  }

  displayInitMessages(_employee){
    this.messages = _employee.messages;
    this.employee = _employee;
    console.log(this.messages);
    
  }

  typing(){
    //
    this.chatService.typing({isEmployee: false});
  }

  showEmployeeIsTyping = false;

  timeOutEmployeeTyping;
  ftimeOutEmployeeTyping(){
    this.timeOutEmployeeTyping = setTimeout(() =>{
      this.showEmployeeIsTyping = false; 
    }, 1500);
  }

  employeeTyping(){
    clearTimeout(this.timeOutEmployeeTyping);
    this.showEmployeeIsTyping = true;
    this.ftimeOutEmployeeTyping();
  }

   @ViewChild('chatMessages') chatMessages: ElementRef
   sendNewMessage(txt: HTMLInputElement){
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
    
    this.messages.push(newMessage); 
    (<any>newMessage).employeeId = this.employee._id;
    console.log(this.employee);
    this.chatService.sendMessage(newMessage);
    txt.value = '';
    this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
   }

  displayNewMessage(_newMessage){
    console.log(_newMessage);
    this.showEmployeeIsTyping = false;
    if(_newMessage.employeeId == this.employee._id){
      this.messages.push(_newMessage);
    }    
  }
}




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
