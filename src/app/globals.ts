import { Injectable } from "@angular/core";


@Injectable()
export class MyGlobals{
    // serverAddress = `https://socket-io-use.herokuapp.com/`;
    serverAddress = `http://192.168.1.73:8080/`;
    // serverAddress = `https://obscure-ridge-49316.herokuapp.com/`;
}

// export const serverAddress = Object.freeze({
//     BASE_API_URL: 'http://example.com/',
//     //... more of your variables
// });



export function ProperCase(str){
    return str.split(' ')
   .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
   .join(' ')
}