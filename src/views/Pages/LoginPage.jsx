import React, { Component } from 'react';
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import Card from 'components/Card/Card.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import Checkbox from 'components/CustomCheckbox/CustomCheckbox.jsx';
import logo from '../../logoLiveSafe.png';
import { Database, Firebase } from '../../config/config';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import AuthNavbar from 'components/Navbars/AuthNavbar.jsx';
import bgImage from '../../assets/img/fondoLogin.jpg';
import { tipoDocumento } from '../../variables/Variables.jsx';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardHidden: true,
            email: '',
            password: '',
            user: null,
            result: false,
            tipo: false,
            tipoUsuario: '',
            resultado: '',
            usuarioNuevo: null,
            nuevaPass: '',
            nuevaPassTwo: ''
        };
        this.log = false;
        this.authListener = this.authListener.bind(this);
        this.crearUsuarioNuevo = this.crearUsuarioNuevo.bind(this);
        this.ChangeEmail = this.ChangeEmail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.ChangeNuevaPass = this.ChangeNuevaPass.bind(this);
        this.ChangeNuevaPassTwo = this.ChangeNuevaPassTwo.bind(this);
        this.onButtonPress = this.onButtonPress.bind(this);
        this.obtenerValoresUsuario = this.obtenerValoresUsuario.bind(this);
    }

    componentDidMount() {
        setTimeout(function () { this.setState({cardHidden: false});}.bind(this), 700);
        this.authListener();
    }

    ChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    ChangePass(event) {
        this.setState({password: event.target.value});
    }

    ChangeNuevaPass(event) {
        this.setState({nuevaPass: event.target.value});
    }

    ChangeNuevaPassTwo(event) {
        this.setState({nuevaPassTwo: event.target.value});
    }

    async obtenerValoresUsuario() {
        await Database.collection('Usuarios').doc(this.state.email).get()
            .then(doc=> {
                if (doc.exists) {
                    this.setState({tipo: true});
                    this.setState({tipoUsuario: doc.data().TipoUsuario.id});
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

    setTipoDocumento() {
        Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoDocumento.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
    }

    consultarUsuarioTemporal() {
        Database.collection('UsuariosTemp').doc(this.state.email).get().then(doc=> {
            if (doc.exists) {
                this.setState({usuarioNuevo: doc.data()});
            }
        });
    }

    async onButtonPress() {
        await this.obtenerValoresUsuario();

        if (!this.state.tipoUsuario) {
            await this.consultarUsuarioTemporal();
        } else {
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

    async crearUsuarioNuevo() {
        const {email, nuevaPass, usuarioNuevo} = this.state;
        await Firebase.auth().createUserWithEmailAndPassword(email, nuevaPass).then(
            Database.collection('Usuarios').doc(email).set(usuarioNuevo));
        await this.obtenerValoresUsuario();
        Database.collection('UsuariosTemp').doc(this.state.email).delete();
        this.setState({user: true});
    }

    render() {
        const {user} = this.state;
        if (this.log) {
            if (!user) {
                return (
                    <div>
                        <AuthNavbar/>
                        <div className="wrapper wrapper-full-page">
                            <div
                                className={'full-page login-page'}
                                data-color="black"
                                data-image={bgImage}
                            >
                                <div className="content">
                                    <Grid>
                                        <Row>
                                            <Col>
                                                <form>
                                                    <Card
                                                        hidden={this.state.cardHidden}
                                                        textCenter
                                                        content={
                                                            <div>
                                                                <FormGroup>
                                                                    <img src={logo} width="190" height="150"></img>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <ControlLabel>Email</ControlLabel>
                                                                    <FormControl placeholder="Ingrese mail" type="email"
                                                                                 value={this.state.email}
                                                                                 onChange={this.ChangeEmail}/>
                                                                </FormGroup>
                                                                <FormGroup hidden={this.state.usuarioNuevo}>
                                                                    <ControlLabel>Contraseña</ControlLabel>
                                                                    <FormControl placeholder="Contraseña"
                                                                                 type="password"
                                                                                 value={this.state.password}
                                                                                 onChange={this.ChangePass}
                                                                                 autoComplete="off"/>
                                                                </FormGroup>
                                                                <FormGroup hidden={!this.state.usuarioNuevo}>
                                                                    <ControlLabel>Nueva Contraseña</ControlLabel>
                                                                    <FormControl placeholder="Contraseña"
                                                                                 type="password"
                                                                                 value={this.state.nuevaPass}
                                                                                 onChange={this.ChangeNuevaPass}
                                                                                 autoComplete="off"/>
                                                                </FormGroup>
                                                                <FormGroup hidden={!this.state.usuarioNuevo}>
                                                                    <ControlLabel>Confirmar Nueva
                                                                        Contraseña</ControlLabel>
                                                                    <FormControl placeholder="Contraseña"
                                                                                 type="password"
                                                                                 value={this.state.nuevaPassTwo}
                                                                                 onChange={this.ChangeNuevaPassTwo}
                                                                                 autoComplete="off"/>
                                                                </FormGroup>
                                                            </div>
                                                        }
                                                        legend={
                                                            <Button bsStyle="info" fill wd
                                                                    onClick={this.state.usuarioNuevo ?
                                                                        this.crearUsuarioNuevo :
                                                                        this.onButtonPress
                                                                    }>
                                                                Iniciar Sesion
                                                            </Button>
                                                        }
                                                        ftTextCenter
                                                    />
                                                </form>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </div>
                                <div
                                    className="full-page-background"
                                    style={{backgroundImage: 'url(' + bgImage + ')'}}
                                />
                            </div>
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
                    return (<div>
                        Error, comuniquese con google.
                    </div>);
                }
            }
        } else {
            return (
                <div>
                    <Spinner size={120} spinnerColor={'blue'} spinnerWidth={8} visible={true}></Spinner>
                </div>
            );
        }
    }
}

export default LoginPage;
