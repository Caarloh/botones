import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PLCconnectService } from '../plcconnect.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent{
  receivedData: any[] = [];

  constructor(private PLCconnect : PLCconnectService) { }
  rutinaActiva?: string;
  dir?: string;

  disabled: boolean = true;
  
  ngOnInit() {

  }

  // Esta funcion es la que se ocupará de la funcionalidad de los botones encender y apagar
  turn(type: string){
    this.disabled = false; 
    if (type === 'on'){
      this.start();
    } else {
      this.disabled = true; 
    }
    this.sendData(type);
  }


  //Esta funcion es la que se ocupará de mandar si se encendio o se apago
  sendData(type: string){
    this.PLCconnect.usagePLC( type ).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

  //Función que hara la secuencia de encendido
  start(){
    this.restablecer();
    this.frecuenciaMaestra();
    this.operacion();
  }

//Funcion que cambiará la rutina activa
  changeRutine(rutina: string){
    this.rutinaActiva = rutina;
    console.log(this.rutinaActiva)

  }

  //Funcion que cambiará la rutina activa
  changeDir(dir: string){
    this.dir = dir;
    console.log(this.dir)
  }

  //Función que se activa al clickear el boton
  send(){
    this.PLCconnect.writePLCData( this.rutinaActiva ? this.rutinaActiva : "", this.dir ? this.dir : "" ).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }


  //           PARÁMETROS DE ACCIONAMIENTO

  // Función que le manda al PLC a traves de la direccion 00-02 siguiente orden:
  // Restablecer todos los parámetros a los valores predeterminados con frecuencia base a 50 Hz
  restablecer(){
    this.PLCconnect.writePLCData("00-02", "9");
  }

  // Función que le manda al PLC a traves de la direccion 00-20 siguiente orden:
  // Entrada por comunicación RS-485(conector RJ-45)
  // Este hará la ejecucion del comando de frecuencia maestra
  frecuenciaMaestra(){
    this.PLCconnect.writePLCData("00-20", "1");
  }

  // Función que le manda al PLC a traves de la direccion 00-21 siguiente orden:
  // Entrada por comunicación RS-485(conector RJ-45)
  //  Este hará la ejecucion del comando de operación
  operacion(){
    this.PLCconnect.writePLCData("00-21", "2");
  }

  //           PARÁMETROS BÁSICOS

  // Función que le manda al PLC a traves de la direccion 00-10 siguiente orden:
  // Máxima frecuencia de operación del motor
  max(){
    this.PLCconnect.writePLCData("01-00", "50");
  }

  // Función que le manda al PLC a traves de la direccion 01-12 siguiente orden:
  // Que acelere por 5 segundos
  gas(){
    this.PLCconnect.writePLCData("01-12", "5");
  }

  // Función que le manda al PLC a traves de la direccion 01-13 siguiente orden:
  // Que desacelere por 5 segundos
  break(){
    this.PLCconnect.writePLCData("01-13", "2");
  }

  //           PARÁMETROS DE COMUNICACIÓN

  // Función que le manda al PLC a traves de la direccion 09-00 siguiente orden:
  // Y se le entrega la dirección del VDF 
  comdir(){
    this.PLCconnect.writePLCData("09-00", "2");
  }

  // Función que le manda al PLC a traves de la direccion 09-01 siguiente orden:
  // Se le establlece la velocidad de transmisión
  comspeed(){
    this.PLCconnect.writePLCData("09-01", "9.6");
  }

  // Función que le manda al PLC a traves de la direccion 09-04 siguiente orden:
  // Establece la configuración 8N2 o RTU asignandole este protocolo
  comproto(){
    this.PLCconnect.writePLCData("09-04", "2");
  }

  // Función que le manda al PLC a traves de la direccion 09-35 siguiente orden:
  // Establece la dirección del PLC
  plcdir(){
    this.PLCconnect.writePLCData("09-35", ".....????");
  }
}
