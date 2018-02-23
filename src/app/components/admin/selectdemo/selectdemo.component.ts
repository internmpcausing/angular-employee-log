import { DialogImageComponent } from './../../shared/dialogimage/dialogimage.component';
import { SocketService } from './../../../services/socket.service';
import { Observable } from 'rxjs/Observable';
import { SelectDemoService, IModalResponseNewDemo } from './../../../services/selectdemo.service';
import { Component, OnInit, OnDestroy, TemplateRef, Inject } from '@angular/core';
import { AdminService, IAdmin, ICompany } from './../../../services/admin.service';
import { Router } from '@angular/router';
import { ISubscription } from "rxjs/Subscription";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AsyncValidationService } from '../../../services/asyncvalidation.service';
import { DialogConfirmComponent } from '../../shared/dialogconfirm/dialogconfirm.component';
import { ProperCase } from '../../../globals';

@Component({
  selector: 'app-selectdemo',
  templateUrl: './selectdemo.component.html',
  styleUrls: ['./selectdemo.component.css']
})
export class SelectdemoComponent implements OnInit {
  admin: IAdmin;
  companies$: Observable<any>;

  showLoading$: Observable<any>;

  constructor( 
    private selectDemoService:SelectDemoService, 
    private adminService:AdminService,
    private router:Router,
    public dialog: MatDialog,
    private socketService:SocketService) {
    
    this.showLoading$ = this.selectDemoService.showLoading;
    this.companies$ = this.selectDemoService.companies;

    this.adminService.admin.subscribe(data => {
      this.admin = data;
    })
  }

  ngOnInit() {
    localStorage.removeItem('selectedDemoId');
    localStorage.removeItem('selectedEmployeeId');
    this.socketService.leaveRooms();

    this.selectDemoService.getAll();
  }

  name = 'ddasds';
  animal = 'dsdas';
  openDialog(data): void {
    console.log(data);
    let dialogRef = this.dialog.open(DialogAddNewDemo, {
      width: '350px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openConfirmDialog(company): void {
    let m = `All data related to this demo will be deleted. Are you sure you want to delete ${ProperCase(company.name)}?`
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {message: m }
    });

    dialogRef.beforeClose().subscribe(confirmed => {
      if(confirmed){
        this.selectDemoService.deleteDemo(company._id);
        // this.employeesService.deleteEmployee(employee._id);
      }
    });
  }

  demoClick(company){
    localStorage.setItem('selectedDemoId', company._id);
    this.socketService.joinRooms([company._id]);
    this.socketService.socket.emit('cl-unseenLogsCount', {company: company._id});
    this.adminService.getInitialLogsBadgeCount(0);
    this.router.navigate(['/dashboard']);
  }


}


@Component({
  selector: 'dialog-add-new-demo',
  templateUrl: 'dialog-add-new-demo.html',
  styleUrls: ['./selectdemo.component.css']
})
export class DialogAddNewDemo implements OnInit, OnDestroy {
  demo = {
    name: '',
    logo: ''
  }

  modal = {
    disableControl: false,
    modalMessage: '',
    loading: false,
    check: false
  }
  private subscription: ISubscription[] = [];
  ngOnDestroy() {
    for(let s of this.subscription){
      s.unsubscribe();
    }
  }

  action: any;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddNewDemo>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private selectDemoService:SelectDemoService,
    private formBuilder:FormBuilder,
    private asyncValidationService:AsyncValidationService) {

      this.action = {
        add: this.data.add,
        update: this.data.update
      }
      this.subscription.push(this.selectDemoService.modalResponse.subscribe(data => this.onModalResponse(data)));
  }

  demoForm: FormGroup;
  ngOnInit(){

    let _id;
    if(this.data.company){
      console.log(this.data.company);
      let e  = Object.assign({}, this.data.company);
      this.demo.name = e.name;
      this.demo.logo = e.logo;
      _id = e._id
    }

    // if(this.data.employee){
    //   let e  = Object.assign({}, this.data.employee);
    //   this.employee.name = Object.assign({}, e.name);
    //   this.employee.pic = e.pic;
    // }
    
    this.demoForm = this.formBuilder.group({
      name: ['', Validators.required, this.asyncValidationService.checkDemoName.bind(this.asyncValidationService, _id)]
    })
    
  }

  fileChangeEvent(event: any): void {
    this.openImageDialog(event);
  }
  openImageDialog(event: any): void {
    let dialogRef = this.dialog.open(DialogImageComponent, {
      width: '450px',
      data: {img: event, cropped: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.demo.logo = result;
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onCreateClick(){
    this.demoForm.disable();
    this.modal.disableControl = true;
    this.modal.loading = true;
    setTimeout(() => {
      if(this.action.add) this.selectDemoService.addDemo(this.demo);
      if(this.action.update) this.selectDemoService.updateDemo(this.demo, this.data.company);
      
    }, 1000)  
    
    //this.dialogRef.close();
  }

  onModalResponse(data){
        if('success' in data){
          if(data.success){
            this.modal = Object.assign({}, this.modal, {
              loading: false,
              check: true
            });
            setTimeout(() => {
              this.dialogRef.close();
            }, 1000)
          }
          else{
            this.modal = Object.assign({}, this.modal, {
              disableControl: false,
              modalMessage: data.msg,
              loading: false
            });
          }
          
        }
  }

  

}