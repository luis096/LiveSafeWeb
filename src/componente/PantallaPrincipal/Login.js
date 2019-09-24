import React, { Component } from 'react';
import '../Style/Login.css';
import firebase from 'firebase';
import 'firebase/database';
import { Firebase } from '../../config/config';
import { Database } from '../../config/config';
import Icono from '../Img/Icono.jpeg';
import InicioRoot from '../AdministracionRoot/InicioRoot';
import InicioAdministrador from '../AdministracionAdministrador/InicioAdministrador';
import InicioEncargado from '../AdministracionEncargadoIngresoEgreso/InicioEncargado';
import InicioPropietario from '../AdministracionPropietario/InicioPropietario';
import Spinner from 'react-spinner-material';


class Login extends Component {

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
        this.inicio = this.inicio.bind(this);
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
                }
            });
    }


    async authListener() {
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

    inicio() {
        const temp = localStorage.getItem('tipoUsuario');
        if (this.state.tipoUsuario === 'Root' || temp === 'Root') {
            return (<InicioRoot/>);
        } else if (this.state.tipoUsuario === 'Administrador' || temp === 'Administrador') {
            return (<InicioAdministrador/>);
        } else if (this.state.tipoUsuario === 'Encargado' || temp === 'Encargado') {
            return (<InicioEncargado/>);
        } else if (this.state.tipoUsuario === 'Propietario' || temp === 'Propietario') {
            return (<InicioPropietario/>);
        }
    }


    render() {
        const {user} = this.state;
        if (this.log) {
            if (!user) {
                return (
                    <div className="col-12  ">
                        <div className="text-center ">
                            <div className=""></div>
                            <img src={Icono} width="300" height="228"></img>
                            <hr className="my-4"></hr>
                        </div>
                        <div className="row">
                            <div className="col-md-4"></div>
                            <div className="col-md-4 borde">
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
                                    <div className="form-group izquierda">

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
                            <div className="col-md-4"></div>
                        </div>
                    </div>

                );
            }
            else {
                return (
                    <div>
                        {this.inicio()}
                    </div>
                );
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

export default Login;