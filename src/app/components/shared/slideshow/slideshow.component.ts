import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit {
  @Input() pics: any;
  @Input() index: any;
  constructor() { }

  selectedImage = '';
  imageReady = false;
  ngOnInit() {
    this.displayImage(this.index);
  }

  @Output() closeSlideShowClick = new EventEmitter<any>();
  onCloseSlideShowClick(){
    this.closeSlideShowClick.emit();
  }

  displayImage(index){
    this.imageReady = false;
    this.selectedImage = '';
    let image = new Image();

    image.onload = () => {
      this.imageReady = true;
      this.selectedImage = this.pics[index].original;
    }

    image.src = this.pics[index].original;
  }

  onNextClick(){
    let i = (this.index == this.pics.length -1) ? 0 : this.index + 1;
    this.index = i;
    this.displayImage(i);
  }

  onPreviousClick(){
    let i = (this.index == 0) ? this.pics.length -1 : this.index - 1;
    this.index = i;
    this.displayImage(i);
  }

}
