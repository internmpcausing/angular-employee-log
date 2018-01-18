
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
    this.notifService.getInitNotif().subscribe(notifications => this.displayInitNotif(notifications));
    this.notifService.newNotification().subscribe(notification => this.newNotification(notification));
  }

  

  notifications;
  displayInitNotif(notifications){
    console.log(notifications);
    this.notifications = notifications;
  }
  getNotifDetails(notification){
    this.ngProgress.start();
    notification.isSeen = true;
    this.notifService.getNotifDetails(notification).subscribe(notifDetails => {
      
      this.onDisplayNotifDetails(notifDetails)
      this.ngProgress.done();
    });
  }

  @Output() displayNotifDetails = new EventEmitter<any>();
  onDisplayNotifDetails(notifDetails){
    this.displayNotifDetails.emit(notifDetails);
  }

  newNotification(notification){
    
    console.log(notification);
    (<any>this.notifications).unshift(notification);
    
  }


}
