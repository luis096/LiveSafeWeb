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
import { constantes, operacion } from '../Operaciones';
import ReactExport from "react-data-export";
import GeneradorExcel from '../Reportes/GeneradorExcel';
import { columns } from '../Reportes/Columns';
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";



const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class PrincipalServicio extends Component {

    constructor() {
        super();
        this.state = {
            servicios: [],
            estado: '',
            estadosLista: [],
            nombre: '',
            dias: [false, false, false, false, false, false, false],
            descargar: false,
            alert: null,
            numPagina: -1,
            ultimo: [],
            primero: [],
        };
        this.notificationSystem = React.createRef();
        this.hideAlert = this.hideAlert.bind(this);
        this.descargar = this.descargar.bind(this);
        this.obtenerConsulta = this.obtenerConsulta.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
    }

    async componentWillMount() {
        this.setState({ estadosLista: constantes.EstadosServicioSelect })
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeSelect(value) {
        this.setState({estado: value});
    }

    ChangeDia(num) {
        let {dias} = this.state;
        dias[num] = !dias[num];
        this.setState(dias);
    }

    async consultar(pagina, nueva) {

        if (!validator.isValid([this.errorNombre])) {
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
            servicios: resultado.elementos,
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
            servicios: [],
            nombre: '',
            numPagina: -1,
            ultimo: [],
            primero: [],
            estado: '',
            dias: [false, false, false, false, false, false, false]
        });
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
    }

    descargar(){
        let columnas = columns.SERVICIOS;
        let elementos = [];

        if (this.state.descargar){
            let con = this.obtenerConsulta(false);
            let datos = {};
            con.get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    datos = doc.data();
                    datos.Estado = datos.Estado?'Disponible':'No Disponible';
                    datos.Disponibilidad = operacion.obtenerDisponibleString(datos.Disponibilidad);
                    elementos.push(datos);
                });
            });
            return (<GeneradorExcel elementos={elementos} estructura={columnas} pagina={'Servicios'}
                                    ocultar={()=>this.setState({descargar:false})}/>)
        }
    }

    obtenerConsulta(conLimite){
        let con = Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Servicios');
        if (conLimite){
            con = con.limit(paginador.getTamPagina());
        }

        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
        }
        if (this.state.estado && this.state.estado.label) {
            con = con.where('Estado', '==', this.state.estado.value);
        }

        return con;
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Servicios</h3></legend>
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
                                <label>Estado</label>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    value={this.state.estado}
                                    options={this.state.estadosLista}
                                    onChange={this.ChangeSelect.bind(this)}
                                />
                            </div>

                            {/*<div className="col-md-6 row-secction">*/}
                                {/*<div className="">*/}
                                    {/*<label>Días disponibles del servicio:</label>*/}
                                    {/*<div className="">*/}
                                        {/*<div className="row-secction col-md-1" style={{marginRight: '1%'}}>*/}
                                            {/*<p className="category">Lunes</p>*/}
                                            {/*<Switch*/}
                                                {/*onText="✔"*/}
                                                {/*offText="✘"*/}
                                                {/*value={this.state.dias[0]}*/}
                                                {/*onChange={()=> {*/}
                                                    {/*this.ChangeDia(0);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                        {/*<div className="row-secction col-md-1" style={{marginRight: '1%'}}>*/}
                                            {/*<p className="category">Martes</p>*/}
                                            {/*<Switch*/}
                                                {/*onText="✔"*/}
                                                {/*offText="✘"*/}
                                                {/*value={this.state.dias[1]}*/}
                                                {/*onChange={()=> {*/}
                                                    {/*this.ChangeDia(1);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                        {/*<div className="row-secction col-md-1" style={{marginRight: '1%'}}>*/}
                                            {/*<p className="category">Miercoles</p>*/}
                                            {/*<Switch*/}
                                                {/*onText="✔"*/}
                                                {/*offText="✘"*/}
                                                {/*value={this.state.dias[2]}*/}
                                                {/*onChange={()=> {*/}
                                                    {/*this.ChangeDia(2);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                        {/*<div className="row-secction col-md-1" style={{marginRight: '1%'}}>*/}
                                            {/*<p className="category">Jueves</p>*/}
                                            {/*<Switch*/}
                                                {/*onText="✔"*/}
                                                {/*offText="✘"*/}
                                                {/*value={this.state.dias[3]}*/}
                                                {/*onChange={()=> {*/}
                                                    {/*this.ChangeDia(3);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                        {/*<div className="row-secction col-md-1" style={{marginRight: '1%'}}>*/}
                                            {/*<p className="category">Viernes</p>*/}
                                            {/*<Switch*/}
                                                {/*onText="✔"*/}
                                                {/*offText="✘"*/}
                                                {/*value={this.state.dias[4]}*/}
                                                {/*onChange={()=> {*/}
                                                    {/*this.ChangeDia(4);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                        {/*<div className="row-secction col-md-1" style={{marginRight: '1%'}}>*/}
                                            {/*<p className="category">Sabado</p>*/}
                                            {/*<Switch*/}
                                                {/*onText="✔"*/}
                                                {/*offText="✘"*/}
                                                {/*value={this.state.dias[5]}*/}
                                                {/*onChange={()=> {*/}
                                                    {/*this.ChangeDia(5);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                        {/*<div className="row-secction col-md-1" style={{marginRight: '1%'}}>*/}
                                            {/*<p className="category">Domingo</p>*/}
                                            {/*<Switch*/}
                                                {/*onText="✔"*/}
                                                {/*offText="✘"*/}
                                                {/*value={this.state.dias[6]}*/}
                                                {/*onChange={()=> {*/}
                                                    {/*this.ChangeDia(6);*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        </div>


                    </div>
                </div>

                <div className="izquierda">
                    <Button bsStyle="default" style={{marginRight: "10px"}} fill wd onClick={()=> {
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
                <div className="card row" hidden={!this.state.servicios.length}>
                    <div className="row">
                        <div className="col-md-6 row-secction">
                            <h4 style={{margin: '0px'}}>Servicios ({this.total})</h4>
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
                                <th scope="col">Nombre</th>
                                <th scope="col">Disponibilidad</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Editar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.servicios.map((ser, ind)=> {
                                        let estado = ser[0].Estado?'Disponible':'No disponible';
                                        let disponibilidad = operacion.obtenerDisponibleString(ser[0].Disponibilidad);
                                        let editar = '/admin/editarServicio/' + ser[1];
                                        return (
                                            <tr className="table-light">
                                                <th scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                                <td>{ser[0].Nombre}</td>
                                                <td>{disponibilidad}</td>
                                                <td>{estado}</td>
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
                <div className="text-center" hidden={!this.state.servicios.length}>
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
                <div className="row card" hidden={this.state.servicios.length}>
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

export default PrincipalServicio;
