import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Ingreso from './Ingreso';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import { paginador } from '../Paginador';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Pagination } from 'react-bootstrap';
import Datetime from 'react-datetime';


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
            tipoPersona: 'propietario',
            alert: null,
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}
        };
        this.hideAlert = this.hideAlert.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscar = this.buscar.bind(this);
        this.buscarPersona = this.buscarPersona.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const { tipoD } = this.state;
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

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeDesde(event) {
        this.setState({desde: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(new Date(event), this.state.hasta, true),
            errorDesde: validator.fechaRango(new Date(event), this.state.hasta, false)
        });
    }

    ChangeHasta(event) {
        this.setState({hasta: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(this.state.desde, new Date(event), false),
            errorDesde: validator.fechaRango(this.state.desde, new Date(event), true)
        });
    }

    async consultar(pagina, nueva) {
        let {ingresos} = this.state;

        if(!validator.isValid([this.errorNombre, this.state.errorDesde, this.state.errorHasta])){
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

        let con = await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Ingresos');

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

        if (this.state.desde) {
            con = con.where('FechaDesde', '>=', this.state.desde);
            total = total.where('FechaDesde', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('FechaDesde', '<=', this.state.hasta);
            total = total.where('FechaDesde', '<=', this.state.hasta);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
            total = total.where('Nombre', '==', this.state.nombre);
        }

        if (nueva) {
            await total.get().then((doc)=> {
                this.total = doc.docs.length;
            });
        }

        ingresos = [];
        let ultimo = null;
        let primero = null;
        await con.get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (!primero) {
                    primero = doc;
                }
                ultimo = doc;
                ingresos.push(
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

        this.setState({ingresos, numPagina: (pagina)});
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
        let refTipoDocumento = Database.doc('TipoDocumento/' + this.state.tipoDocumento.value);
        Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Propietarios')
            .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
            .get().then( querySnapshot => { querySnapshot.forEach(doc=> {
                if (doc.exists) {
                    invitadoTemp.push(doc.data(), doc.id);
                    this.setState({
                        virgen: false, mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                    });
                }
            })
        });
        if (invitadoTemp.length == 0) {
            Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Invitados')
                .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
                .get().then(querySnapshot => { querySnapshot.forEach(doc=> {
                    if (doc.exists) {
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
        this.setState({ingresos});
    }

    async buscarEnIngresos() {
        let refTipoDocumento = Database.doc('TipoDocumento/' + this.state.tipoDocumento.value);
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Hora', 'asc')
            .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
            .get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (!doc.data().Egreso) {
                        this.setState({observacion: true});
                    } else if (doc.data().Egreso) {
                        this.setState({observacion: false});
                    }
                });
            });
    }

    hideAlert() {
        this.setState({
            alert: null
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
                {this.state.alert}
                <div className="row izquierda">
                    <div className="col-5 izquierda">
                        <Button bsStyle="danger" fill wd onClick={handleShow}>Nuevo Ingreso</Button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Buscar persona</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label> Tipo Documento </label>
                                    <Select
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
                                    <label> Número de Documento </label>
                                    <input type="document" className="form-control" placeholder="Numero de Documento"
                                           value={this.state.documento}
                                           onChange={this.ChangeDocumento}
                                           disabled={!this.state.busqueda}
                                    />
                                </div>
                                <div className="form-group">
                                    <label hidden={!this.state.observacion}>
                                        La persona no registra una salida del barrio</label>
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
                                        <Button bsStyle="danger" fill wd onClick={handleClose}>Cancelar</Button>
                                        <Button bsStyle="success" fill wd onClick={this.buscar}>Buscar</Button>
                                    </div>)
                                }
                                {!this.state.busqueda && (<>
                                        <div hidden={this.state.invitadoTemp.length == 0}>
                                            <label>{this.state.mensaje}</label>
                                            <Link
                                                to={this.state.virgen ? ('editarInvitado/' + this.state.invitadoTemp[1]) : this.registrar}
                                                onClick={this.state.virgen ? this.autenticar : this.registrar}
                                                class="btn btn-success">
                                                {this.state.virgen ? 'Autentificar' : 'Registrar'}
                                            </Link>
                                        </div>
                                        <div hidden={this.state.invitadoTemp.length != 0}>
                                            <label>{this.state.mensaje}</label>
                                            <Link to={'/encargado/altaInvitado'} type="button" className="btn btn-success">Nuevo
                                                Invitado</Link>
                                        </div>
                                    </>
                                )}
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Filtros de busqueda</h5>
                        <div className='row'>
                            <div className="col-md-4 row-secction">
                                <label>Nombre</label>
                                <input className={this.errorNombre.error ? 'form-control error' : 'form-control'}
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre} placeholder="Nombre"/>
                                <label className='small text-danger'
                                       hidden={!this.errorNombre.error}>{this.errorNombre.mensaje}</label>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Fecha Desde</label>
                                <Datetime
                                    className={this.state.errorDesde.error ? 'has-error' : ''}
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    inputProps={{placeholder: 'Fecha Desde'}}
                                />
                                <label className='small text-danger'
                                       hidden={!this.state.errorDesde.error}>{this.state.errorDesde.mensaje}</label>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Fecha Hasta</label>
                                <Datetime
                                    className={this.state.errorHasta.error ? 'has-error' : ''}
                                    value={this.state.hasta}
                                    onChange={this.ChangeHasta}
                                    inputProps={{placeholder: 'Fecha Hasta'}}
                                />
                                <label className='small text-danger'
                                       hidden={!this.state.errorHasta.error}>{this.state.errorHasta.mensaje}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="izquierda">
                    <Button bsStyle="default" fill wd onClick={()=> {
                        // this.reestablecer();
                    }}>
                        Reestablecer
                    </Button>
                    <Button bsStyle="primary" fill wd onClick={()=> {
                        this.consultar(0, true);
                    }}>
                        Consultar
                    </Button>
                </div>

                <div className="card row" hidden={!this.state.ingresos.length}>
                    <h4 className="row">Ingresos ({this.total})</h4>
                    <div className="card-body">
                        <table className="table table-hover  ">
                            <thead>
                            <tr>
                                <th scope="col">Indice</th>
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
                                this.state.ingresos.map((ing, ind)=> {
                                    let hora = ing[0].Hora? new Date(ing[0].Hora.seconds * 1000): new Date();
                                    return (
                                        <tr className="table-light">
                                            <th scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                            <th scope="row">{ing[0].Nombre}, {ing[0].Apellido}</th>
                                            <td>{ing[0].Documento}</td>
                                            <td>{'-'}</td>
                                            <td>{ hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString() }</td>
                                            <td>{ing[0].Descripcion ? 'Si' : 'No'}</td>
                                            <td><Button bsStyle="warning" fill wd onClick={()=> {
                                                            console.log('cancelar')
                                                        }}>
                                                Cancelar
                                            </Button></td>
                                        </tr>
                                    );
                                    }
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center" hidden={!this.state.ingresos.length}>
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
                <div className="row card" hidden={this.state.ingresos.length}>
                    <div className="card-body">
                        <h4 className="row">No se encontraron resultados.</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrincialIngreso;