import { SocketService } from './../../../services/socket.service';

import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HomeService } from './../../../services/home.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { ISubscription } from "rxjs/Subscription";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  lat: number =  14.6390175;
  lng: number = 121.0261686;
  mapZoomLevel: number = 5;

  modalRef: BsModalRef;


  employees$: Observable<any>;
  selectedEmployee$: Observable<any>;

  constructor(private homeService:HomeService,
              private modalService: BsModalService,
              private socketService: SocketService) {

    this.employees$ = this.homeService.employees;
    this.selectedEmployee$ = this.homeService.selectedEmployee;
    this.homeService.loadEmployees();


    let s = localStorage.getItem('selectedEmployeeId');
    if (s) this.socketService.leaveOneRoom(s);
    localStorage.removeItem('selectedEmployeeId');
  }

  private subscription: ISubscription[] = [];
  ngOnInit() {
  }

  ngOnDestroy() {
    for(let s of this.subscription){
      s.unsubscribe();
    }
  }
  
  

  employeeTimeIns;
  displayRecentEmployeeTimeIns(_data){
    console.log(_data);
    
    this.employeeTimeIns = _data;
  }

  selectedEmployeeTimeIn = {
    _id: '',
    employee: {
      online: '',
      name: '',
      pic: [],
      _id: ''
      
    },
    map: {
      lat: '',
      long: '',
      formattedAddress: ''
    },
    timeIn: ''
  }

  showDetails(employee, rightSideNav){
    this.mapZoomLevel = 100;
    let s = localStorage.getItem('selectedEmployeeId');
    if(s){
      if (s != employee.id){
        this.socketService.leaveAndJoinRoom(s, employee.id);
      }
    }
    else{
      this.socketService.joinRooms([employee.id]);
    }
    localStorage.setItem('selectedEmployeeId', employee.id);
    
    rightSideNav.toggle();
    this.homeService.getEmployeeStatus(employee.id);

    // if ((this.selectedEmployeeTimeIn.employee._id == _employeeTimeIn.employee._id) && this.rightSideBar) return;
    
    // console.log(_employeeTimeIn);
    // this.homeService.requestEmployeeStatus(_employeeTimeIn.employee._id);
    // this.selectedEmployeeTimeIn = _employeeTimeIn;
    // this.showLoadingRightSideBar = true;
    // this.rightSideBar = true;
    // this.zoom = 9;
    // this.lat = 0;
    // this.lng = 0;
    // setTimeout(()=>{
    //   this.zoom = 15;
    //   this.lat = _employeeTimeIn.map.lat;
    //   this.lng = _employeeTimeIn.map.lng;
    // }, 1);
    
    // this.selectedEmployeeTimeIn = _employeeTimeIn;
  }

  // displayEmployeeStatus(_data){
  //   console.log(_data);
  //   setTimeout(() => {
  //     if(_data.employeeId == this.selectedEmployeeTimeIn.employee._id){
  //       this.showLoadingRightSideBar = false;
  //       this.selectedEmployeeTimeIn.employee.online = _data.online;
  //       if (_data.online){

  //         if(_data.connection) (<any>this.selectedEmployeeTimeIn).connectionType = _data.connection;
  //         if(_data.location) (<any>this.selectedEmployeeTimeIn).currentLocation = _data.location.formattedAddress;
  //         if(_data.phone) (<any>this.selectedEmployeeTimeIn).phone = _data.phone;
  //         if(_data.battery){
  //           let batteryClass: string;
  //           if (_data.battery.level < 5) batteryClass = 'fa-battery-empty';
  //           if (_data.battery.level > 12) batteryClass = 'fa-battery-quarter';
  //           if (_data.battery.level > 37) batteryClass = 'fa-battery-half';
  //           if (_data.battery.level > 63) batteryClass = 'fa-battery-three-quarters';
  //           if (_data.battery.level > 87) batteryClass = 'fa-battery-full';

  //           console.log(_data.battery);

  //           (<any>this.selectedEmployeeTimeIn).battery = {
  //             percent:_data.battery.level,
  //             status: _data.battery.plugged,
  //             batteryClass: batteryClass
  //           }
  //         }
          

          

          
  //       }
        
  //     }
      
  //   }, 500)
    
  // }

  

  intervalMapZoom;
  intervalValue = 200;
  fIntervalMapZoom(employee){
    
    clearInterval(this.intervalMapZoom);
    
    this.intervalMapZoom = setInterval(() => {
      if(this.mapZoomLevel <= 7) {
        
        this.lat = employee.currentLocation.lat;
        this.lng = employee.currentLocation.lng;
        clearInterval(this.intervalMapZoom);

        setTimeout(() => {
          this.intervalMapZoom = setInterval(() => {
            if(this.mapZoomLevel >= 13) {
              clearInterval(this.intervalMapZoom);              
            } else {
              this.mapZoomLevel += 2;
            }
          }, this.intervalValue)
        }, 100)
      } else {
        this.mapZoomLevel -= 3;
      }

    }, this.intervalValue)
      
  }

  zoomAnimate = false;
  pmapZoomLevel = 0;
  employeeClick(employee){
    // if (this.zoomAnimate) return;
    // this.zoomAnimate = true;
    // this.fIntervalMapZoom(employee);
    // // if(this.mapZoomLevel >= 9) {
    // //   this.pmapZoomLevel = this.mapZoomLevel;
    // //   this.mapZoomLevel--;
    // // } else if(this.mapZoomLevel < 9) {
    // //   this.pmapZoomLevel = this.mapZoomLevel;
    // //   this.mapZoomLevel++;
    // // }
    this.mapZoomLevel = 10;
    setTimeout(() => {
      this.mapZoomLevel = 12;
      this.lat = employee.currentLocation.lat;
      this.lng = employee.currentLocation.lng;
    },1);
    
  }

  agmZoomChange(gm){
    // if(gm.zoom == 3) return;

    // setTimeout(() => {
    //   this.mapZoomLevel++
    // }, 100);
    
    
  }

  onMouseOver(infoWindow, gm) {
    if (gm.lastOpen != null) {
        gm.lastOpen.close();
    }
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }

  agmMapClick(gm){
    if (gm.lastOpen != null) gm.lastOpen.close();
  }

  hideRightSideBar(rightSideNav){
    rightSideNav.toggle();
  }

  viewSelfie(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  showSlideShow = false;
  onShowSlideShowClick(){
    this.showSlideShow = true;
  }

  onCloseSlideShowClick(){
    this.showSlideShow = false;
  }

}