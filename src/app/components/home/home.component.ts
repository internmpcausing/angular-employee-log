
import { NavLinks } from './../../services/navlinks.service';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HomeService } from './../../services/home.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { ISubscription } from "rxjs/Subscription";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  lat: number =  14.6390175;
  lng: number = 121.0261686;
  zoom: number = 9;

  modalRef: BsModalRef;



  constructor(private navLinks:NavLinks, 
              private homeService:HomeService,
              private modalService: BsModalService) { 
    this.navLinks.selectedNavlink(0);
    
  }

  private subscription: ISubscription[] = [];
  ngOnInit() {
    this.homeService.requestRecentEmployeeTimeIns();

    this.subscription.push(this.homeService.getRecentEmployeeTimeIns().subscribe(_data => this.displayRecentEmployeeTimeIns(_data)));
    this.subscription.push(this.homeService.getEmployeeStatus().subscribe(_data => this.displayEmployeeStatus(_data)));
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
      pic: '',
      _id: ''
      
    },
    map: {
      lat: '',
      long: '',
      formattedAddress: ''
    },
    timeIn: ''
  }

  showLoadingRightSideBar = true;
  clickedMarker(_employeeTimeIn){
    if ((this.selectedEmployeeTimeIn.employee._id == _employeeTimeIn.employee._id) && this.rightSideBar) return;
    
    console.log(_employeeTimeIn);
    this.homeService.requestEmployeeStatus(_employeeTimeIn.employee._id);
    this.selectedEmployeeTimeIn = _employeeTimeIn;
    this.showLoadingRightSideBar = true;
    this.rightSideBar = true;
    this.zoom = 9;
    this.lat = 0;
    this.lng = 0;
    setTimeout(()=>{
      this.zoom = 15;
      this.lat = _employeeTimeIn.map.lat;
      this.lng = _employeeTimeIn.map.lng;
    }, 1);
    
    
    this.selectedEmployeeTimeIn = _employeeTimeIn;
  }

  displayEmployeeStatus(_data){
    console.log(_data);
    setTimeout(() => {
      if(_data.employeeId == this.selectedEmployeeTimeIn.employee._id){
        this.showLoadingRightSideBar = false;
        this.selectedEmployeeTimeIn.employee.online = _data.online;
        if (_data.online){

          if(_data.connection) (<any>this.selectedEmployeeTimeIn).connectionType = _data.connection;
          if(_data.location) (<any>this.selectedEmployeeTimeIn).currentLocation = _data.location.formattedAddress;
          if(_data.phone) (<any>this.selectedEmployeeTimeIn).phone = _data.phone;
          if(_data.battery){
            let batteryClass: string;
            if (_data.battery.level < 5) batteryClass = 'fa-battery-empty';
            if (_data.battery.level > 12) batteryClass = 'fa-battery-quarter';
            if (_data.battery.level > 37) batteryClass = 'fa-battery-half';
            if (_data.battery.level > 63) batteryClass = 'fa-battery-three-quarters';
            if (_data.battery.level > 87) batteryClass = 'fa-battery-full';

            console.log(_data.battery);

            (<any>this.selectedEmployeeTimeIn).battery = {
              percent:_data.battery.level,
              status: _data.battery.plugged,
              batteryClass: batteryClass
            }
          }
          

          

          
        }
        
      }
      
    }, 500)
    
  }

  employeeDeployedClicked(_employeeTimeIn){
    this.rightSideBar = false;
    this.zoom = 9;
    this.lat = 0;
    this.lng = 0;
    setTimeout(()=>{
      this.zoom = 15;
      this.lat = _employeeTimeIn.map.lat;
      this.lng = _employeeTimeIn.map.lng;
    }, 1);
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


  rightSideBar = false;
  hideRightSideBar(rightSideBar){
    this.rightSideBar = false;
  }

  viewSelfie(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}