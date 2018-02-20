import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'customDateTime'
})
export class CustomDateTimePipe implements PipeTransform {

  transform(value): any {
    if(moment(value, 'MM/DD/YYYY', true).isValid()){
        return moment(value, 'MM/DD/YYYY').format('MMMM DD, YYYY');
    }
    else{
        return value;
    }
    
  }

}
