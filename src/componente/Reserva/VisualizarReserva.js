import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Link } from 'react-router-dom';
import { Modal, Alert, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { validator } from '../validator';
import {operacion} from "../Operaciones";
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";


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
            tipoD: []
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
        this.conexion = Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').doc(this.idReserva);
    }

    async componentDidMount() {
        var confirmados = [];
        var pendientes = [];
        await this.conexion.get().then(doc=> {
            this.setState({
                reserva: doc.data(),
                desde: new Date(doc.data().FechaDesde.seconds * 1000),
                hasta: new Date(doc.data().FechaHasta.seconds * 1000)
            });
        });
        this.setState({estado: validator.estadoReserva(this.state.desde, this.state.hasta, this.state.reserva.Cancelado)});
        await this.conexion.collection('Invitados').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (doc.exists) {
                    if (doc.data().Estado) {
                        confirmados.push([doc.data(), doc.id]);
                    } else {
                        pendientes.push([doc.data(), doc.id]);
                    }
                }
            });
        });
        this.setState({
            invitadosConfirmados: confirmados,
            invitadosPendientes: pendientes
        });
        Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
    };

    actualizar(id, pendiente) {
        const {invitadosPendientes, invitadosConfirmados} = this.state;
        if (pendiente) {
            invitadosPendientes.map(valor=> {
                if (valor[1] == id) {
                    invitadosPendientes.splice(invitadosPendientes.indexOf(valor), 1);
                    invitadosConfirmados.push(valor);
                }
            });
        } else {
            invitadosConfirmados.map(valor=> {
                if (valor[1] == id) {
                    invitadosConfirmados.splice(invitadosConfirmados.indexOf(valor), 1);
                    invitadosPendientes.push(valor);
                }
            });
        }
        this.setState({invitadosPendientes, invitadosConfirmados});
    }

    async agregarInvitado(invitado, id) {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('InvitacionesEventos').add({
                IdReserva: Database.doc('Country/' + localStorage.getItem('idCountry') +
                    '/Propietarios/' + localStorage.getItem('idPersona') + '/Reservas/' + this.idReserva),
                FechaDesde: this.state.desde,
                FechaHasta: this.state.hasta,
                TipoDocumento: invitado.TipoDocumento,
                Documento: invitado.Documento,
            });
        await this.conexion.collection('Invitados').doc(id).update({Estado: true});
    }

    modalAgregarInvitado() {

        this.setState({showModal: true});
    }

    async agregarNuevoInvitado() {
        const {invitadosConfirmados} = this.state;
        var invitado = [{
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Documento: this.state.documento,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            TipoDocumentoLabel: this.state.tipoDocumento.label,
            Estado: true,
            IdInvitado: ''
        }, ''];
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').doc(this.idReserva).collection('Invitados')
            .add(invitado[0]).then(doc=> {
            invitado[1] = doc.id;
            invitadosConfirmados.push(invitado);
            this.setState({invitadosConfirmados});
            this.agregarInvitado(invitado[0], doc.id);

        });
        this.setState({showModal: false});
    }

    async cancelarInvitacion(inv) {
        if (!inv) { return;}
        inv[0].Estado = false;
        let referenciaReserva = Database.doc('Country/' + localStorage.getItem('idCountry') +
            '/Propietarios/' + localStorage.getItem('idPersona') + '/Reservas/' + this.idReserva);
        let idEliminar = '';
        await this.conexion.collection('Invitados').doc(inv[1]).update({Estado: false});

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('InvitacionesEventos').where('IdReserva', '==', referenciaReserva)
            .where('Documento', '==', inv[0].Documento).where('TipoDocumento', '==', inv[0].TipoDocumento)
            .get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    idEliminar = doc.id;
                });
            });
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('InvitacionesEventos').doc(idEliminar).delete();
        this.actualizar(inv[1], false);
    }


    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeSelect(event) {
        this.setState({tipoDocumento: event});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    permiteAgregar() {
        return !(this.state.estado.Id == 0);
    }


    permiteConfirmar() {
        return (this.state.estado.Id == 2 || this.state.estado.Id == 3);
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row"> Visualizar reserva</h3></legend>
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
                <legend/>
                <h3 className="row">Invitados de la reserva</h3>
                <div className="izquierda">
                    <Button bsStyle="primary" fill wd onClick={this.modalAgregarInvitado}
                            disabled={this.permiteAgregar()}>
                        Agregar invitado
                    </Button>
                </div>
                <div className="row">
                    <div className="row-section">
                        <div className="card col-md-5">
                            <div className="card-header">
                                <h4>Confirmados - ({this.state.invitadosConfirmados.length})</h4>
                            </div>
                            <div className="card-body">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">Nombre y Apellido</th>
                                        <th scope="col">Tipo Doc.</th>
                                        <th scope="col">Documento</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Accion</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.invitadosConfirmados.map(inv=> {
                                            return (
                                                <tr className="table-light">
                                                    <th scope="row">{inv[0].Nombre + ', ' + inv[0].Apellido}</th>
                                                    <td>{inv[0].TipoDocumentoLabel}</td>
                                                    <td>{inv[0].Documento}</td>
                                                    <td>{'Confirmado'}</td>
                                                    <td><Button bsStyle="warning" fill  disabled={this.permiteAgregar()} onClick={() =>
                                                        {this.cancelarInvitacion(inv)}}>
                                                        X
                                                    </Button></td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row-section">
                        <div className="card col-md-5 col-md-offset-1">
                            <div className="card-header">
                                <h4>Pendientes de confirmación - ({this.state.invitadosPendientes.length})</h4>
                            </div>
                            <div className="card-body">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">Nombre y Apellido</th>
                                        <th scope="col">Tipo Doc.</th>
                                        <th scope="col">Documento</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Accion</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.invitadosPendientes.map(inv=> {
                                            return (
                                                <tr className="table-light">
                                                    <th scope="row">{inv[0].Nombre + ', ' + inv[0].Apellido}</th>
                                                    <td>{inv[0].TipoDocumentoLabel}</td>
                                                    <td>{inv[0].Documento}</td>
                                                    <td>{'Pendiente'}</td>
                                                    <td><Button bsStyle="success" fill disabled={this.permiteConfirmar()} onClick={()=> {
                                                        inv[0].Estado = true;
                                                        this.agregarInvitado(inv[0], inv[1]);
                                                        this.actualizar(inv[1], true);
                                                    }}>
                                                        +
                                                    </Button></td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Modal
                        show={this.state.showModal}
                        onHide={()=>this.setState({showModal: false})}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar un nuevo invitado</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="row-secction">
                                    <label> Nombre </label>
                                    <input type="name" className="form-control" placeholder="Name"
                                           value={this.state.nombre}
                                           onChange={this.ChangeNombre}/>
                                </div>
                                <div className="row-secction">
                                    <label> Apellido </label>
                                    <input type="family-name" className="form-control" placeholder="Surname"
                                           value={this.state.apellido}
                                           onChange={this.ChangeApellido}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="row-secction">
                                    <label> Tipo Documento </label>
                                    <Select
                                        className="select-documento"
                                        classNamePrefix="select"
                                        isDisabled={false}
                                        isLoading={false}
                                        isClearable={true}
                                        isSearchable={true}
                                        options={this.state.tipoD}
                                        onChange={this.ChangeSelect.bind(this)}
                                    />
                                </div>
                                <div className="row-secction">
                                    <label> Numero de Documento </label>
                                    <input type="document" className="form-control" placeholder="Document number"
                                           value={this.state.documento}
                                           onChange={this.ChangeDocumento}/>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                simple
                                onClick={()=>this.setState({showModal: false})}
                            >
                                Cerrar
                            </Button>
                            <Button
                                bsStyle="success"
                                fill
                                onClick={this.agregarNuevoInvitado}
                            >
                                Agregar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </div>
                <div className="row">
                    <div className="col-md-12 row-secction">
                        <h4>Enlace de invitación</h4>
                        <h5>{'/invitado/' + localStorage.getItem('idCountry') + '/' +
                        localStorage.getItem('idPersona') + '/' + this.idReserva}</h5>
                    </div>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}

export default VisualizarReserva;
