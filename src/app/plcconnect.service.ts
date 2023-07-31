import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PLCconnectService {

  constructor(private http: HttpClient) { }

  //Funcion que llama a una a la API almacenada en un servidor local con puerto 3000 
  //y que activará la lectura en el PLC
  readPLCData() {
    return this.http.get('http://localhost:3000/read-plc');
  }
  //Funcion que llama a una a la API almacenada en un servidor local con puerto 3000 
  //y que activará la escritura en el PLC
  writePLCData(address: string, value: string) {
    return this.http.post('http://localhost:3000/write-plc', { address, value });
  }
  //Funcion que llama a una a la API almacenada en un servidor local con puerto 3000 
  //y que guardará en una base de datos cuando se utilice el PLC
  usagePLC(type: string ) {
    return this.http.post('http://localhost:3000/dater', { type });
  }
}
