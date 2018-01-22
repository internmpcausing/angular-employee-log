
import { NavLinks } from './../../services/navlinks.service';
import { Component, OnInit } from '@angular/core';
import { HomeService } from './../../services/home.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lat: number =  14.6390175;
  lng: number = 121.0261686;
  zoom: number = 9;


  constructor(private navLinks:NavLinks, private homeService:HomeService) { 
    this.navLinks.selectedNavlink(0);
    
  }

  ngOnInit() {
    this.homeService.requestRecentEmployeeTimeIns();
    this.homeService.getRecentEmployeeTimeIns().subscribe(_data => this.displayRecentEmployeeTimeIns(_data));
  }

  employeeTimeIns;
  displayRecentEmployeeTimeIns(_data){
    console.log(_data);
    
    this.employeeTimeIns = _data;
  }

  selectedEmployeeTimeIn = {
    _id: '',
    employee: {
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

  clickedMarker(_employeeTimeIn){
    this.selectedEmployeeTimeIn = _employeeTimeIn;
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

  onMouseOver(infoWindow, gm) {

    if (gm.lastOpen != null) {
        gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
}

fdsfd(){
    console.log('dassd');
  }


  rightSideBar = false;
  hideRightSideBar(rightSideBar){
    this.rightSideBar = false;
  }

}