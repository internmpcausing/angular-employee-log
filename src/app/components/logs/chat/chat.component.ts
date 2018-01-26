

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from './../../../services/chat.service';
import { SocketService } from '../../../services/socket.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private chatService:ChatService, private socket:SocketService) {
   }

  
  employee: Observable<any>;
  ngOnInit() {
    this.employee = this.chatService.employee;
  }

  requestInitMessages(notifDetails){
    this.chatService.loadInitMessages(notifDetails.id);
  }

  typing(){
    this.chatService.typing();
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
        sentAt: Math.floor(Date.now() /1000),
        secret: Math.floor(Date.now() /1000).toString() + 'wqwq'
      };
      
    this.chatService.send(newMessage);
    txt.value = '';
    this.fIntervalChatScroll();
   }

  intervalChatScroll;
  fIntervalChatScroll(){
      let i = this.chatMessages.nativeElement.scrollHeight;
      let p = 2;
      setTimeout(()=>{
        this.chatMessages.nativeElement.scrollTop -= 50;
        this.intervalChatScroll = setInterval(() => {
          let c = this.chatMessages.nativeElement.scrollTop;
          p *= p;
          this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollTop + p;
            if(c >= this.chatMessages.nativeElement.scrollTop){
              clearInterval(this.intervalChatScroll);
            }
        }, 50)
      },1)
      
  }

}
