import React, { Component } from 'react';
import { Database } from '../../config/config';
import '../Style/Alta.css';
import { Link } from 'react-router-dom';
import Country from './Country';
import SweetAlert from 'react-bootstrap-sweetalert';
import Datetime from 'react-datetime';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Pagination } from 'react-bootstrap';
import { paginador } from '../Paginador';
import { validator } from '../validator';
import { errorHTML } from '../Error';
import { style } from "../../variables/Variables"
import NotificationSystem from "react-notification-system";
import {operacion} from "../Operaciones";


class PrincipalCountry extends Component {

    constructor() {
        super();
        this.state = {
            barrios: [],
            nombre: '',
            titular: '',
            alert: null,
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            numPagina: -1,
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}
        };
        this.notificationSystem = React.createRef();

        this.hideAlert = this.hideAlert.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
        this.errorTitular = {error: false, mensaje: ''};
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
        this.errorTitular = validator.soloLetras(event.target.value);
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
        let {barrios} = this.state;

        if (!validator.isValid([this.errorNombre, this.errorTitular, this.state.errorDesde, this.state.errorHasta])) {
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

        let con = await Database.collection('Country');

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
            con = con.where('FechaAlta', '>=', this.state.desde);
            total = total.where('FechaAlta', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('FechaAlta', '<=', this.state.hasta);
            total = total.where('FechaAlta', '<=', this.state.hasta);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
            total = total.where('Nombre', '==', this.state.nombre);
        }
        if (this.state.titular) {
            con = con.where('Titular', '==', this.state.titular);
            total = total.where('Titular', '==', this.state.titular);
        }

        if (nueva) {
            await total.get().then((doc)=> {
                this.total = doc.docs.length;
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        }

        barrios = [];
        let ultimo = null;
        let primero = null;
        await con.get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (!primero) {
                    primero = doc;
                }
                ultimo = doc;
                barrios.push(
                    [doc.data(), doc.id]
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });

        if ((pagina > this.state.numPagina || this.state.numPagina < 0) && !this.state.ultimo[pagina]) {
            this.state.ultimo.push(ultimo);
            this.state.primero.push(primero);
        }
        if (nueva) {
            this.cantidad = paginador.cantidad(this.total);
        }

        this.setState({barrios, numPagina: (pagina)});
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    reestablecer() {
        this.setState({
            barrios: [],
            nombre: '',
            titular: '',
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
        this.errorTitular = {error: false, mensaje: ''};
    }


    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Country</h3></legend>
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
                                <label>Titular</label>
                                <input className={errorHTML.classNameError(this.errorTitular, 'form-control')}
                                       value={this.state.titular}
                                       onChange={this.ChangeTitular} placeholder="Apellido"
                                />
                                {errorHTML.errorLabel(this.errorTitular)}
                            </div>
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
                    <Button bsStyle="default"  style={{marginRight: "10px"}}  fill wd onClick={()=> {
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
                <div className="card row" hidden={!this.state.barrios.length}>
                    <h4 className="row">Countries ({this.total})</h4>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th  style={{textAlign:'center'}} scope="col">Indice</th>
                                <th style={{textAlign:'center'}}  scope="col">Nombre</th>
                                <th style={{textAlign:'center'}}  scope="col">Titular</th>
                                <th  style={{textAlign:'center'}} scope="col">Calle y Número</th>
                                <th  style={{textAlign:'center'}} scope="col">Celular</th>
                                <th  style={{textAlign:'center'}} scope="col">Fecha Alta</th>
                                <th style={{textAlign:'center'}}  scope="col">Editar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.barrios.map((bar, ind)=> {
                                        let hora = validator.obtenerFecha(bar[0].FechaAlta);
                                        let editar = '/root/editarCountry/' + bar[1];
                                        return (
                                            <tr className="table-light">
                                                <th  style={{textAlign:'center'}} scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                                <td style={{textAlign:'center'}} >{bar[0].Nombre}</td>
                                                <td style={{textAlign:'center'}} >{bar[0].Titular}</td>
                                                <td style={{textAlign:'center'}} >{bar[0].Calle + ' ' + bar[0].Numero}</td>
                                                <td style={{textAlign:'center'}} >{bar[0].Celular}</td>
                                                <td style={{textAlign:'center'}} >{hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString()}</td>
                                                <td style={{textAlign:'center'}} ><Link to={editar}><Button bsStyle="warning" fill wd>
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
                <div className="text-center" hidden={!this.state.barrios.length}>
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
                <div className="row card" hidden={this.state.barrios.length}>
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

export default PrincipalCountry;
