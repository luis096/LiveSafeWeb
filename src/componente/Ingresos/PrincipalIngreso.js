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
import { errorHTML } from '../Error';
import { operacion } from '../Operaciones';
import ReactExport from "react-data-export";
import GeneradorExcel from '../Reportes/GeneradorExcel';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class PrincialIngreso extends Component {

    constructor() {
        super();
        this.state = {
            ingresos: [],
            documento: '',
            tipoDocumento: '',
            apellido: '',
            descargar: false,
            tipoD: [],
            alert: null,
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}
        };
        this.hideAlert = this.hideAlert.bind(this);
        this.descargar = this.descargar.bind(this);
        this.obtenerConsulta = this.obtenerConsulta.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
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

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento = validator.numero(event.target.value);
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }


    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        this.errorApellido = validator.soloLetras(event.target.value);
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

        // let con = await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Ingresos');
        let con = this.obtenerConsulta(true);

        // let total = con;
        let total = this.obtenerConsulta(false);

        if (pagina > 0) {
            if (pagina > this.state.numPagina) {
                let ultimo = this.state.ultimo[this.state.numPagina];
                con = con.startAfter(ultimo);
            } else {
                let primero = this.state.primero[pagina];
                con = con.startAt(primero);
            }
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

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    reestablecer(){
        this.setState({
            ingresos: [],
            documento: '',
            tipoDocumento: '',
            nombre: '',
            apellido: '',
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}
        });
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
    }

    descargar(){
        let columnas = [
            {label:'Nombre' , value:'Nombre'},
            {label:'Apellido' , value:'Apellido'},
            {label:'Documento' , value:'Documento'},
            {label:'Observacion' , value:'Observacion'},
            ];
        let elementos = [];

        if (this.state.descargar){
            let con = this.obtenerConsulta(false)
            con.get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    elementos.push(doc.data());
                });
            });

            return (<GeneradorExcel elementos={elementos} estructura={columnas} pagina={'Ingresos'}
                                show={this.state.descargar}
                                ocultar={()=>this.setState({descargar:false})}/>)
        }
    }

    obtenerConsulta(conLimite){
        let con = Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Ingresos');
        if (conLimite){
            con = con.limit(paginador.getTamPagina());
        }

        if (this.state.desde) {
            con = con.where('Hora', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('Hora', '<=', this.state.hasta);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
        }
        if (this.state.apellido) {
            con = con.where('Apellido', '==', this.state.apellido);
        }
        if (this.state.documento) {
            con = con.where('Documento', '==', this.state.documento);
        }
        if (this.state.tipoDocumento && this.state.tipoDocumento.value) {
            let tipoDocumentoRef = operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);
            con = con.where('TipoDocumento', '==', tipoDocumentoRef);
        }

        return con;
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Ingresos</h3></legend>
                {this.state.alert}
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
                                <label>Tipo Documento</label>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    value={this.state.tipoDocumento}
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelect.bind(this)}
                                />
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Numero Documento</label>
                                <input className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento} placeholder="Nro Documento"
                                />
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-3 row-secction">
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
                            <div className="col-md-3 row-secction">
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
                {this.descargar()}
                <div className="card row" hidden={!this.state.ingresos.length}>
                    <div className="row">
                        <div className="col-md-6 row-secction">
                            <h4 style={{margin: '0px'}}>Ingresos ({this.total})</h4>
                        </div>
                        <div className="col-md-6 row-secction izquierda">
                            <Button bsStyle="success" fill onClick={()=> {
                                this.setState({descargar: true});
                            }}> <i className="pe-7s-download"/> </Button>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Indice</th>
                                <th scope="col">Nombre y Apellido</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Fecha y Hora</th>
                                <th scope="col">Observacion</th>
                                <th scope="col">Cancelar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.ingresos.map((ing, ind)=> {
                                        let hora = ing[0].Hora ? new Date(ing[0].Hora.seconds * 1000) : new Date();
                                        return (
                                            <tr className="table-light">
                                                <th scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                                <th scope="row">{ing[0].Nombre}, {ing[0].Apellido}</th>
                                                <td>{ing[0].Documento}</td>
                                                <td>{hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString()}</td>
                                                <td>{ing[0].Observacion ? 'Si' : 'No'}</td>
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