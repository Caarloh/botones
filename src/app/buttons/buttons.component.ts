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

  onOff?: string;
  rutine?: string;
  leftRight?: string;

  disabled: boolean = true;
  
  ngOnInit() {

  }

  turnOnOff(){
     let type: string;

     if (this.onOff == "off"){
       this.disabled = true;
       this.rutine = "none"
       type = "on"
       this.PLCconnect.state( type ).subscribe(
         response => console.log(response),
         error => console.error(error)
       );
     } else{
      
       this.disabled = false;
       type = "off"
       this.PLCconnect.state( type ).subscribe(
         response => console.log(response),
         error => console.error(error)
       );
     }
  }

  send(){
    //enviar info
  }

  sendData() {

  }
}
