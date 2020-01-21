import React, { Component } from 'react';
import { Database } from 'config/config';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import { Firebase } from '../config/config';


class Inicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            login: false
        };
        this.authListener = this.authListener.bind(this);
    }

    async componentDidMount() {
        await this.authListener();
    }

    authListener() {
        Firebase.auth().onAuthStateChanged((user)=> {
            if (user) {
                this.setState({user});
                localStorage.setItem('user', user.uid);
                localStorage.setItem('mail', user.email);
            } else {
                this.setState({user: null, login: true});
                localStorage.removeItem('user');
            }
        });
    }

    redirect(){
        let tipoUsuario = localStorage.getItem('tipoUsuario');
        if (this.state.login) {
            this.setState({login: false});
            return <Redirect to='/login'/>;
        } else if (tipoUsuario === 'Root'){
            return <Redirect to="/root/country"/>
        } else if (tipoUsuario === 'Administrador'){
            return <Redirect to="/admin/propietarios"/>
        } else if (tipoUsuario === 'Encargado'){
            return <Redirect to="/encargado/ingresos"/>
        } else if (tipoUsuario === 'Propietario'){
            return <Redirect to="/propietario/invitados"/>
        }
    }

    render() {
        return (
            <div className="col-12">
                <Spinner size={120} spinnerColor={'blue'} spinnerWidth={3}/>
                {this.redirect()}
            </div>
        );
    }
}

export default Inicio;
