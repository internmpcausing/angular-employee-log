import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialogconfirm',
  templateUrl: './dialogconfirm.component.html',
  styleUrls: ['./dialogconfirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  message: any = '';
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.message = data.message;
  }

  ngOnInit() {
  }

  onConfirmClick(){
    this.dialogRef.close(true);
  }
  

}