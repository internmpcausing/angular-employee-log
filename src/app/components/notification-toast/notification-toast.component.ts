import { Component, OnInit } from '@angular/core';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';


@Component({
  selector: '[pink-toast-component]',
  styleUrls: ['./notification-toast.component.css'],
  templateUrl: './notification-toast.component.html',
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0,
        }),
        style({
          transform: 'skewX(20deg)',
          opacity: 1,
        }),
        style({
          transform: 'skewX(-5deg)',
          opacity: 1,
        }),
        style({
          transform: 'none',
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
        style({
          transform: 'translate3d(100%, 0, 0) skewX(30deg)',
          opacity: 0,
        }),
      ]))),
    ]),
  ],
  preserveWhitespaces: false,
})
export class NotificationToastComponent extends Toast implements OnInit {
  message: {
    name: {
      firstName: '',
      lastName: ''
    },
    timeIn: 0,
    pic: '',
    newNotif: false,
    newMessage: false,
    successLogin: false,
    failedLogIn: false
  }
  constructor(protected toastrService: ToastrService,
            public toastPackage: ToastPackage) { 
    super(toastrService, toastPackage);
    
  }

  action(event: Event) {
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }

  ngOnInit() {
  }

}
