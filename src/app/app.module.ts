




import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//ngx-bootstrap Modules
import { AlertModule, BsDropdownModule, ModalModule } from 'ngx-bootstrap';

//***************************


import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SocketService } from './services/socket.service';
import { NotificationsComponent } from './components/logs/notifications/notifications.component';
import { ChatComponent } from './components/logs/chat/chat.component';
import { NotificationService } from './services/notification.service';
import { ChatService } from './services/chat.service';
import { MomentModule } from 'angular2-moment';
import { NgProgressModule } from 'ngx-progressbar';
import { LogsComponent } from './components/logs/logs.component';
import { AppRoutingModule, routingComponents } from './app.routing';
import { HomeComponent } from './components/home/home.component';
import { HomeService } from './services/home.service';
import { ScrollEventModule } from 'ngx-scroll-event';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';



@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    ChatComponent,
    LogsComponent,
    routingComponents,
    HomeComponent,
    NotificationToastComponent
  ],
  entryComponents: [NotificationToastComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgProgressModule,
    BrowserAnimationsModule,
    ScrollEventModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({toastComponent: NotificationToastComponent}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDuOss95cF1Xa6hfbn7M_fC7plWH9GCnj8'
    }),
    MomentModule
  ],
  providers: [SocketService, NotificationService, ChatService, HomeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
