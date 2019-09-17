import React, { Component } from 'react';
import './estilo.css';
import 'firebase/database';
import Router from './componente/router';
import './App.css';
import Encabezado from './componente/Encabezado/Encabezado';
import { Firebase } from './config/config';
import { Switch, Route } from 'react-router-dom';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import PrincipalCountry from './componente/AdministracionCountry/PrincipalCountry';
import PrincialIngreso from './componente/Ingresos/PrincipalIngreso';
import PrincialEgreso from './componente/Egresos/PrincipalEgreso';
import InicioPropietario from './componente/AdministracionPropietario/PrincipalPropietario';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            tipoUsuario: null,
            cargando: true
        };

        this.authListener();
    }

    authListener() {
        Firebase.auth().onAuthStateChanged((user)=> {

            if (user) {
                this.setState({user});
                this.setState({tipoUsuario: user.email});
                localStorage.setItem('user', user.uid);
            } else {
                this.setState({user: null});
                localStorage.removeItem('user');
            }
        });
        this.state.cargando = false;
    }


    render() {
        const {cargando} = this.state;
        if (cargando) {
            return (<div>Loading...</div>);
        } else {
            return (
                <div className="app container-fluid ">
                    <Encabezado tipoUsuario={this.state.tipoUsuario}></Encabezado>
                    <Router user={this.state.user ? true : false}></Router>
                </div>
            );
        }
    }

}

export default App;
