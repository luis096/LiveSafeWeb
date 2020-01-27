import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { NavLink } from 'react-router-dom';
import { Modal, Pagination } from 'react-bootstrap';
import Select from 'react-select';
import { paginador } from '../Paginador';
import { validator } from '../validator';
import SweetAlert from 'react-bootstrap-sweetalert';
import { errorHTML } from '../Error';

class PrincipalInvitados extends Component {

    constructor() {
        super();
        this.state = {
            invitados: [],
            showModal: false,
            reservas: [],
            reservaSeleccionada: '',
            invitadoReserva: '',
            fechaDesde: '',
            fechaHasta: '',
            tipoD: [],
            numPagina: -1,
            ultimo: [],
            primero: [],
            alert: null,
            nombre: '',
            apellido: '',
            estado: null,
            documento: '',
            invitadoCancelar: {},
            estadoLista: [{value: true, label: 'Activo'}, {value: false, label: 'Inactivo'}]
        };
        this.modalAgregarInvitado = this.modalAgregarInvitado.bind(this);
        this.agregarNuevoInvitado = this.agregarNuevoInvitado.bind(this);
        this.obtenerDocumentoLabel = this.obtenerDocumentoLabel.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeSelectEstado = this.ChangeSelectEstado.bind(this);
        this.consultar = this.consultar.bind(this);
        this.reestablecer = this.reestablecer.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const {tipoD} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        this.setState({tipoD});
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        this.errorApellido = validator.soloLetras(event.target.value);
    }

    ChangeSelectEstado(value) {
        this.setState({estado: value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento = validator.numero(event.target.value);
    }

    async consultar(pagina, nueva) {
        let {invitados} = this.state;
        if (!validator.isValid([this.errorNombre, this.errorDocumento, this.errorApellido])) {
            this.setState({
                alert: (
                    <SweetAlert
                        style={{display: 'block', marginTop: '-100px', position: 'center'}}
                        title="Error"
                        onConfirm={()=>this.hideAlert()}
                        onCancel={()=>this.hideAlert()}
                        confirmBtnBsStyle="danger"
                    >
                        Hay errores en los filtros.
                    </SweetAlert>
                )
            });
            return;
        }

        if (nueva) {
            this.setState({
                ultimo: [],
                primero: [],
                numPagina: -1
            });
        }
        if (this.cantidad.length && (this.cantidad.length <= pagina || pagina < 0)) {
            return;
        }

        let con = await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados');

        let total = con;

        if (pagina > 0) {
            if (pagina > this.state.numPagina) {
                let ultimo = this.state.ultimo[this.state.numPagina];
                con = con.startAfter(ultimo);
            } else {
                let primero = this.state.primero[pagina];
                con = con.startAt(primero);
            }
        }

        con = con.limit(paginador.getTamPagina());
        let ref = Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + localStorage.getItem('idPersona'));
        con = con.where('IdPropietario', '==', ref);
        total = total.where('IdPropietario', '==', ref);

        if (this.state.apellido) {
            con = con.where('Apellido', '==', this.state.apellido);
            total = total.where('Apellido', '==', this.state.apellido);
        }
        if (this.state.documento) {
            con = con.where('Documento', '==', this.state.documento);
            total = total.where('Documento', '==', this.state.documento);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
            total = total.where('Nombre', '==', this.state.nombre);
        }
        if (this.state.estado) {
            con = con.where('Estado', '==', this.state.estado.value);
            total = total.where('Estado', '==', this.state.estado.value);
        }

        if (nueva) {
            await total.get().then((doc)=> {
                this.total = doc.docs.length;
            });
        }

        invitados = [];
        let ultimo = null;
        let primero = null;
        await con.get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (!primero) {
                    primero = doc;
                }
                ultimo = doc;
                invitados.push(
                    [doc.data(), doc.id]
                );
            });
        });
        if ((pagina > this.state.numPagina || this.state.numPagina < 0) && !this.state.ultimo[pagina]) {
            this.state.ultimo.push(ultimo);
            this.state.primero.push(primero);
        }
        if (nueva) {
            this.cantidad = paginador.cantidad(this.total);
        }
        this.setState({invitados, numPagina: (pagina)});
    }

    reestablecer() {
        this.setState({
            invitados: [],
            numPagina: -1,
            ultimo: [],
            primero: [],
            nombre: '',
            apellido: '',
            estado: null,
            documento: ''
        });
        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
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
                if (!doc.data().Cancelado && validator.obtenerFecha(doc.data().FechaDesde) > new Date()) {
                    reservas.push(
                        {
                            value: doc.id, label: doc.data().Nombre,
                            fechaDesde: doc.data().FechaDesde, fechaHasta: doc.data().FechaHasta
                        }
                    );
                }

            });
        });
        this.setState({reservas, showModal: true});
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

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Mis invitados</h3></legend>
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Filtros de busqueda</h5>
                        <div className='row'>
                            <div className="col-md-3 row-secction">
                                <label>Nombre</label>
                                <input className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre} placeholder="Nombre"/>
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Apellido</label>
                                <input className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                       value={this.state.apellido}
                                       onChange={this.ChangeApellido} placeholder="Apellido"
                                />
                                {errorHTML.errorLabel(this.errorApellido)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Nro Documento</label>
                                <input className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento} placeholder="Nro Documento"
                                />
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Estado</label>
                                <Select
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    value = {this.state.estado}
                                    options={this.state.estadoLista}
                                    onChange={this.ChangeSelectEstado.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="izquierda">
                    <Button bsStyle="default" fill wd onClick={()=> {
                        this.reestablecer();
                    }}>
                        Reestablecer
                    </Button>
                    <Button bsStyle="primary" fill wd onClick={()=> {
                        this.consultar(0, true);
                    }}>
                        Consultar
                    </Button>
                </div>
                {this.state.alert}
                <div className="card row" hidden={!this.state.invitados.length}>
                    <h4 className="row">Invitados ({this.total})</h4>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Indice</th>
                                <th scope="col">Tipo Documento</th>
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
                                this.state.invitados.map((inv, ind)=> {
                                        return (
                                            <tr className="table-light">
                                                <th>{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                                <td>{this.obtenerDocumentoLabel(inv[0].TipoDocumento.id)}</td>
                                                <td>{inv[0].Documento}</td>
                                                <td>{inv[0].Nombre}, {inv[0].Apellido}</td>
                                                <td>{inv[0].Grupo}</td>
                                                <td>{inv[0].Estado ? 'Activo' : 'Inactivo'}</td>
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
                                                    <Button bsStyle="warning" fill wd>Editar</Button>
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
                <div className="text-center" hidden={!this.state.invitados.length}>
                    <Pagination className="pagination-no-border">
                        <Pagination.First onClick={()=>this.consultar((this.state.numPagina - 1), false)}/>

                        {
                            this.cantidad.map(num=> {
                                return (<Pagination.Item
                                    active={(num == this.state.numPagina)}>{num + 1}</Pagination.Item>);
                            })
                        }

                        <Pagination.Last onClick={()=>this.consultar((this.state.numPagina + 1), false)}/>
                    </Pagination>
                </div>
                <div className="row card" hidden={this.state.invitados.length}>
                    <div className="card-body">
                        <h4 className="row">No se encontraron resultados.</h4>
                    </div>
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