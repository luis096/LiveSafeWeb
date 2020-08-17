import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Link } from 'react-router-dom';
import { Modal, Alert, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { validator } from '../validator';
import { operacion } from '../Operaciones';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class VisualizarReserva extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            reserva: {},
            desde: null,
            hasta: null,
            invitadosConfirmados: [],
            invitadosPendientes: [],
            idInvitadoCreado: null,
            showModal: false,
            nombre: '',
            apellido: '',
            documento: '',
            tipoDocumento: '',
            estado: {},
            tipoD: [],
            activeTab: '1',
        };
        this.notificationSystem = React.createRef();
        const url = this.props.location.pathname.split('/');
        this.idReserva = url[url.length - 1];
        this.modalAgregarInvitado = this.modalAgregarInvitado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.agregarNuevoInvitado = this.agregarNuevoInvitado.bind(this);
        this.permiteAgregar = this.permiteAgregar.bind(this);
        this.permiteConfirmar = this.permiteConfirmar.bind(this);
        this.conexion = Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Propietarios')
            .doc(localStorage.getItem('idPersona'))
            .collection('Reservas')
            .doc(this.idReserva);
    }

    async componentDidMount() {
        var confirmados = [];
        var pendientes = [];
        await this.conexion.get().then((doc) => {
            this.setState({
                reserva: doc.data(),
                desde: new Date(doc.data().FechaDesde.seconds * 1000),
                hasta: new Date(doc.data().FechaHasta.seconds * 1000),
            });
        });
        this.setState({ estado: validator.estadoReserva(this.state.desde, this.state.hasta, this.state.reserva.Cancelado) });
        await this.conexion
            .collection('Invitados')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        if (doc.data().Estado) {
                            confirmados.push([doc.data(), doc.id]);
                        } else {
                            pendientes.push([doc.data(), doc.id]);
                        }
                    }
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({
            invitadosConfirmados: confirmados,
            invitadosPendientes: pendientes,
        });
        await Database.collection('TipoDocumento')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.state.tipoD.push({ value: doc.id, label: doc.data().Nombre });
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }

    actualizar(id, pendiente) {
        const { invitadosPendientes, invitadosConfirmados } = this.state;
        if (pendiente) {
            invitadosPendientes.map((valor) => {
                if (valor[1] == id) {
                    invitadosPendientes.splice(invitadosPendientes.indexOf(valor), 1);
                    invitadosConfirmados.push(valor);
                }
            });
        } else {
            invitadosConfirmados.map((valor) => {
                if (valor[1] == id) {
                    invitadosConfirmados.splice(invitadosConfirmados.indexOf(valor), 1);
                    invitadosPendientes.push(valor);
                }
            });
        }
        this.setState({ invitadosPendientes, invitadosConfirmados });
    }

    async agregarInvitado(invitado, id) {
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('InvitacionesEventos')
            .add({
                IdReserva: Database.doc(
                    'Country/' +
                    localStorage.getItem('idCountry') +
                    '/Propietarios/' +
                    localStorage.getItem('idPersona') +
                    '/Reservas/' +
                    this.idReserva
                ),
                FechaDesde: this.state.desde,
                FechaHasta: this.state.hasta,
                TipoDocumento: invitado.TipoDocumento,
                Documento: invitado.Documento,
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        await this.conexion
            .collection('Invitados')
            .doc(id)
            .update({ Estado: true })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
    }

    modalAgregarInvitado() {
        this.setState({ showModal: true });
    }

    async agregarNuevoInvitado() {
        const { invitadosConfirmados } = this.state;
        var invitado = [
            {
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Documento: this.state.documento,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
                TipoDocumentoLabel: this.state.tipoDocumento.label,
                Estado: true,
                IdInvitado: '',
            },
            '',
        ];
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Propietarios')
            .doc(localStorage.getItem('idPersona'))
            .collection('Reservas')
            .doc(this.idReserva)
            .collection('Invitados')
            .add(invitado[0])
            .then((doc) => {
                invitado[1] = doc.id;
                invitadosConfirmados.push(invitado);
                this.setState({ invitadosConfirmados });
                this.agregarInvitado(invitado[0], doc.id);
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({ showModal: false });
    }

    async cancelarInvitacion(inv) {
        if (!inv) {
            return;
        }
        inv[0].Estado = false;
        let referenciaReserva = Database.doc(
            'Country/' +
            localStorage.getItem('idCountry') +
            '/Propietarios/' +
            localStorage.getItem('idPersona') +
            '/Reservas/' +
            this.idReserva
        );
        let idEliminar = '';
        await this.conexion
            .collection('Invitados')
            .doc(inv[1])
            .update({ Estado: false })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('InvitacionesEventos')
            .where('IdReserva', '==', referenciaReserva)
            .where('Documento', '==', inv[0].Documento)
            .where('TipoDocumento', '==', inv[0].TipoDocumento)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    idEliminar = doc.id;
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('InvitacionesEventos')
            .doc(idEliminar)
            .delete()
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.actualizar(inv[1], false);
    }

    ChangeNombre(event) {
        this.setState({ nombre: event.target.value });
    }

    ChangeApellido(event) {
        this.setState({ apellido: event.target.value });
    }

    ChangeSelect(event) {
        this.setState({ tipoDocumento: event });
    }

    ChangeDocumento(event) {
        this.setState({ documento: event.target.value });
    }

    permiteAgregar() {
        return !(this.state.estado.Id == 0);
    }

    permiteConfirmar() {
        return this.state.estado.Id == 2 || this.state.estado.Id == 3;
    }

    render() {
        return (
            <div className="col-12">
                <legend>
                    <h3 className="row"> Visualizar reserva</h3>
                </legend>
                <div className="row">
                    <div className="col-md-4 row-secction">
                        <h4>Nombre del servicio</h4>
                        <label>{this.state.reserva.Servicio}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Nombre de la reserva</h4>
                        <label>{this.state.reserva.Nombre}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Estado de la reserva</h4>
                        <label>{this.state.estado ? this.state.estado.Nombre : '-'}</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 row-secction">
                        <h4>Fecha de la reserva:</h4>
                        <label>{this.state.desde ? this.state.desde.toLocaleDateString() : '-'}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Hora de inicio:</h4>
                        <label>{this.state.desde ? this.state.desde.toLocaleTimeString() : '-'}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Hora de finalizacion:</h4>
                        <label>{this.state.hasta ? this.state.hasta.toLocaleTimeString() : '-'}</label>
                    </div>
                </div>
                <legend />
                <h3 className="row">Invitados de la reserva</h3>
                <div className="row col-md-12">
                    <div className="row-secction col-md-7">
                        <label>Link de invitación</label>
                        <input
                            type="text"
                            className="form-control"
                            readOnly
                            value={
                                'https://livesafeweb.web.app/#/invitado/' +
                                localStorage.getItem('idCountry') +
                                '/' +
                                localStorage.getItem('idPersona') +
                                '/' +
                                this.idReserva
                            }
                        />
                    </div>
                    <div style={{marginTop:'5px'}} className="row-secction col-md-1">
                        <br />
                        <CopyToClipboard
                            text={
                                'https://livesafeweb.web.app/#/invitado/' +
                                localStorage.getItem('idCountry') +
                                '/' +
                                localStorage.getItem('idPersona') +
                                '/' +
                                this.idReserva
                            }
                            onCopy={() =>
                                this.notificationSystem.current.addNotification(operacion.registroConExito('Copiado en portapapeles'))
                            }>
                            <Button bsStyle="success" fill>
                                Copiar
                            </Button>
                        </CopyToClipboard>
                    </div>
                    <div style={{marginTop:'25px'}} className=" row-secction col-md-3">
                        <Button bsStyle="primary" fill wd onClick={this.modalAgregarInvitado} disabled={this.permiteAgregar()}>
                            Agregar invitado
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar un nuevo invitado</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{marginLeft:'5px'}} className="row col-md-12">
                                <div  className="row-secction col-md-6">
                                    <label> Nombre </label>
                                    <input
                                        type="name"
                                        className="form-control"
                                        placeholder="Nombre"
                                        value={this.state.nombre}
                                        onChange={this.ChangeNombre}
                                    />
                                </div>
                                <div className="row-secction col-md-6">
                                    <label> Apellido </label>
                                    <input
                                        type="family-name"
                                        className="form-control"
                                        placeholder="Apellido"
                                        value={this.state.apellido}
                                        onChange={this.ChangeApellido}
                                    />
                                </div>
                            </div>
                            <div style={{marginLeft:'5px'}} className="row col-md-12">
                                <div className="row-secction col-md-6">
                                    <label> Tipo de Documento </label>
                                    <Select
                                        className="select-documento"
                                        placeholder="Seleccionar"
                                        classNamePrefix="select"
                                        isDisabled={false}
                                        isLoading={false}
                                        isClearable={true}
                                        isSearchable={true}
                                        options={this.state.tipoD}
                                        onChange={this.ChangeSelect.bind(this)}
                                    />
                                </div>
                                <div className="row-secction col-md-6">
                                    <label> Número de Documento </label>
                                    <input
                                        type="document"
                                        className="form-control"
                                        placeholder="Documento"
                                        value={this.state.documento}
                                        onChange={this.ChangeDocumento}
                                    />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="footerModal">
                            <Button simple onClick={() => this.setState({ showModal: false })}>
                                Cerrar
                            </Button>
                            <Button bsStyle="success" fill onClick={this.agregarNuevoInvitado}>
                                Agregar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="card row">
                    <Nav tabs>
                        <NavItem className={this.state.activeTab !== '1' ? 'navSelected' : ''}>
                            <NavLink
                                onClick={() => {
                                    this.toggle('1');
                                }}
                                className="textNav">
                                Confirmados ({this.state.invitadosConfirmados.length})
                            </NavLink>
                        </NavItem>
                        <NavItem className={this.state.activeTab !== '2' ? 'navSelected' : ''}>
                            <NavLink
                                onClick={() => {
                                    this.toggle('2');
                                }}
                                className="textNav">
                                Pendientes de confirmación ({this.state.invitadosPendientes.length})
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <div hidden={!this.state.invitadosConfirmados.length}>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Nombre y Apellido</th>
                                            <th scope="col">Tipo Documento</th>
                                            <th scope="col">Documento</th>
                                            <th scope="col">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.invitadosConfirmados.map((inv) => {
                                            return (
                                                <tr className="table-light">
                                                    <th scope="row">{inv[0].Nombre + ' ' + inv[0].Apellido}</th>
                                                    <td>{inv[0].TipoDocumentoLabel}</td>
                                                    <td>{inv[0].Documento}</td>
                                                    <td>
                                                        <Button
                                                            bsStyle="warning"
                                                            fill
                                                            disabled={this.permiteAgregar()}
                                                            onClick={() => {
                                                                this.cancelarInvitacion(inv);
                                                            }}>
                                                            Cancelar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div hidden={this.state.invitadosConfirmados.length} className="row">
                                <h5>No existen invitaciones confirmadas</h5>
                            </div>
                        </TabPane>
                        <TabPane tabId="2">
                            <div hidden={!this.state.invitadosPendientes.length}>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Nombre y Apellido</th>
                                            <th scope="col">Tipo Documento</th>
                                            <th scope="col">Documento</th>
                                            <th scope="col">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.invitadosPendientes.map((inv) => {
                                            return (
                                                <tr className="table-light">
                                                    <th scope="row">{inv[0].Nombre + ' ' + inv[0].Apellido}</th>
                                                    <td>{inv[0].TipoDocumentoLabel}</td>
                                                    <td>{inv[0].Documento}</td>
                                                    <td>
                                                        <Button
                                                            bsStyle="success"
                                                            fill
                                                            disabled={this.permiteConfirmar()}
                                                            onClick={() => {
                                                                inv[0].Estado = true;
                                                                this.agregarInvitado(inv[0], inv[1]);
                                                                this.actualizar(inv[1], true);
                                                            }}>
                                                            Confirmar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div hidden={this.state.invitadosPendientes.length} className="row">
                                <h5>No existen invitaciones pendientes de confirmación</h5>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
            </div>
        );
    }
}

export default VisualizarReserva;
