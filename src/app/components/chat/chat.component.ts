import { Component,OnInit } from '@angular/core';

import {ChatService} from "../../providers/chat.service"

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit  {

  mensaje: string ="";
  elemento: any;

  constructor( public _cs: ChatService ) { 

    this._cs.cargarMensajes()
    .subscribe(()=>{
      
      setTimeout( ()=>{
        document.getElementById('app-mensajes').scrollTop =  document.getElementById('app-mensajes').scrollHeight;

      },20);
    });
  }

    ngOnInit(){
      this.elemento = document.getElementById('app-mensaje');
    }
 

  enviar_mensaje(){

    console.log(this.mensaje);

    if(this.mensaje.length ===0){
      return;
    }

      this._cs.agregarMensaje(this.mensaje)
        .then(() => this.mensaje ="")
        .catch ((err)=> console.log('error al enviar',err));
      

  }

}
