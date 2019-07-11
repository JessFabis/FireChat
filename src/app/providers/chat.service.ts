import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from "rxjs/operators"

import { Mensaje } from "../interface/mensaje.interface";

import { AngularFireAuth } from '@angular/fire/auth';
import *as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje []=[];
  public usuario:any ={};

  constructor( private afs:AngularFirestore,
                public afAuth: AngularFireAuth) { 


                  this.afAuth.authState.subscribe(user =>{
                    console.log("estado del usuario:",user);

                    if(!user){
                      return;
                    }
                     this.usuario.nombre= user.displayName;
                     this.usuario.uid = user.uid;
                     this.usuario.foto =user.photoURL;
                  })
                }

  login(proveedor:string) {
    
    if (proveedor === 'google'){
      
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }else{
      this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }


   logout() {
   this.usuario ={};
   this.afAuth.auth.signOut();
    }

  cargarMensajes(){
    
    this.itemsCollection = this.afs.collection<Mensaje>('chats' , ref => ref.orderBy('fecha','desc')
                                                                            .limit(5));

    return this.itemsCollection.valueChanges()
        .pipe( map((mensajes: Mensaje[]) => {      
         console.log(mensajes); 
         
         this.chats =[];
         for (let mensaje of mensajes){
           this.chats.unshift(mensaje);
         }
           return this.chats;
          //this.chats= mensajes;
         }))

  }

  // TODO falta el uid del usuario
  agregarMensaje(  texto:string){
    let mensaje :Mensaje ={
      nombre: this.usuario.nombre,
      mensaje : texto,
      fecha: new Date ().getTime(),
      foto : this.usuario.foto,
      uid: this.usuario.uid
    }

    return this. itemsCollection.add(mensaje);

  }
}


