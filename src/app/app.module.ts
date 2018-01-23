




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
import { NavLinks } from './services/navlinks.service';


@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    ChatComponent,
    LogsComponent,
    routingComponents,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgProgressModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDuOss95cF1Xa6hfbn7M_fC7plWH9GCnj8'
    }),
    MomentModule
  ],
  providers: [SocketService, NotificationService, ChatService, HomeService, NavLinks],
  bootstrap: [AppComponent]
})
export class AppModule { }
