
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { SocketService } from './../../services/socket.service';
import { ChatComponent } from './logs/chat/chat.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService, IAdmin, ICompany } from './../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit{
  
  url: Observable<string>;
  private socket;

  private currentRoute;
  private chatSelectedEmployeeId = 0;
  logsBadgeCount$: Observable<any>;
  showNavigationButton$: Observable<any>;
  admin: IAdmin;
  company: ICompany;

  constructor(private socketService:SocketService,
              private toastr: ToastrService,
              private router: Router,
              private route:ActivatedRoute,
              private adminService:AdminService){
    
    this.socket = this.socketService.socket;
    this.socketService.connect();

    this.router.events.subscribe((res) => {
      this.currentRoute = this.router.url;
    })

    this.adminService.chatSelectedEmployeeId.subscribe(data => {
      this.chatSelectedEmployeeId = data;
    })

    this.adminService.admin.subscribe(data => {
      this.admin = data;
    })

    this.adminService.company.subscribe(data => {
      this.company = data;
    })

    this.logsBadgeCount$ = this.adminService.logsBadgeCount;
    this.showNavigationButton$ = this.adminService.showNavigationButton;
  }

  
  


  ngOnInit(){
    this.socketService.socket.emit('cl-unseenLogsCount', {company: localStorage.getItem('selectedDemoId')});
    this.socketService.socket.on('sv-unseenLogsCount', data => {
      this.adminService.getInitialLogsBadgeCount(data);
    })

    this.socketService.socket.on('sv-newNotification', (data) => {
      data = Object.assign({}, data, {newNotif: true});
      this.toastr.show(data, 'New Time In', {disableTimeOut: false});
    });    

    this.socketService.socket.on('sv-newMessageNotif', (data) => {
      
      data = Object.assign({}, data, {newMessage: true});
      if(this.currentRoute == '/dashboard/logs'){
        if(this.chatSelectedEmployeeId != data.id){
          this.toastr.show(data, 'New Message', {disableTimeOut: false});
        }
      } else{
        this.toastr.show(data, 'New Message', {disableTimeOut: false});
      }
      
      
    })

  }

  onSignOutClick(){
    localStorage.removeItem('token');
    localStorage.removeItem('selectedDemoId');
    localStorage.removeItem('selectedEmployeeId');
    this.socketService.socket.disconnect();
    this.router.navigate(['/login']);
  }

  onChangeDemoClick(){
    this.router.navigate(['/dashboard/select-demo']);
  }


}