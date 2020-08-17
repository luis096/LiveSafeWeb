import React, {Component} from 'react';
import Firebase from 'firebase';
import {Redirect} from 'react-router-dom';
import NotificationSystem from "react-notification-system";
import './index.scss';
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
import {Database, Storage} from "../../config/config";
import {operacion} from "../../componente/Operaciones";
import {validator} from "../../componente/validator";
import {style} from "variables/Variables.jsx";

const pdfA = require("jspdf");

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
            noEscuchar: false,
            redirectReserva: false,
            idReserva: '',
            esPropietario: false,
            esRoot: false,
            rol: ""
        };
        this.notificationSystem = React.createRef();
        this.logout = this.logout.bind(this);
        this.miBarrio = this.miBarrio.bind(this);
        this.miPerfil = this.miPerfil.bind(this);
        this.configuracion = this.configuracion.bind(this);
        this.addNotificationNew = this.addNotificationNew.bind(this);
        this.notificacionesVacias = this.notificacionesVacias.bind(this);
        this.verNotificaciones = this.verNotificaciones.bind(this);
        this.verReserva = this.verReserva.bind(this);
        this.confirmarReservaRedirect = this.confirmarReservaRedirect.bind(this);
        this.miBarioNav = this.miBarioNav.bind(this);
        this.notificacionNav = this.notificacionNav.bind(this);
        this.descargarManual = this.descargarManual.bind(this);
    }

    async componentDidMount() {
        const miReferencia = operacion.obtenerMiReferencia(3);
        if (localStorage.getItem('tipoUsuario') !== 'Root') this.setState({esRoot: true});
        if (localStorage.getItem('tipoUsuario') !== 'Propietario') return;
        this.setState({esPropietario: true});
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Notificaciones').orderBy('Fecha', 'desc').limit(10)
            .where('IdPropietario', '==', miReferencia)
            .onSnapshot(query => {
                if (!this.state.noEscuchar) {
                    let noti = [];
                    let cantidadNuevas = 0;
                    query.forEach(doc => {
                        let obj = doc.data();
                        obj.IdReserva = !!doc.data().Referencia ? doc.data().Referencia : '';
                        noti.push(obj);
                        if (!doc.data().Visto) {
                            this.addNotificationNew(doc.data().Tipo, doc.data().Texto);
                            cantidadNuevas++;
                        }
                    });
                    this.setState({notificaciones: noti, nuevas: cantidadNuevas});
                }

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
        if (!notification) return;

        notification.addNotification({
            title: <span data-notify="icon" className="pe-7s-bell"/>,
            message: (
                <div>
                    {titulo}: {texto}
                </div>
            ),
            level: "info",
            position: "br",
            autoDismiss: 3
        });
    };

    setRedirect = () => {
        Firebase.auth().signOut();
        localStorage.clear();
        this.setState({
            redirect: true
        });
    };

    getRol() {
        let rol = "";
        if (localStorage.getItem('tipoUsuario') === 'Root') rol = "root";
        if (localStorage.getItem('tipoUsuario') === 'Administrador') rol = "admin";
        if (localStorage.getItem('tipoUsuario') === 'Encargado') rol = "encargado";
        if (localStorage.getItem('tipoUsuario') === 'Propietario') rol = "propietario";
        return rol;
    }

    miPerfil() {
        this.setState({
            redirectPerfil: true
        });
    }

    miPerfilRedirect() {
        if (this.state.redirectPerfil) {
            this.state.redirectPerfil = false;
            return <Redirect to={"/" + this.getRol() + "/miPerfil"}/>;
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
            return <Redirect to={"/" + this.getRol() + "/miCountry"}/>;
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
            return <Redirect to={"/" + this.getRol() + "/configuraciones"}/>;
        }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        }
    };

    logout() {
        Firebase.auth().signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('mail');
    };


    notificacionesVacias() {
        return (
            <MenuItem>
                <div>
                    <h5>No tiene notificaciones</h5>
                </div>
            </MenuItem>
        );
    }

    async verNotificaciones() {
        await this.setState({nuevas: 0, noEscuchar: true});
        const miReferencia = operacion.obtenerMiReferencia(3);
        let ids = [];
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Notificaciones').where('Visto', '==', false)
            .where('IdPropietario', '==', miReferencia).get().then(query => {
                query.forEach(doc => {
                    ids.push(doc.id);
                })
            });
        await ids.forEach((idNotificacion) => {
            Database.collection('Country').doc(localStorage.getItem('idCountry'))
                .collection('Notificaciones').doc(idNotificacion).update({
                Visto: true
            });
        });

        setTimeout(() => {
            this.setState({noEscuchar: false})
        }, 1000);
    }

    verReserva(id) {
        if (!id) return;
        this.setState({
            idReserva: id,
            redirectReserva: true
        });
    }

    confirmarReservaRedirect() {
        if (this.state.redirectReserva) {
            this.state.redirectReserva = false;
            return <Redirect to={'visualizarReserva/' + this.state.idReserva}/>;
        }
    }

    isRoot() {
        return (localStorage.getItem('tipoUsuario') === 'Root');
    }

    miBarioNav() {
        if (!this.isRoot()) {
            return (<><MenuItem eventKey={4.1} onClick={this.miPerfil}>
                <i className="pe-7s-id"/> Mi Perfil
            </MenuItem>
                <MenuItem eventKey={4.2} onClick={this.miBarrio}>
                    <i className="pe-7s-home"/> Mi Country
                </MenuItem></>)
        }
    }

    notificacionNav() {
        if (this.state.esPropietario) {
            return (
                <NavDropdown
                    eventKey={3}
                    title={
                        <div>
                            <i className="fa fa-bell-o" onClick={this.verNotificaciones}/>
                            <span className="notification" hidden={!this.state.nuevas}>
                            {this.state.nuevas}</span>
                            <p className="hidden-md hidden-lg">
                                Notificaciones
                                <b className="caret"/>
                            </p>
                        </div>
                    } noCaret id="basic-nav-dropdown-2">
                    {
                        !this.state.notificaciones.length ?
                            this.notificacionesVacias() :
                            this.state.notificaciones.map((noti, key) => {
                                let hora = validator.obtenerFecha(noti.Fecha);
                                return (
                                    <MenuItem className="notifications" eventKey={key} onClick={() => {
                                        this.verReserva(noti.IdReserva)
                                    }}>
                                        <div>
                                            <h5>{noti.Tipo}</h5>
                                            <span>{noti.Texto}</span>
                                        </div>
                                        <span>{hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString()}</span>
                                    </MenuItem>)
                            })
                    }
                </NavDropdown>
            )
        }
    }

    async descargarManual() {
        let path = "";

        await Database.collection("Manual").doc(localStorage.getItem('tipoUsuario')).get().then(doc => {
            path = doc.data().Path;
        });
        if (!path) return;
        Storage.ref(path).getDownloadURL().then((url) => {
            window.open(url, '_blank');
        });
    }

    render() {
        return (
            <div>
                <Nav pullRight>
                    {this.notificacionNav()}
                    {this.confirmarReservaRedirect()}
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
                        {this.miPerfilRedirect()}
                        {this.miBarioNav()}
                        {this.miBarrioRedirect()}
                        {/*<MenuItem eventKey={4.3} onClick={this.configuracion}>*/}
                        {/*    <i className="pe-7s-tools"/> Configuraciones*/}
                        {/*</MenuItem>*/}
                        {/*{this.miConfiguracionRedirect()}*/}
                        <MenuItem eventKey={4.4} onClick={this.descargarManual}>
                            <i className="pe-7s-help1"/> Ayuda
                        </MenuItem>
                        <MenuItem divider/>
                        {this.renderRedirect()}
                        <MenuItem eventKey={4.5} onClick={this.setRedirect}>
                            <div className="text-danger">
                                <i className="pe-7s-back-2"/> Cerrar Sesión
                            </div>
                        </MenuItem>
                    </NavDropdown>
                </Nav>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}

export default HeaderLinks;
