import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Link } from 'react-router-dom';


class VisualizarReserva extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            reserva: {},
            desde: null,
            hasta: null,
            invitadosConfirmados: [],
            invitadosPendientes: []
        };
        const url = this.props.location.pathname.split('/');
        this.idReserva = url[url.length - 1];
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

    async agregarInvitado(inv){
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').add({
            Estado: true,
            TipoDocumento: Database.doc('TipoDocumento/' + inv.TipoDocumento),
            Documento: inv.Documento,
            Grupo: this.state.reserva.Nombre,
            FechaAlta: new Date(),
            FechaDesde: this.state.desde,
            FechaHasta: this.state.hasta,
            IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + localStorage.getItem('idPersona'))
        });
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3> Visualizar reserva</h3></legend>
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
                        <label>{this.state.reserva.Estado}</label>
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
                <h3>Invitados de la reserva</h3>
                <div className="izquierda">
                    <Link to={"/invitado/" + this.idReserva}><Button bsStyle="primary" fill wd>
                    Agregar invitado
                </Button></Link>
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
                                                    <td><Button bsStyle="warning" fill wd onClick={()=> {
                                                        inv[0].Estado = false;
                                                        this.conexion.collection('Invitados').doc(inv[1]).set(inv[0]);
                                                        Database.collection('Country').doc(localStorage.getItem('idCountry'))
                                                            .collection('Invitados').doc(inv[1]).delete();
                                                        this.actualizar(inv[1], false);
                                                    }}>
                                                        cancelar
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
                                                    <td><Button bsStyle="success" fill wd onClick={()=> {
                                                        inv[0].Estado = true;
                                                        this.conexion.collection('Invitados').doc(inv[1]).set(inv[0]);
                                                        this.agregarInvitado(inv[0]);
                                                        this.actualizar(inv[1], true);
                                                    }}>
                                                        confirmar
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
                </div>

            </div>
        );
    }
}

export default VisualizarReserva;