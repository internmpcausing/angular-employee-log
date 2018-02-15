import { SocketService } from './../../../services/socket.service';
import { DialogImageComponent } from './../../shared/dialogimage/dialogimage.component';

import { Component, OnInit, OnDestroy, TemplateRef, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SelectDemoService, IModalResponseNewDemo } from './../../../services/selectdemo.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ISubscription } from "rxjs/Subscription";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { EmployeesService, IEmployee } from './../../../services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees$: Observable<any>;
  constructor(public dialog: MatDialog, private employeesService:EmployeesService, private socketService:SocketService) { 
    this.employeesService.getAllEmployee();
    this.employees$ = this.employeesService.employees;

    let s = localStorage.getItem('selectedEmployeeId');
    if (s) this.socketService.leaveOneRoom(s);
    localStorage.removeItem('selectedEmployeeId');
    
  }

  ngOnInit() {}

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogEmployee, {
      width: '450px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}












@Component({
  selector: 'dialog-employee',
  templateUrl: 'dialog-employee.html',
  styleUrls: ['./employees.component.css']
})
export class DialogEmployee implements OnInit, OnDestroy {
  employee:IEmployee = {
    name: {},
    username: '',
    pic: {},
    password: ''
    
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

  constructor(
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<DialogEmployee>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private employeesService:EmployeesService) {

      

      this.subscription.push(this.employeesService.modalResponse.subscribe(data => this.onModalResponse(data)));
  }
  
  employeeForm: FormGroup;
  ngOnInit(){
    this.employeeForm = new FormGroup({
        lastName: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
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
      this.employeesService.addEmployee(this.employee);
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