import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MapService{
    constructor(private http: HttpClient){
    }

    getFormattedAddress(lat, lng){
        return this.http.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`);
    }
}