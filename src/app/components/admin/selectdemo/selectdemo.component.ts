import { Observable } from 'rxjs/Observable';
import { SelectDemoService, IModalResponseNewDemo } from './../../../services/selectdemo.service';
import { Component, OnInit, OnDestroy, TemplateRef, Inject } from '@angular/core';
import { AdminService, IAdmin, ICompany } from './../../../services/admin.service';
import { Router } from '@angular/router';
import { ISubscription } from "rxjs/Subscription";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-selectdemo',
  templateUrl: './selectdemo.component.html',
  styleUrls: ['./selectdemo.component.css']
})
export class SelectdemoComponent implements OnInit {
  admin: IAdmin;
  companies$: Observable<any>;


  constructor( 
    private selectDemoService:SelectDemoService, 
    private adminService:AdminService,
    private router:Router,
    public dialog: MatDialog) {
    this.companies$ = this.selectDemoService.companies;

    this.adminService.admin.subscribe(data => {
      this.admin = data;
    })
  }

  ngOnInit() {
    this.selectDemoService.getAll();
  }

  name = 'ddasds';
  animal = 'dsdas';
  openDialog(): void {
    let dialogRef = this.dialog.open(DialogAddNewDemo, {
      width: '350px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  demoClick(company){
    localStorage.setItem('selectedDemoId', company._id);
    this.router.navigate(['/dashboard']);
  }


}


@Component({
  selector: 'dialog-add-new-demo',
  templateUrl: 'dialog-add-new-demo.html',
  styleUrls: ['./selectdemo.component.css']
})
export class DialogAddNewDemo implements OnDestroy {
  demo = {
    name: ''
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
    public dialogRef: MatDialogRef<DialogAddNewDemo>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private selectDemoService:SelectDemoService) {

      this.subscription.push(this.selectDemoService.modalResponse.subscribe(data => this.onModalResponse(data)));
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onCreateClick(){
    this.modal.disableControl = true;
    this.modal.loading = true;
    setTimeout(() => {
      this.selectDemoService.addNew(this.demo.name);
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