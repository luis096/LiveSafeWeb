import React, { Component } from "react";

import { Redirect } from "react-router-dom";
import { Firebase, Database } from '../config/config';
import firebase from 'firebase';
import '../layouts/Index.css';
import 'firebase/database';
import  logo  from '../logoLiveSafe.png';
import Spinner from 'react-spinner-material';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            user: null,
            result: false,
            tipo: false,
            tipoUsuario: '',
            resultado: ''
        };
        this.log = false;
        this.authListener = this.authListener.bind(this);
        this.ChangeEmail = this.ChangeEmail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.onButtonPress = this.onButtonPress.bind(this);
        this.obtenerValoresUsuario = this.obtenerValoresUsuario.bind(this);
    }

    ChangeEmail(event) {
        this.setState({email: event.target.value});

    }

    ChangePass(event) {
        this.setState({password: event.target.value});
    }

    componentDidMount() {
        this.authListener();
    }

    async obtenerValoresUsuario() {
        await Database.collection('Usuarios').doc(this.state.email).get()
            .then(doc=> {
                if (doc.exists) {
                    this.setState({tipo: true});
                    this.state.tipoUsuario = doc.data().TipoUsuario.id;
                    localStorage.setItem('tipoUsuario', this.state.tipoUsuario);
                    localStorage.setItem('idCountry', doc.data().IdCountry.id);
                    localStorage.setItem('idPersona', doc.data().IdPersona.id);
                    localStorage.setItem('mail', doc.data().NombreUsuario);
                }
            });
    }


    authListener() {
        Firebase.auth().onAuthStateChanged((user)=> {
            if (user) {
                this.setState({user});
                localStorage.setItem('user', user.uid);
                localStorage.setItem('mail', user.email);
            } else {
                this.setState({user: null});
                localStorage.removeItem('user');
            }
        });
        this.log = true;
    }

    async onButtonPress() {
        await this.obtenerValoresUsuario();
        if (this.state.tipo) {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(()=> {
                    this.setState({result: true});
                })
                .catch(()=> {
                    this.setState({result: false});
                    this.setState({resultado: 'Fallo de autentificacion'});
                });
        }
    }

  render() {
    const {user} = this.state;
    if (this.log) {
        if (!user) {
            return (
                <div className="container"><br></br>
                    <div className="text-center ">
                        {/* <div className=""></div> */}
                        <img src={logo} width="300" height="260"></img>
                    </div>
                    <div className="row">
                    <div className="card">
                    <div className='card-body' >

                        <div className="col-md-12 ">
                            <h2 className="text-center">Iniciar sesion</h2>
                            <div name="form">
                                <div className="form-group  ">
                                    <label className=" font-weight-bold " type="email"
                                           htmlFor="username">Email</label>
                                    <input type="text" className="form-control" name="username" placeholder="Email"
                                           value={this.state.email}
                                           onChange={this.ChangeEmail}
                                           hidden={false}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label className="font-weight-bold" htmlFor="password">Password</label>
                                    <input type="password" className=" form-control" id="exampleInputPassword1"
                                           placeholder="Password"
                                           value={this.state.password}
                                           onChange={this.ChangePass}
                                           hidden={false}
                                    />
                                </div>
                                <div><label>{this.state.resultado}</label></div>
                                <div className="form-group">

                                    <button className="btn btn-primary"
                                            onClick={()=> {
                                                this.onButtonPress();
                                            }}
                                    >
                                        Iniciar Sesion
                                    </button>
                                </div>

                            </div>
                            </div>

                            </div>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>

            );
        }
        else {
        if (this.state.tipoUsuario === 'Root' || localStorage.getItem('tipoUsuario') === 'Root') {
            return (<div>
                        <Redirect to="/root/country"></Redirect>
                    </div>);
        } else if (this.state.tipoUsuario === 'Administrador' || localStorage.getItem('tipoUsuario') === 'Administrador') {
            return (<div>
                        <Redirect to="/admin/propietarios"></Redirect>
                    </div>);
        } else if (this.state.tipoUsuario === 'Encargado' || localStorage.getItem('tipoUsuario') === 'Encargado') {
            return (<div>
                        <Redirect to="/encargado/ingresos"></Redirect>
                    </div>);
        } else if (this.state.tipoUsuario === 'Propietario' || localStorage.getItem('tipoUsuario') === 'Propietario') {
            return (<div>
                        <Redirect to="/propietario/invitados"></Redirect>
                    </div>);
        } else {
            return ( <div>
                Error, comuniquese con google.
            </div> )
        }
        }
    } else {
        return (
            <div>
                <Spinner size={120} spinnerColor={'#333'} spinnerWidth={2} visible={true}></Spinner>
            </div>
        );
    }
  }
}

export default Admin;
