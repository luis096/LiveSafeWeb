import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Ingreso from './Ingreso';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';

class PrincialIngreso extends Component {

    constructor() {
        super();
        this.state = {
            ingresos: [],
            invitadoTemp: [],
            idCountry: '',
            idEncargado: '',
            hora: '',
            estado: false,
            show: '',
            tipoDocumento: '',
            documento: '',
            descripcion: '',
            tipoD: [],
            busqueda: true,
            virgen: false,
            mensaje: '',
            observacion: false,
            tipoPersona: 'propietario'
        };
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscar = this.buscar.bind(this);
        this.buscarPersona = this.buscarPersona.bind(this);
    }

    async componentDidMount() {
        const {ingresos, tipoD} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Hora', 'desc').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    ingresos.push(
                        [doc.data(), doc.id]
                    );
                });
            });
        this.setState({ingresos});
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        this.setState({tipoD});
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    async buscar() {
        await this.buscarPersona();
        if (this.state.invitadoTemp.length == 0) {
            this.setState({mensaje: 'La persona no se encuentra registrada en el sistema.'});
        }
        await this.buscarEnIngresos();
        this.setState({busqueda: false});
    }

    buscarPersona() {
        const { invitadoTemp } = this.state;
        Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Propietarios')
            .get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (doc.data().Documento === this.state.documento &&
                    doc.data().TipoDocumento.id === this.state.tipoDocumento.value) {
                    invitadoTemp.push(doc.data(), doc.id);
                    this.setState({
                        virgen: false, mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                    });
                }
            });
        });
        if (invitadoTemp.length == 0) {
            Database.collection('Country').doc(localStorage.getItem('idCountry'))
                .collection('Invitados').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (doc.data().Documento === this.state.documento &&
                        doc.data().TipoDocumento.id === this.state.tipoDocumento.value) {
                        invitadoTemp.push(doc.data(), doc.id);
                        if (doc.data().Nombre != '') {
                            this.setState({
                                virgen: false, mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                            });
                        } else {
                            this.setState({
                                virgen: true, mensaje: 'Falta autentificar al visitante'
                            });
                        }
                    }
                });
            });
        }
        this.setState({invitadoTemp})
    }

    registrar() {
        const { ingresos } = this.state;
        let id = 0;
        let ingreso = {
            Nombre: this.state.invitadoTemp[0].Nombre,
            Apellido: this.state.invitadoTemp[0].Apellido,
            TipoDocumento: this.state.invitadoTemp[0].TipoDocumento,
            Documento: this.state.invitadoTemp[0].Documento,
            Hora: new Date(),
            Egreso: false,
            Estado: this.state.estado,
            Descripcion: this.state.descripcion,
            IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona'))
        };
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').add(ingreso).then(doc => id = doc.id);
        this.setState({
            show: false, tipoDocumento: '', documento: '',
            virgen: false, busqueda: true, invitadoTemp: [], mensaje: '', observacion: false
        });
        ingresos.push([ingreso, id]);
        this.setState({ingresos});
    }

    async buscarEnIngresos() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Hora', 'asc').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (doc.data().Documento === this.state.documento &&
                        doc.data().TipoDocumento.id === this.state.tipoDocumento.value && !doc.data().Egreso
                    ) {
                        this.setState({observacion: true});
                    } else if (doc.data().Documento === this.state.documento &&
                        doc.data().TipoDocumento.id === this.state.tipoDocumento.value && doc.data().Egreso) {
                        this.setState({observacion: false});
                    }

                });
            });
    }

    render() {
        const {show} = this.state;
        const handleClose = ()=>this.setState({
            show: false, tipoDocumento: '', documento: '',
            virgen: false, busqueda: true, invitadoTemp: [], mensaje: '', observacion: false
        });
        const handleShow = ()=> {
            this.setState({show: true});
            localStorage.setItem('editarInvitado', 'Ingreso');
            localStorage.setItem('idEncargado', this.state.idEncargado);
        };
        return (
            <div className="col-12">
                <legend><h3 className="row">Ingresos</h3></legend>
                <div className="row">
                    <div className="col-5 izquierda">
                        <button type="button" className="btn btn-primary" onClick={handleShow}>Nuevo Ingreso</button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Buscar persona</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label for="TipoDocumento"> Tipo Documento </label>
                                    <Select
                                        className="select-documento"
                                        classNamePrefix="select"
                                        value={this.state.tipoDocumento}
                                        isDisabled={!this.state.busqueda}
                                        isLoading={false}
                                        isClearable={true}
                                        isSearchable={true}
                                        options={this.state.tipoD}
                                        onChange={this.ChangeSelect.bind(this)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="NumeroDocumento"> Numero de Documento </label>
                                    <input type="document" className="form-control" placeholder="Document number"
                                           value={this.state.documento}
                                           onChange={this.ChangeDocumento}
                                           disabled={!this.state.busqueda}
                                    />
                                </div>
                                <div className="form-group">
                                    <label hidden={!this.state.observacion}>{'this.state.mensaje2'}</label>
                                    <div hidden={!this.state.observacion}>
                                        <textarea className="form-control" placeholder="Observacion"
                                                  value={this.state.descripcion}
                                                  onChange={this.ChangeDescripcion}
                                                  hidden={!this.state.observacion}
                                        ></textarea>
                                    </div>

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                {this.state.busqueda && (
                                    <div>
                                        <button variant="secondary" onClick={handleClose} class="btn btn-danger">
                                            Cancelar
                                        </button>
                                        <button variant="primary" onClick={this.buscar} class="btn btn-success">
                                            Buscar
                                        </button>
                                    </div>)
                                }
                                {!this.state.busqueda && (<>

                                        <div hidden={this.state.invitadoTemp.length == 0}>
                                            <label className=''>{this.state.mensaje}</label>
                                            <Link
                                                to={this.state.virgen ? ('editarInvitado/' + this.state.invitadoTemp[1]) : this.registrar}
                                                variant="primary"
                                                onClick={this.state.virgen ? this.autenticar : this.registrar}
                                                class="btn btn-success">
                                                {this.state.virgen ? 'Autentificar' : 'Registrar'}
                                            </Link>
                                        </div>
                                        <div hidden={this.state.invitadoTemp.length != 0}>
                                            <label className=''>{this.state.mensaje}</label>
                                            <Link to={'/altaInvitado'} type="button" className="btn btn-success">Nuevo
                                                Invitado</Link>
                                        </div>
                                    </>
                                )}
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-10 ">
                        <table className="table table-hover  ">
                            <thead>
                            <tr>
                                <th scope="col">Nombre y Apellido</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Persona</th>
                                <th scope="col">Fecha y Hora</th>
                                <th scope="col">Observacion</th>
                                <th scope="col">Cancelar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {

                                this.state.ingresos.map(ing=> {
                                        return (
                                            <tr className="table-light">
                                                <th scope="row">{ing[0].Nombre}, {ing[0].Apellido}</th>
                                                <td>{ing[0].Documento}</td>
                                                <td>{ing[0].Persona}</td>
                                                <td>{'sd'}</td>
                                                <td>{ing[0].Descripcion? 'Si' : '-'}</td>
                                                <td>{'cancelar'}</td>
                                            </tr>
                                        );
                                    }
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrincialIngreso;