import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Ingreso from './Ingreso';
import { Link } from 'react-router-dom';
import {Modal} from 'react-bootstrap';
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
        this.actualizar = this.actualizar.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscar = this.buscar.bind(this);
        this.buscarPersona = this.buscarPersona.bind(this);
    }

    async componentDidMount() {
        const {ingresos} = this.state;

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    this.state.ingresos.push(
                        [doc.data(), doc.id]
                    );
                });
            });
        this.setState({ingresos});
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
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
        Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Propietarios')
            .get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (doc.data().Documento === this.state.documento &&
                    doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value) {
                    this.state.invitadoTemp.push(doc.data(), doc.id);
                    this.setState({
                        virgen: false, mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                    });
                }
            });
        });
        if(this.state.invitadoTemp.length == 0){
                Database.collection('Country').doc(localStorage.getItem('idCountry'))
                    .collection('Invitados').get().then(querySnapshot=> {
                        querySnapshot.forEach(doc=> {
                            if (doc.data().Documento === this.state.documento &&
                                doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value) {
                                this.state.invitadoTemp.push(doc.data(), doc.id);
                                if (doc.data().Nombre != '') {
                                    this.setState({
                                        virgen: false, mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                                    });
                                } else {
                                    this.setState({
                                        virgen: true, mensaje: 'Falta autentificar visitante'
                                    });
                                }
                            }
                        });
                    });
        }}

    registrar() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').add({
            Nombre: this.state.invitadoTemp[0].Nombre,
            Apellido: this.state.invitadoTemp[0].Apellido,
            TipoDocumento: this.state.invitadoTemp[0].TipoDocumento,
            Documento: this.state.invitadoTemp[0].Documento,
            Hora: new Date(),
            Egreso: false,
            Estado: this.state.estado,
            Descripcion: this.state.descripcion,
            IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona'))
        });
        this.setState({
            show: false, tipoDocumento: '', documento: '',
            virgen: false, busqueda: true, invitadoTemp: [], mensaje: '', observacion: false
        });
        this.setState({ingresos: []});
        this.render();
    }


    async buscarEnIngresos() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Hora', 'asc').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (doc.data().Documento === this.state.documento &&
                        doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value && !doc.data().Egreso
                    ) {
                        this.setState({observacion: true});
                    } else if (doc.data().Documento === this.state.documento &&
                        doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value && doc.data().Egreso) {
                        this.setState({observacion: false});
                    }

                });
            });
    }


    actualizar(id) {
        const {ingresos} = this.state;
        this.state.ingresos.map(valor=> {
            if (valor[1] == id) {
                ingresos.splice(ingresos.indexOf(valor), 1);
            }
        });
        this.setState({ingresos});
        this.render();
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

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Ingresos</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className="mr-sm-2 borde-button" control de formulario tipo="texto"
                               placeholder="Buscar"/>
                        <button type="button" className="btn btn-primary"
                                onClick={handleShow}
                        >Nuevo Ingreso
                        </button>
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

                    <div className="col-md-1"></div>
                    <div className="col-md-10 ">

                        <br></br>

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

                                this.state.ingresos.map(ingresos=> {
                                        return (

                                            <Ingreso
                                                idIngreso={ingresos[1]}
                                                nombre={ingresos[0].Nombre}
                                                apellido={ingresos[0].Apellido}

                                                documento={ingresos[0].Documento}
                                                descripcion={ingresos[0].Descripcion}
                                                hora={ingresos[0].Hora}
                                                act={this.actualizar}
                                            >
                                            </Ingreso>
                                        );
                                    }
                                )
                            }

                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div>
                    < hr className="my-4"></hr>
                </div>
                <div className="espacio"></div>
            </div>
        );
    }
}

export default PrincialIngreso;