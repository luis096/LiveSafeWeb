import React, { Component } from 'react';
import { Database } from '../../config/config';
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
import { columns } from '../Reportes/Columns';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;



class PrincipalEncargado extends Component {

    constructor() {
        super();
        this.state = {
            encargados: [],
            documento: '',
            tipoDocumento: '',
            apellido: '',
            nombre: '',
            descargar: false,
            tipoD: [],
            alert: null,
            numPagina: -1,
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
        let tiposDocumento = await operacion.obtenerTiposDocumento();
        this.setState({tipoD: tiposDocumento});
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

        if (this.cantidad.length && (this.cantidad.length <= pagina || pagina < 0)) {
            return;
        }

        let con = this.obtenerConsulta(true);
        let total = this.obtenerConsulta(false);

        let resultado = await paginador.paginar(con, total, this.total, nueva,this.cantidad, this.state.numPagina,
            pagina,this.state.primero, this.state.ultimo);

        this.cantidad = resultado.cantidad;
        this.total = resultado.total;

        this.setState({
            encargados: resultado.elementos,
            numPagina: (pagina),
            primero: resultado.primerDoc,
            ultimo: resultado.ultimoDoc
        });
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    reestablecer(){
        this.setState({
            encargados: [],
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
        let columnas = columns.ENCARGADOS;
        let elementos = [];

        if (this.state.descargar){
            let con = this.obtenerConsulta(false);
            let datos = {};
            con.get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    datos = doc.data();
                    datos.FechaAlta = validator.obtenerFecha(doc.data().FechaAlta).toLocaleString();
                    datos.TipoDocumento = operacion.obtenerDocumentoLabel(datos.TipoDocumento.id, this.state.tipoD);
                    elementos.push(datos);
                });
            });
            return (<GeneradorExcel elementos={elementos} estructura={columnas} pagina={'Encargados'}
                                    ocultar={()=>this.setState({descargar:false})}/>)
        }
    }

    obtenerConsulta(conLimite){
        let con = Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Encargados');
        if (conLimite){
            con = con.limit(paginador.getTamPagina());
        }

        if (this.state.desde) {
            con = con.where('FechaAlta', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('FechaAlta', '<=', this.state.hasta);
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
                <legend><h3 className="row">Encargados</h3></legend>
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
                <div className="card row" hidden={!this.state.encargados.length}>
                    <div className="row">
                        <div className="col-md-6 row-secction">
                            <h4 style={{margin: '0px'}}>Encargados ({this.total})</h4>
                        </div>
                        <div className="col-md-6 row-secction izquierda">
                            <Button bsStyle="success" fill onClick={()=> {
                                this.setState({descargar: true});
                            }}>Descargar</Button>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Indice</th>
                                <th scope="col">Nombre y Apellido</th>
                                <th scope="col">Tipo Documento</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Legajo</th>
                                <th scope="col">Celular</th>
                                <th scope="col">Fecha de Alta</th>
                                <th scope="col">Editar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.encargados.map((enc, ind)=> {
                                        let tipoDocumento = operacion.obtenerDocumentoLabel(enc[0].TipoDocumento.id, this.state.tipoD);
                                        let hora = validator.obtenerFecha(enc[0].FechaAlta);
                                        let editar = '/admin/editarEncargado/' + enc[1];
                                        return (
                                            <tr className="table-light">
                                                <th scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                                <td>{enc[0].Nombre}, {enc[0].Apellido}</td>
                                                <td>{tipoDocumento}</td>
                                                <td>{enc[0].Documento}</td>
                                                <td>{enc[0].Legajo}</td>
                                                <td>{enc[0].Celular}</td>
                                                <td>{hora.toLocaleString()}</td>
                                                <td><Link to={editar}><Button bsStyle="warning" fill wd>
                                                    Editar
                                                </Button></Link></td>
                                            </tr>
                                        );
                                    }
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center" hidden={!this.state.encargados.length}>
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
                <div className="row card" hidden={this.state.encargados.length}>
                    <div className="card-body">
                        <h4 className="row">No se encontraron resultados.</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrincipalEncargado;