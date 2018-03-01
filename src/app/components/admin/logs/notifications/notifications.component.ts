

import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
import { SocketService } from './../../../../services/socket.service';
import { ISubscription } from "rxjs/Subscription";
import { ScrollEvent } from 'ngx-scroll-event';
import { AdminService } from './../../../../services/admin.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  
  
  constructor(private notifService:NotificationService,
              private adminService:AdminService,
              private socketService:SocketService) {}

  private subscription: ISubscription[] = [];
  ngOnInit() {
    this.notifService.requestInitNotif();
    this.subscription.push(this.notifService.displayInitNotif().subscribe(notifications => this.displayInitNotif(notifications)));
    this.subscription.push(this.notifService.newNotif().subscribe(notification => this.newNotif(notification)));
    this.subscription.push(this.notifService.displayNotifDetails().subscribe(notifDetails => this.onDisplayNotifDetails(notifDetails)));
    this.subscription.push(this.notifService.displayAdditionalNotif().subscribe(notifications => this.displayAdditionalNotif(notifications)));

    

  }

  ngOnDestroy() {
    for(let s of this.subscription){
      s.unsubscribe();
    }
  }
  

  notifications;
  displayInitNotif(notifications){
    console.log(notifications);
    this.notifications = notifications;
  }

  

  selectedNotification;
  getNotifDetails(notification){

    let s = localStorage.getItem('selectedEmployeeId');
    if(s){
      this.socketService.leaveAndJoinRoom(s, notification.employeeId);
    }
    else{
      this.socketService.joinRooms([notification.employeeId]);
    }
    localStorage.setItem('selectedEmployeeId', notification.employeeId);


    if (!notification.isSeen) this.adminService.changeLogsBadgeCount(false);

    console.log(notification);
    this.adminService.changeChatSelectedEmployeeId(notification.employeeId);

    this.selectedNotification = notification;
    notification.isSeen = true;
    this.notifService.requestNotifDetails(notification);

    for(let n of this.notifications){
      (<any>n).selected = false;
    }
    (<any>notification).selected = true;
  }

  @Output() displayNotifDetails = new EventEmitter<any>();
  onDisplayNotifDetails(notifDetails){

    (<any>notifDetails).employee = this.selectedNotification;
    this.displayNotifDetails.emit(notifDetails);
  }

  newNotif(notification){
    console.log(notification);
    if(notification._t) localStorage.setItem('_t', notification._t);
    (<any>this.notifications).unshift(notification);
  }

  showNotificationLoading = false;
  alreadyRequesting = false;
  public handleScroll(event: ScrollEvent) {
    if (event.isReachingBottom) {

      if (this.noMoreNotification) return;
      this.showNotificationLoading = true;
      if (this.alreadyRequesting) return;

        let lastNotificationTimeIn = this.notifications[this.notifications.length -1].timeIn;
        this.notifService.requestAdditionalNotif(lastNotificationTimeIn);
        this.alreadyRequesting = true;
    }
  }

  noMoreNotification = false;
  displayAdditionalNotif(notifications){
    console.log(notifications);
    setTimeout(() =>{

      if(!notifications.length) this.noMoreNotification = true;
      for(let n of notifications){
      
        this.notifications.push(n);
      }
      this.alreadyRequesting = false;
      this.showNotificationLoading = false;
    },1000)
    
  }


}
