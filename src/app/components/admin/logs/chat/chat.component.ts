


import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from './../../../../services/chat.service';
import { SocketService } from '../../../../services/socket.service';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";
import { ScrollEvent } from 'ngx-scroll-event';
import { AdminService, IAdmin } from './../../../../services/admin.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  employee$: Observable<any>;
  employee;
  private subscription: ISubscription[] = [];
  
  AdminService
  admin: IAdmin;
    
  constructor(private chatService:ChatService, private socket:SocketService, private adminService:AdminService) {
   }

  ngOnInit() {
    this.employee$ = this.chatService.employee;
    this.subscription.push(this.chatService.scollChatBox.subscribe(data => {
      if (data) {
        this.initialChatBoxReady = data;
        this.fIntervalChatScroll();
      }
    }));
    this.subscription.push(this.chatService.addSmallValueToScrollChatBox.subscribe(() => {
      this.chatMessages.nativeElement.scrollTop += 55;
    }))

    this.subscription.push(this.chatService.doneRequestingAdditionalMessages.subscribe(data => {
      if(data){
        this.chatBoxAdditionalMessagesLoading = false;
        this.alreadyRequesting = false;
      }
    }))

    this.subscription.push(this.chatService.noMoreMessage.subscribe(data => {
      if (data){
        this.noMoreMessage = true;
      }
    }))

    this.subscription.push(this.adminService.admin.subscribe(data => {
      this.admin = data;
    }))
  }
  
  ngOnDestroy() {
    for(let s of this.subscription){
      s.unsubscribe();
    }
  }

  requestInitMessages(notifDetails){
    console.log(notifDetails);
    if(this.employee){
      if(this.employee.employeeId != notifDetails.employee.employeeId) {
      this.chatBoxAdditionalMessagesLoading = false;
      this.initialChatBoxReady = false;
      this.chatBoxReady = false;
      this.alreadyRequesting = false;
      this.noMoreMessage = false;
      }
    }
    
    this.employee = notifDetails.employee;
    this.chatService.loadInitMessages(notifDetails.id, this.employee.employeeId);
  }

  typing(){
    this.chatService.typing();
  }

  seenMessage(){
    this.chatService.seen();
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
    clearInterval(this.intervalChatScroll);
    let i = this.chatMessages.nativeElement.scrollHeight;
    let p = 2;
    setTimeout(()=>{
      this.chatMessages.nativeElement.scrollTop -= 1;
      this.intervalChatScroll = setInterval(() => {
        let c = this.chatMessages.nativeElement.scrollTop;
        p *= p;
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollTop + p;
          if(c >= this.chatMessages.nativeElement.scrollTop){
            this.chatBoxReady = true;
            clearInterval(this.intervalChatScroll);
          }
      }, 50)
    },1)
  }

  
  chatBoxAdditionalMessagesLoading = false;
  initialChatBoxReady = false;
  chatBoxReady = false;
  alreadyRequesting = false;
  noMoreMessage = false;
  public handleScroll(event: ScrollEvent) {
    if (!this.chatBoxReady) return;
    if(this.noMoreMessage) return;
    if(this.chatMessages.nativeElement.scrollTop <= 100){
      if(this.alreadyRequesting) return;
      this.alreadyRequesting = true;
      this.chatBoxAdditionalMessagesLoading = true;
      this.chatService.loadAdditionalMessages();
      console.log(`the user is reaching the top`);
    }
  }

}
