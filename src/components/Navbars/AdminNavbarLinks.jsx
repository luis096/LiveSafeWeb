import React, { Component } from 'react';
import Firebase from 'firebase';
import { Redirect } from 'react-router-dom';
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

class HeaderLinks extends Component {

    constructor() {
        super();
        this.state = {
            redirect: false,
            redirectPerfil: false,
            redirectBarrio: false,
            redirectConf: false

        };
        this.logout = this.logout.bind(this);
        // this.renderRedirect = this.renderRedirect.bind(this);
        this.miBarrio = this.miBarrio.bind(this);
        this.miPerfil= this.miPerfil.bind(this);
        this.configuracion = this.configuracion.bind(this);
    }

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

    render() {
        return (
            <div>
                <Nav pullRight>
                    <NavDropdown
                    eventKey={3}
                    title={
                    <div>
                        <i className="fa fa-bell-o" />
                        <span className="notification">4</span>
                        <p className="hidden-md hidden-lg">
                        Notificaciones
                        <b className="caret" />
                        </p>
                    </div>
                    }
                    noCaret
                    id="basic-nav-dropdown-2"
                    >
                    <MenuItem eventKey={3.1}>Notification 1</MenuItem>
                    <MenuItem eventKey={3.2}>Notification 2</MenuItem>
                    <MenuItem eventKey={3.3}>Notification 3</MenuItem>
                    <MenuItem eventKey={3.4}>Notification 4</MenuItem>
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
            </div>
        );
    }
}

export default HeaderLinks;
