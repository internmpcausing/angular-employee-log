




import { MyGlobals } from './globals';








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
import { NotificationsComponent } from './components/admin/logs/notifications/notifications.component';
import { ChatComponent } from './components/admin/logs/chat/chat.component';
import { NotificationService } from './services/notification.service';
import { ChatService } from './services/chat.service';
import { MomentModule } from 'angular2-moment';
import { NgProgressModule } from 'ngx-progressbar';
import { LogsComponent } from './components/admin/logs/logs.component';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './components/admin/home/home.component';
import { HomeService } from './services/home.service';
import { ScrollEventModule } from 'ngx-scroll-event';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NotificationToastComponent } from './components/shared/notification-toast/notification-toast.component';
import { AdminService } from './services/admin.service';
import { AdminComponent } from './components/admin/admin.component';
import { SelectdemoComponent, DialogAddNewDemo } from './components/admin/selectdemo/selectdemo.component';
import { EmployeesComponent, DialogEmployee } from './components/admin/employees/employees.component';
import { EmployeesService } from './services/employees.service';
import { VisitorComponent } from './components/visitor/visitor.component';
import { LoginComponent } from './components/visitor/login/login.component';
import { VisitorRootComponent } from './components/visitor/visitorroot/visitorroot.component';

import { AuthGuard, SelectDemoGuard } from './guards/auth.guard';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { SelectDemoService } from './services/selectdemo.service';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DialogImageComponent } from './components/shared/dialogimage/dialogimage.component';
import { DialogConfirmComponent } from './components/shared/dialogconfirm/dialogconfirm.component';
import { SlideshowComponent } from './components/shared/slideshow/slideshow.component';
import { DefaultPipe } from './pipes/default.pipe';
import { CustomDateTimePipe } from './pipes/custom-date-time.pipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


import {
  MatInputModule, 
  MatDialogModule, 
  MatButtonModule, 
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatListModule,
  MatMenuModule,
  MatCheckboxModule} from '@angular/material';




@NgModule({
  imports: [
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
    MatSidenavModule,
    MatTableModule,
    MatListModule,
    MatCheckboxModule
  ],
  exports: [
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
    MatSidenavModule,
    MatTableModule,
    MatListModule,
    MatCheckboxModule
  ],
  declarations: []
})
export class MaterialModule {}


@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    ChatComponent,
    LogsComponent,
    HomeComponent,
    NotificationToastComponent,
    AdminComponent,
    SelectdemoComponent,
    EmployeesComponent,
    DialogAddNewDemo,
    DialogEmployee,
    DialogImageComponent,
    DialogConfirmComponent,
    VisitorComponent,
    LoginComponent,
    VisitorRootComponent,
    SlideshowComponent,
    DefaultPipe,
    CustomDateTimePipe
    
  ],
  entryComponents: [NotificationToastComponent, DialogAddNewDemo, DialogEmployee, DialogImageComponent, DialogConfirmComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgProgressModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    PerfectScrollbarModule,
    ScrollEventModule,
    ImageCropperModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({toastComponent: NotificationToastComponent}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCuxTc1zAmpV2lxGKQkHud1TzrcXyzWasY'
    }),
    MomentModule
  ],
  providers: [
    MyGlobals, 
    AdminService, 
    SocketService, 
    TokenService,
    AuthGuard, 
    SelectDemoGuard, 
    AuthService, 
    SelectDemoService, 
    NotificationService, 
    ChatService, 
    HomeService,
    EmployeesService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
