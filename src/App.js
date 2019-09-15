import React, { Component } from 'react';

import "./estilo.css";

import 'firebase/database'
import Router from './componente/router';
import './App.css'
import Encabezado from './componente/Encabezado/Encabezado';
import {Firebase} from "./config/config";


class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            user: null,
            tipoUsuario: null,
            cargando: true,
        };

        this.authListener();
    }

    authListener() {
        Firebase.auth().onAuthStateChanged((user) => {

            if (user) {
                this.setState({ user });
                this.setState({ tipoUsuario: user.email});
                localStorage.setItem('user', user.uid);
            } else {
                this.setState({ user: null });
                localStorage.removeItem('user');
            }
        })
        this.state.cargando = false;
    }


       render(){
           const { cargando } = this.state;
           if(cargando){return( <div>Loading...</div>)} else {
           return(
               <div className="app container-fluid ">
                   <Encabezado tipoUsuario = { this.state.tipoUsuario }></Encabezado>
                   <Router user={ this.state.user?true:false} ></Router>
               </div>
           );}
}

}

export default App;
