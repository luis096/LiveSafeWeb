import React, { Component } from 'react';
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
import { columns } from '../Reportes/Columns';
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";


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
        this.notificationSystem = React.createRef();
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
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
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

        if (!validator.isValid([this.errorNombre, this.state.errorDesde, this.state.errorHasta])) {
            this.setState({
                alert: (
                    <SweetAlert
                        style={{display: 'block', marginTop: '-100px', position: 'center'}}
                        title="Error"
                        onConfirm={()=>this.hideAlert()}
                        onCancel={()=>this.hideAlert()}
                        confirmBtnBsStyle="danger"
                        openAnim
                        closeAnim
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
            ingresos: resultado.elementos,
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
        let columnas = columns.INGRESOS;
        let elementos = [];

        if (this.state.descargar){
            let con = this.obtenerConsulta(false)
            let datos = {};
            con.get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    datos = doc.data();
                    datos.Hora = validator.obtenerFecha(doc.data().Hora).toLocaleString();
                    datos.TipoDocumento = operacion.obtenerDocumentoLabel(datos.TipoDocumento.id, this.state.tipoD);
                    datos.Tipo = datos.IdPropietario? 'Invitado':'Propietario';
                    elementos.push(datos);
                });
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
            return (<GeneradorExcel elementos={elementos} estructura={columnas} pagina={'Ingresos'}
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
                        <h5 className="row">Filtros de búsqueda </h5>
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
                                <label>Número de Documento</label>
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
                    <Button bsStyle="default" style={{marginRight: "10px"}} fill wd onClick={()=> {
                         this.reestablecer();
                    }}>
                        Restablecer
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
                        <div className="col-md-6 title row-secction">
                            <h4 style={{margin: '0px'}}>Ingresos ({this.total})</h4>
                        </div>
                        <div className="col-md-6 row-secction btnDescarga">
                            <Button bsStyle="success" fill onClick={()=> {
                                this.setState({descargar: true});
                            }}>Descargar</Button>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th  style={{textAlign:'center'}} scope="col">Indice</th>
                                <th  style={{textAlign:'center'}} scope="col">Nombre y Apellido</th>
                                <th  style={{textAlign:'center'}} scope="col">Documento</th>
                                <th  style={{textAlign:'center'}} scope="col">Fecha y Hora</th>
                                <th  style={{textAlign:'center'}} scope="col">Observacion</th>
                                <th  style={{textAlign:'center'}} scope="col">Cancelar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.ingresos.map((ing, ind)=> {
                                        let hora = ing[0].Hora ? new Date(ing[0].Hora.seconds * 1000) : new Date();
                                        return (
                                            <tr className="table-light">
                                                <th  style={{textAlign:'center'}} scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                                <th  style={{textAlign:'center'}} scope="row">{ing[0].Nombre}, {ing[0].Apellido}</th>
                                                <td style={{textAlign:'center'}} >{ing[0].Documento}</td>
                                                <td style={{textAlign:'center'}} >{hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString()}</td>
                                                <td style={{textAlign:'center'}} >{ing[0].Observacion ? 'Si' : 'No'}</td>
                                                <td style={{textAlign:'center'}} ><Button bsStyle="warning" fill wd onClick={()=> {
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
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}

export default PrincialIngreso;
