import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { NavLink } from 'react-router-dom';
import { Modal, Pagination } from 'react-bootstrap';
import Select from 'react-select';
import { paginador } from '../Paginador';
import { validator } from '../validator';
import { filtros } from '../Filtros.js';
import SweetAlert from 'react-bootstrap-sweetalert';

class PrincipalInvitados extends Component {

    constructor() {
        super();
        this.state = {
            invitados: [],
            invitadosFiltrados: [],
            invitadosPaginados: [],
            idPropietario: '',
            idCountry: '',
            showModal: false,
            reservas: [],
            reservaSeleccionada: '',
            invitadoReserva: '',
            fechaDesde: '',
            fechaHasta: '',
            tipoD: [],
            numPagina: 0,
            alert: null,
            nombre: null,
            apellido: null,
            estado: null,
            documento: null,
            invitadoCancelar: {}
        };
        this.modalAgregarInvitado = this.modalAgregarInvitado.bind(this);
        this.agregarNuevoInvitado = this.agregarNuevoInvitado.bind(this);
        this.obtenerDocumentoLabel = this.obtenerDocumentoLabel.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeSelectEstado = this.ChangeSelectEstado.bind(this);
        this.paginar = this.paginar.bind(this);
        this.consultar = this.consultar.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.cantidad = [];
    }

    async componentDidMount() {
        const {invitados} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (doc.data().IdPropietario.id == localStorage.getItem('idPersona')) {
                        this.state.invitados.push(
                            [doc.data(), doc.id]
                        );
                    }

                });
            });
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        this.setState({invitados, invitadosFiltrados: invitados});
        this.cantidad = paginador.cantidad(this.state.invitadosFiltrados.length);
        this.paginar(0, invitados);
    }

    paginar(pagina, elementos) {
        let paginaElementos = elementos || this.state.invitadosFiltrados;
        let resultado = paginador.paginar(pagina, paginaElementos);
        this.setState({invitadosPaginados: resultado.Elementos, numPagina: resultado.NumPagina});
    }

    modalAgregarInvitado() {
        const {reservas} = this.state;
        if (reservas.length) {
            this.setState({showModal: true});
            return;
        }
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').orderBy('FechaDesde', 'desc').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                reservas.push(
                    {
                        value: doc.id, label: doc.data().Nombre,
                        fechaDesde: doc.data().FechaDesde, fechaHasta: doc.data().FechaHasta
                    }
                );
            });
        });
        this.setState({reservas});
        this.setState({showModal: true});
    }

    agregarNuevoInvitado() {
        this.state.invitadoReserva[0].FechaDesde = this.state.reservaSelceccionada.fechaDesde;
        this.state.invitadoReserva[0].FechaHasta = this.state.reservaSelceccionada.fechaHasta;

        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').doc(this.state.invitadoReserva[1]).set(this.state.invitadoReserva[0]);

        let invitado = {
            Nombre: this.state.invitadoReserva[0].Nombre,
            Apellido: this.state.invitadoReserva[0].Apellido,
            Documento: this.state.invitadoReserva[0].Documento,
            TipoDocumento: this.state.invitadoReserva[0].TipoDocumento,
            TipoDocumentoLabel: this.obtenerDocumentoLabel(this.state.invitadoReserva[0].TipoDocumento.id),
            Estado: true,
            IdInvitado: this.state.invitadoReserva[1]
        };

        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').doc(this.state.reservaSelceccionada.value).collection('Invitados')
            .add(invitado);

        this.setState({showModal: false});
    }

    obtenerDocumentoLabel(id) {
        let label = null;
        this.state.tipoD.map(doc=> {
            if (doc.value == id) {
                label = doc.label;
            }
        });
        return label;
    }

    ChangeSelect(event) {
        this.setState({reservaSelceccionada: event});
    }

    cancelar(inv) {
        inv[0].Estado = !inv[0].Estado;
        this.setState({
            invitadoCancelar: inv,
            alert: (
                <SweetAlert
                    warning
                    style={{display: 'block', marginTop: '-100px', position: 'center'}}
                    title="¿Estas seguro?"
                    onConfirm={()=>this.successDelete()}
                    onCancel={()=>this.cancelDetele()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                    confirmBtnText="Si, estoy seguro"
                    cancelBtnText="Cancelar"
                    showCancel
                >
                    ¿Esta seguro de que desea eliminar invitado?
                </SweetAlert>
            )
        });
    }

    successDelete() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').doc(this.state.invitadoCancelar[1]).set(this.state.invitadoCancelar[0]);
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: 'block', marginTop: '-100px', position: 'center'}}
                    title="Invitado Eliminado"
                    onConfirm={()=>this.hideAlert()}
                    onCancel={()=>this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    El invitado se elimino correctamente
                </SweetAlert>
            )
        });
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    cancelDetele() {
        this.setState({
            alert: (
                <SweetAlert
                    danger
                    style={{display: 'block', marginTop: '-100px', position: 'center'}}
                    title="Se cancelo la operacion"
                    onConfirm={()=>this.hideAlert()}
                    onCancel={()=>this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    El invitado no fue eliminado.
                </SweetAlert>
            )
        });
    }

    async consultar() {
        let resultado = this.state.invitados;
        const {nombre, apellido, documento, estado} = this.state;
        if (nombre && nombre != ''){
            resultado = filtros.filtroNombre(resultado, nombre)
        }
        if (apellido && apellido != ''){
            resultado = filtros.filtroApellido(resultado, apellido)
        }
        if (estado && estado.value != null){
            resultado = filtros.filtroEstado(resultado, estado.value)
        }
        if (documento && documento != ''){
            resultado = filtros.filtroDocumento(resultado, documento)
        }
        this.setState({invitadosFiltrados: resultado})
        this.cantidad = paginador.cantidad(resultado.length);
        await this.paginar(0, resultado)
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeSelectEstado(value) {
        this.setState({estado: value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Mis invitados</h3></legend>
                <div className="row">
                    <h5>Filtros de busqueda</h5>
                    <div className="col-md-3 row-secction">
                        <label>Nombre</label>
                        <input className="form-control" value={this.state.nombre}
                               onChange={this.ChangeNombre}
                        />
                    </div>
                    <div className="col-md-3 row-secction">
                        <label>Apellido</label>
                        <input className="form-control" value={this.state.apellido}
                               onChange={this.ChangeApellido}
                        />
                    </div>
                    <div className="col-md-3 row-secction">
                        <label>Nro Documento</label>
                        <input className="form-control" value={this.state.documento}
                               onChange={this.ChangeDocumento}
                        />
                    </div>
                    <div className="col-md-3 row-secction">
                        <label>Estado</label>
                        <Select
                            classNamePrefix="select"
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            options={[{value: 1, label: 'Activo'}, {value: 0, label: 'Inactivo'}]}
                            onChange={this.ChangeSelectEstado.bind(this)}
                        />
                    </div>
                </div>
                <div className="izquierda">
                    <Button bsStyle="info" fill wd onClick={this.consultar}>
                        Consultar
                    </Button>
                </div>
                {this.state.alert}
                <div className="card row">
                    <h4 className="row">Invitados ({this.state.invitadosFiltrados.length})</h4>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Documento</th>
                                <th scope="col">Apellido y Nombre</th>
                                <th scope="col">Grupo</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Invitar a Evento</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.invitadosPaginados.map(inv => {
                                        return (
                                            <tr className="table-light">
                                                <th>{inv[0].Documento}</th>
                                                <td>{inv[0].Nombre}, {inv[0].Apellido}</td>
                                                <td>{inv[0].Grupo}</td>
                                                <td> {inv[0].Estado ? 'Activo' : 'Inactivo'}</td>
                                                <td><Button bsStyle="info" fill wd
                                                            disabled={!inv[0].Nombre} onClick={()=> {
                                                    this.setState({invitadoReserva: inv});
                                                    this.modalAgregarInvitado();
                                                }}>Invitar</Button></td>
                                                <td><NavLink
                                                    to={'editarInvitado/' + inv[1]}
                                                    className="nav-link"
                                                    activeClassName="active"
                                                >
                                                    <Button bsStyle="warning" fill wd
                                                            disabled={!inv[0].Nombre}>Editar</Button>
                                                </NavLink></td>
                                                <td><Button bsStyle="danger" fill wd onClick={()=> {
                                                    this.cancelar(inv);
                                                }}>Eliminar</Button></td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center">
                    <Pagination className="pagination-no-border">
                        <Pagination.First onClick={()=>this.paginar(0)}/>

                        {
                            this.cantidad.map(num=> {
                                return (<Pagination.Item onClick={()=>this.paginar(num)}
                                                         active={(num == this.state.numPagina)}>{num + 1}</Pagination.Item>);
                            })
                        }

                        <Pagination.Last onClick={()=>this.paginar(this.cantidad.length - 1)}/>
                    </Pagination>
                </div>

                <Modal
                    show={this.state.showModal}
                    onHide={()=>this.setState({showModal: false})}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Invitar a evento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label> Reservas </label>
                        <Select
                            classNamePrefix="select"
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            options={this.state.reservas}
                            onChange={this.ChangeSelect.bind(this)}
                        />
                        <br/>
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
        );
    }
}

export default PrincipalInvitados;