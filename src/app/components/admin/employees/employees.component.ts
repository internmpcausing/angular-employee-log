import { DialogConfirmComponent } from './../../shared/dialogconfirm/dialogconfirm.component';
import { SocketService } from './../../../services/socket.service';
import { DialogImageComponent } from './../../shared/dialogimage/dialogimage.component';
import { Component, OnInit, OnDestroy, TemplateRef, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SelectDemoService, IModalResponseNewDemo } from './../../../services/selectdemo.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AsyncValidationService } from '../../../services/asyncvalidation.service';
import { Router } from '@angular/router';
import { ISubscription } from "rxjs/Subscription";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { EmployeesService, IEmployee } from './../../../services/employees.service';
import { ProperCase } from '../../../globals';



@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees$: Observable<any>;
  showLoading$: Observable<any>;
  isOpenRightSideNav = false;
  constructor(public dialog: MatDialog, private employeesService:EmployeesService, private socketService:SocketService) { 
    this.employeesService.getAllEmployee();
    this.employees$ = this.employeesService.employees;
    this.showLoading$ = this.employeesService.showLoading;

    let s = localStorage.getItem('selectedEmployeeId');
    if (s) this.socketService.leaveOneRoom(s);
    localStorage.removeItem('selectedEmployeeId');
    
  }

  ngOnInit() {}

  openDialog(data): void {
    let dialogRef = this.dialog.open(DialogEmployee, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  showDetails(rightSideNav){
    if(!this.isOpenRightSideNav){
      this.isOpenRightSideNav = true;
      rightSideNav.toggle();
    }
  }

  hideRightSideBar(rightSideNav){
    rightSideNav.toggle();
  }
  
  openConfirmDialog(employee): void {
    let m = `Are you sure you want to delete ${ProperCase(employee.name.firstName)} ${ProperCase(employee.name.lastName)}`
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {message: m }
    });

    dialogRef.beforeClose().subscribe(confirmed => {
      if(confirmed){
        this.employeesService.deleteEmployee(employee._id);
      }
    });
  }

}












@Component({
  selector: 'dialog-employee',
  templateUrl: 'dialog-employee.html',
  styleUrls: ['./employees.component.css']
})
export class DialogEmployee implements OnInit, OnDestroy {
  private subscription: ISubscription[] = [];
  employee:IEmployee = {
    name: {
      lastName: '',
      firstName: ''
    },
    username: '',
    pic: {
      original: '',
      thumb: ''
    },
    password: ''
    
  }

  modal = {
    disableControl: false,
    modalMessage: '',
    loading: false,
    check: false
  }


  
  

  action: any;
  constructor(
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<DialogEmployee>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private employeesService:EmployeesService,
      private formBuilder:FormBuilder,
      private asyncValidationService:AsyncValidationService) {

      this.action = Object.assign({}, {
        add: this.data.add,
        update: this.data.update
      })

      this.subscription.push(this.employeesService.modalResponse.subscribe(data => this.onModalResponse(data)));
  }
  
  employeeForm: FormGroup;
  ngOnInit(){

    // this.employeeForm = this.formBuilder.group({
    //   lastName: ['', Validators.required],
    //   firstName: ['', Validators.required],
    //   username: [
    //     '', 
    //     Validators.required,
        
    //     this.asyncValidationService.checkUsername.bind(this.asyncValidationService)],
    //   password: ['', Validators.required],
    // })
    
    if(this.data.employee){
      let e  = Object.assign({}, this.data.employee);
      this.employee.name = Object.assign({}, e.name);
      this.employee.pic = e.pic;
    }

    let group = {
      lastName: ['', Validators.required],
      firstName: ['', Validators.required]
    }
    
    if(this.action.add){
      group['username'] = ['', Validators.required, this.asyncValidationService.checkUsername.bind(this.asyncValidationService)];
      group['password'] = ['', Validators.required];
    }

    this.employeeForm = this.formBuilder.group(group);
      
  }

  ngOnDestroy() {
    for(let s of this.subscription){
      s.unsubscribe();
    }
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
        this.employee.pic = Object.assign({}, this.employee.pic, {
          original: result
        })
      }
    });
  }
  
  onCancelClick() {
    this.dialogRef.close();
  }

  onSaveClick(){
    this.employeeForm.disable();
    this.modal.disableControl = true;
    this.modal.loading = true;
    setTimeout(() => {
      if(this.action.add) this.employeesService.addEmployee(this.employee);
      if(this.action.update) this.employeesService.updateEmployee(this.employee, this.data.employee);

      
    }, 1000)  
  }

  onModalResponse(data){
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
      if(this.employeeForm) this.employeeForm.enable();
      
      this.modal = Object.assign({}, this.modal, {
        disableControl: false,
        modalMessage: data.msg,
        loading: false
      });
    }
  }
  

  

}
