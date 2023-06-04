import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PLCconnectService {

  constructor(private http: HttpClient) { }

  readPLCData() {
    return this.http.get('http://localhost:3000/read-plc');
  }
  
  writePLCData(address: number, value: number) {
    return this.http.post('http://localhost:3000/write-plc', { address, value });
  }

  state(type: string ) {
    return this.http.post('http://localhost:3000/dater', { type });
  }
}
