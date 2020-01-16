import React, { Component } from 'react';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { paginador } from '../Paginador';
import { Pagination } from 'react-bootstrap';
import { validator } from '../validator';
import Select from 'react-select';
import Datetime from 'react-datetime';

class PrincipalReserva extends Component {

    constructor() {
        super();
        this.state = {
            reservas: [],
            reservasFiltradas: [],
            reservasPaginados: [],
            idPropietario: '',
            idCountry: '',
            alert: null,
            numPagina: 0,
            reservaCancelar: [],
            nombre: '',
            servicio: '',
            serviciosLista: [],
            estado: null,
            desde: null,
            hasta: null,
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}

        };
        this.hideAlert = this.hideAlert.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.paginar = this.paginar.bind(this);
        this.cantidad = [];
        this.errorNombre = {error: false, mensaje: ''};
        this.errorServicio = {error: false, mensaje: ''};
    }

    ChangeSelectEstado(value) {
        this.setState({estado: value});
    }

    ChangeServicio(event) {
        this.setState({servicio: event});
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

    async componentDidMount() {
        const {reservas, serviciosLista} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    serviciosLista.push(
                        {value: doc.id, label: doc.data().Nombre}
                    );
                });
            });
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').orderBy('FechaDesde', 'desc').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    reservas.push(
                        [doc.data(), doc.id]
                    );

                });
            });
        this.setState({reservas, serviciosLista, reservasFiltradas: reservas});
        this.cantidad = paginador.cantidad(this.state.reservas.length);
        this.paginar(0, reservas);
    }

    paginar(pagina, elementos) {
        let paginaElementos = elementos || this.state.reservasFiltradas;
        let resultado = paginador.paginar(pagina, paginaElementos);
        this.setState({reservasPaginados: resultado.Elementos, numPagina: resultado.NumPagina});
    }

    cancelar(res) {
        res[0].Cancelado = true;
        this.setState({
            reservaCancelar: res,
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
                    ¿Esta seguro de que desea cancelar la reserva?
                </SweetAlert>
            )
        });
    }

    successDelete() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.state.reservaCancelar[0].IdServicio.id)
            .collection('Reservas').doc(this.state.reservaCancelar[0].IdReservaServicio.id).set(this.state.reservaCancelar[0]);
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').doc(this.state.reservaCancelar[1]).set(this.state.reservaCancelar[0]);
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: 'block', marginTop: '-100px', position: 'center'}}
                    title="Reserva cancelada"
                    onConfirm={()=>this.hideAlert()}
                    onCancel={()=>this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    La reserva se cancelo correctamente.
                </SweetAlert>
            )
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
                    La reserva sigue vigente.
                </SweetAlert>
            )
        });
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Mis Reservas</h3></legend>
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
                                <label>Servicio</label>
                                <Select
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.serviciosLista}
                                    onChange={this.ChangeServicio.bind(this)}
                                />
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Estado</label>
                                <Select
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={[{value: 1, label: 'Pendiente'}, {value: 0, label: 'En curso'},
                                        {value: 2, label: 'Realizado'}, {value: 3, label: 'Cancelado'}]}
                                    onChange={this.ChangeSelectEstado.bind(this)}
                                />
                            </div>
                        </div>
                        <div className='row'>
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
                    <Button bsStyle="secondary" fill wd onClick={()=> {
                    }}>
                        Reestablecer
                    </Button>
                    <Button bsStyle="primary" fill wd onClick={()=> {
                    }}>
                        Consultar
                    </Button>
                </div>


                <div className="card row" hidden={!this.state.reservasFiltradas.length}>
                    <h4 className="row">Reservas ({this.state.reservasFiltradas.length})</h4>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Indice</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Servicio</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Dia</th>
                                <th scope="col">Hora desde</th>
                                <th scope="col">Hora hasta</th>
                                <th scope="col">Visualizar</th>
                                <th scope="col">Cancelar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.reservasPaginados.map((res, ind)=> {
                                    var desde = new Date(res[0].FechaDesde.seconds * 1000);
                                    var hasta = new Date(res[0].FechaHasta.seconds * 1000);
                                    var editar = '/propietario/visualizarReserva/' + res[1];
                                    var estado = validator.estadoReserva(desde, hasta, res[0].Cancelado);
                                    return (
                                        <tr className="table-light">
                                            <th scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                            <th scope="row">{res[0].Nombre}</th>
                                            <th scope="row">{res[0].Servicio}</th>
                                            <td>{estado.Nombre}</td>
                                            <td>{desde.toLocaleDateString()}</td>
                                            <td>{desde.toLocaleTimeString()}</td>
                                            <td>{hasta.toLocaleTimeString()}</td>
                                            <td><Link to={editar}><Button bsStyle="info" fill wd>
                                                Visualizar
                                            </Button></Link></td>
                                            <td><Button bsStyle="warning" fill wd disabled={estado.Id != 0}
                                                        onClick={()=> {

                                                            this.cancelar(res);
                                                        }}>
                                                Cancelar
                                            </Button></td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center">
                    <Pagination className="pagination-no-border">
                        <Pagination.First onClick={()=>this.paginar(0)}/>

                        {
                            this.cantidad.map(num=> {
                                return (<Pagination.Item onClick={()=>this.paginar(num)}
                                                         active={(num == this.state.numPagina)}>{num + 1}</Pagination.Item>);
                            })
                        }

                        <Pagination.Last onClick={()=>this.paginar(this.cantidad.length - 1)}/>
                    </Pagination>
                </div>
            </div>
        );
    }
}

export default PrincipalReserva;