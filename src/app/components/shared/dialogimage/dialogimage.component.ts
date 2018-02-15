import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialogimage',
  templateUrl: './dialogimage.component.html',
  styleUrls: ['./dialogimage.component.css']
})
export class DialogImageComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  constructor(
    public dialogRef: MatDialogRef<DialogImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.imageChangedEvent = data.img;
  }

  imageCropped(image: string) {
      this.croppedImage = image;
  }

  invalidImage = false;
  loadImageFailed(){
    this.invalidImage = true;
  }
  ngOnInit() {
  }

  onCropClick(){
    this.dialogRef.close(this.croppedImage);
  }

}
