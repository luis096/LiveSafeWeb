import React, { Component } from 'react';
import Firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import NotificationSystem from "react-notification-system";
import {
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    FormGroup,
    FormControl,
    InputGroup
} from 'react-bootstrap';
import {Database} from "../../config/config";
import {operacion} from "../../componente/Operaciones";
import {validator} from "../../componente/validator";
import { style } from "variables/Variables.jsx";

class HeaderLinks extends Component {

    constructor() {
        super();
        this.state = {
            redirect: false,
            redirectPerfil: false,
            redirectBarrio: false,
            redirectConf: false,
            notificaciones: [],
            nuevas: 0,
            noEscuchar: false
        };
        this.notificationSystem = React.createRef();
        this.logout = this.logout.bind(this);
        this.miBarrio = this.miBarrio.bind(this);
        this.miPerfil= this.miPerfil.bind(this);
        this.configuracion = this.configuracion.bind(this);
        this.addNotificationNew = this.addNotificationNew.bind(this);
        this.notificacionesVacias = this.notificacionesVacias.bind(this);
        this.verNotificaciones = this.verNotificaciones.bind(this);
    }

    async componentDidMount() {
        const miReferencia = operacion.obtenerMiReferencia(3);
        if (localStorage.getItem('tipoUsuario') !== 'Propietario') return;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Notificaciones').orderBy('Fecha', 'desc').limit(10)
            .where('IdPropietario', '==', miReferencia)
            .onSnapshot(query => {
                if (this.state.noEscuchar) return;
                let noti = [];
                let cantidadNuevas = 0;
                query.forEach(doc =>{
                    noti.push(doc.data());
                    if(!doc.data().Visto) {
                        this.addNotificationNew(doc.data().Titulo, doc.data().Texto);
                        cantidadNuevas++;
                    }

                });
                this.setState({notificaciones: noti, nuevas: cantidadNuevas});

            });

    }

    addNotification = event => {
        event.preventDefault();
        const notification = this.notificationSystem.current;
        notification.addNotification({
            title: <span data-notify="icon" className="pe-7s-bell"/>,
            message: (
                <div>
                    Notificacion: Esta es una notificacion de prueba
                </div>
            ),
            level: "info",
            position: "br",
            autoDismiss: 5
        });
    };

    addNotificationNew(titulo, texto) {
        const notification = this.notificationSystem.current;
        notification.addNotification({
            title: <span data-notify="icon" className="pe-7s-bell"/>,
            message: (
                <div>
                    {titulo}: {texto}
                </div>
            ),
            level: "info",
            position: "br",
            autoDismiss: 15
        });
    };

    setRedirect = ()=> {
        Firebase.auth().signOut();
        localStorage.clear();
        this.setState({
            redirect: true
        });
    };

    miPerfil() {
        this.setState({
            redirectPerfil: true
        });
    }

    miPerfilRedirect() {
        if (this.state.redirectPerfil) {
            this.state.redirectPerfil = false;
            return <Redirect to='miPerfil'/>;
        }
    }

    miBarrio() {
        this.setState({
            redirectBarrio: true
        });
    }

    miBarrioRedirect() {
        if (this.state.redirectBarrio) {
            this.state.redirectBarrio = false;
            return <Redirect to='miCountry'/>;
        }
    }

    configuracion() {
        this.setState({
            redirectConf: true
        });
    }

    miConfiguracionRedirect() {
        if (this.state.redirectConf) {
            this.state.redirectConf = false;
            return <Redirect to='configuraciones'/>;
        }
    }

    renderRedirect = ()=> {
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        }
    };

    logout() {
        Firebase.auth().signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('mail');
    };


    notificacionesVacias(){
        return (
            <MenuItem>
                <div>
                    <h5>No tiene notificaciones</h5>
                </div>
            </MenuItem>
        );
    }

    async verNotificaciones(){
        await this.setState({nuevas: 0, noEscuchar: true});
        const miReferencia = operacion.obtenerMiReferencia(3);
        let ids = [];
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Notificaciones').where('Visto', '==', false)
            .where('IdPropietario', '==', miReferencia).get().then(query =>{
                query.forEach(doc => {
                    ids.push(doc.id);
                })
            });
        await ids.forEach( (idNotificacion) => {
             Database.collection('Country').doc(localStorage.getItem('idCountry'))
                .collection('Notificaciones').doc(idNotificacion).update({
                 Visto: true
             });
        });
        this.setState({noEscuchar: false})
    }

    render() {
        return (
            <div>
                <Nav pullRight>
                    <NavDropdown
                    eventKey={3}
                    title={
                    <div>
                        <i className="fa fa-bell-o" onClick={this.verNotificaciones}/>
                        <span className="notification" hidden={!this.state.nuevas}>
                            {this.state.nuevas}</span>
                        <p className="hidden-md hidden-lg">
                        Notificaciones
                        <b className="caret" />
                        </p>
                    </div>
                    } noCaret id="basic-nav-dropdown-2">
                        {
                            !this.state.notificaciones.length?
                            this.notificacionesVacias() :
                            this.state.notificaciones.map((noti, key) =>{
                                let hora = validator.obtenerFecha(noti.Fecha);
                                return (
                                    <MenuItem eventKey={key}>
                                        <div>
                                            <h5>{noti.Titulo}</h5>
                                            <span>{noti.Texto}</span>
                                        </div>
                                        <span>{hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString()}</span>
                                    </MenuItem>)
                            })
                        }
                    </NavDropdown>
                    <NavDropdown
                        eventKey={4}
                        title={
                            <div>
                                <i className="fa fa-list"/>
                                <p className="hidden-md hidden-lg">
                                    More
                                    <b className="caret"/>
                                </p>
                            </div>
                        }
                        noCaret
                        id="basic-nav-dropdown-3"
                        bsClass="dropdown-with-icons dropdown"
                    >
                        <MenuItem eventKey={4.1} onClick={this.miPerfil}>
                            <i className="pe-7s-id"/> Mi Perfil
                        </MenuItem>
                        {this.miPerfilRedirect()}
                        <MenuItem eventKey={4.2} onClick={this.miBarrio}>
                            <i className="pe-7s-home"/> Mi Barrio
                        </MenuItem>
                        {this.miBarrioRedirect()}
                        <MenuItem eventKey={4.3} onClick={this.configuracion}>
                            <i className="pe-7s-tools"/> Configuraciones
                        </MenuItem>
                        {this.miConfiguracionRedirect()}
                        <MenuItem divider/>
                        {this.renderRedirect()}
                        <MenuItem eventKey={4.5} onClick={this.setRedirect}>
                            <div className="text-danger">
                                <i className="pe-7s-back-2"/> Cerrar Sesion
                            </div>
                        </MenuItem>
                    </NavDropdown>
                </Nav>
                <div>
                    <button onClick={this.addNotification}>Add notification</button>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}

export default HeaderLinks;
