
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { SocketService } from './../../../services/socket.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  
  
  constructor(private notifService:NotificationService,
              public ngProgress: NgProgress) {}


  ngOnInit() {
    this.notifService.requestInitNotif();
    this.notifService.displayInitNotif().subscribe(notifications => this.displayInitNotif(notifications));

    this.notifService.newNotif().subscribe(notification => this.newNotif(notification));

    this.notifService.displayNotifDetails().subscribe(notifDetails => this.onDisplayNotifDetails(notifDetails));
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
    console.log(notifDetails);
    (<any>notifDetails).employee = this.selectedNotification;
    this.displayNotifDetails.emit(notifDetails);
    this.ngProgress.done();
  }

  newNotif(notification){
    console.log(notification);
    (<any>this.notifications).unshift(notification);
  }


}
