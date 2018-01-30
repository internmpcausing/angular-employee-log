
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { SocketService } from './../../../services/socket.service';
import { NgProgress } from 'ngx-progressbar';
import { ISubscription } from "rxjs/Subscription";
import { ScrollEvent } from 'ngx-scroll-event';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  
  
  constructor(private notifService:NotificationService,
              public ngProgress: NgProgress) {}

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
    this.selectedNotification = notification;
    this.ngProgress.start();
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
    this.ngProgress.done();
  }

  newNotif(notification){
    console.log(notification);
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