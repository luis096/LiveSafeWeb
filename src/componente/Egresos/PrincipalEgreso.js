import React, { Component } from 'react';
import '../Style/Alta.css';
import '../Style/Estilo.css';
import { Database } from '../../config/config';
import Egresos from './Egresos';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import { paginador } from '../Paginador';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Pagination } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { operacion } from '../Operaciones';


class PrincialEgreso extends Component {

    constructor() {
        super();
        this.state = {
            egresos: [],
            invitadoTemp: [],
            idCountry: '',
            idEncargado: '',
            hora: '',
            show: '',
            tipoDocumento: '',
            documento: '',
            tipoD: [],
            busqueda: true,
            mensaje: '',
            mensaje2: '',
            descripcion: '',
            observacion: true,
            virgen: false,
            noExisteInvitado: false,
            nombre: '',
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
        this.seteoEgreso = this.seteoEgreso.bind(this);
        this.buscarPersonas = this.buscarPersonas.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
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

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
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
        let {egresos} = this.state;

        if (!validator.isValid([this.errorNombre, this.state.errorDesde, this.state.errorHasta])) {
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

        let con = await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Egresos');

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

        egresos = [];
        let ultimo = null;
        let primero = null;
        await con.get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (!primero) {
                    primero = doc;
                }
                ultimo = doc;
                egresos.push(
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

        this.setState({egresos, numPagina: (pagina)});
    }

    async buscar() {

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Hora', 'asc').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (doc.data().Documento === this.state.documento &&
                        doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value) {
                        this.setState({
                            mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                        });
                        if (!doc.data().Egreso) {

                            this.state.invitadoTemp = [doc.data(), doc.id];
                            this.setState({
                                observacion: true
                            });
                        } else {

                            this.state.invitadoTemp = [doc.data(), doc.id];
                            this.setState({
                                mensaje2: 'No se encuentra ingreso de ' + doc.data().Apellido + '. Indique observaciones.'
                            });
                            this.setState({observacion: false});
                        }


                    }
                });
            });
        if (!this.state.invitadoTemp.length) {
            //Buscar persona porque no esta regstrado un ingreso de la misma
            await this.buscarPersonas();
        }
        this.setState({busqueda: false});
    }

    async buscarPersonas() {
        let refTipoDocumento = Database.doc('TipoDocumento/' + this.state.tipoDocumento.value);
        Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Propietarios')
            .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
            .get().then( querySnapshot => { querySnapshot.forEach(doc=> {
                    if (doc.data().Documento === this.state.documento &&
                        doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value) {
                        this.state.invitadoTemp.push(doc.data(), doc.id);
                        this.setState({
                            mensaje2: 'No se encuentra ingreso del propietario ' + doc.data().Apellido + '. Indique observaciones.'
                        });
                        this.setState({observacion: false});
                    }
                });
            });
        if (!this.state.invitadoTemp.length) {
            Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Invitados')
                .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
                .get().then(querySnapshot => { querySnapshot.forEach(doc=> {
                    if (doc.exists) {
                        this.state.invitadoTemp.push(doc.data(), doc.id);
                        if (doc.data().Nombre != '') {
                            this.setState({
                                mensaje2: 'No se encuentra ingreso del invitado' + doc.data().Apellido + '. Indique observaciones.'
                            });
                            this.setState({observacion: false});
                        } else {
                            this.setState({virgen: true, mensaje: 'Falta autentificar el invitado'});
                        }
                    }
                    });
                });
        }

        if (!this.state.invitadoTemp.length && !this.state.virgen && this.state.observacion) {
            this.setState({noExisteInvitado: true});
        }
    }

    seteoEgreso() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').doc(this.state.invitadoTemp[1]).set(
            {
                Nombre: this.state.invitadoTemp[0].Nombre,
                Apellido: this.state.invitadoTemp[0].Apellido,
                TipoDocumento: this.state.invitadoTemp[0].TipoDocumento,
                Documento: this.state.invitadoTemp[0].Documento,
                Hora: this.state.invitadoTemp[0].Hora,
                Egreso: true,
                IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona'))
            });
    }

    async registrar() {

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Egresos').add({
                Nombre: this.state.invitadoTemp[0].Nombre,
                Apellido: this.state.invitadoTemp[0].Apellido,
                TipoDocumento: this.state.invitadoTemp[0].TipoDocumento,
                Documento: this.state.invitadoTemp[0].Documento,
                Hora: new Date(),
                Descripcion: this.state.descripcion,
                IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona'))
            });
        if (this.state.observacion) {
            this.seteoEgreso();
        }
        this.setState({
            show: false, tipoDocumento: '', documento: '',
            observacion: true, busqueda: true,
            invitadoTemp: [], mensaje: '', mensaje2: '',
            noExisteInvitado: false, virgen: false, descripcion: ''
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
            observacion: true, busqueda: true,
            invitadoTemp: [], mensaje: '', mensaje2: '',
            noExisteInvitado: false, virgen: false, descripcion: ''
        });
        const handleShow = ()=> {
            this.setState({show: true});
            localStorage.setItem('editarInvitado', 'Egreso');
            localStorage.setItem('idEncargado', this.state.idEncargado);
        };
        return (
            <div className="col-12">
                <legend><h3 className="row">Egresos</h3></legend>
                {this.state.alert}
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
                <div className="card row" hidden={!this.state.egresos.length}>
                    <h4 className="row">Egresos ({this.total})</h4>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Indice</th>
                                <th scope="col">Nombre y Apellido</th>
                                <th scope="col">Tipo Documento</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Fecha y Hora</th>
                                <th scope="col">Observacion</th>
                                <th scope="col">Cancelar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {

                                this.state.egresos.map((egr, ind)=> {
                                        let hora = validator.obtenerFecha(egr[0].Hora)

                                        return (
                                            <tr className="table-light">
                                                <th scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                                <td scope="row">{egr[0].Nombre}, {egr[0].Apellido}</td>
                                                <td>{operacion.obtenerDocumentoLabel(egr[0].TipoDocumento.id, this.state.tipoD)}</td>
                                                <td>{egr[0].Documento}</td>
                                                <td>{hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString()}</td>
                                                <td>{egr[0].Observacion ? 'Si' : 'No'}</td>
                                                <td><Button bsStyle="warning" fill wd onClick={()=> {
                                                    console.log('cancelar');
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
                <div className="text-center" hidden={!this.state.egresos.length}>
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
                <div className="row card" hidden={this.state.egresos.length}>
                    <div className="card-body">
                        <h4 className="row">No se encontraron resultados.</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrincialEgreso;