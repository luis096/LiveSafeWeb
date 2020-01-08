import React, { Component } from 'react';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { paginador } from '../Paginador';
import { Pagination } from 'react-bootstrap';
import { validator } from '../validator';

class PrincipalReserva extends Component {

    constructor() {
        super();
        this.state = {
            reservas: [],
            idPropietario: '',
            idCountry: '',
            alert: null,
            reservasPaginados: [],
            numPagina: 0,
            reservaCancelar: []
        };
        this.hideAlert = this.hideAlert.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.paginar = this.paginar.bind(this);
        this.cantidad = [];
    }

    async componentDidMount() {
        const {reservas} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').orderBy('FechaDesde', 'desc').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    reservas.push(
                        [doc.data(), doc.id]
                    );

                });
            });
        this.setState({reservas});
        this.cantidad = paginador.cantidad(this.state.reservas.length);
        this.paginar(0);
    }

    paginar(pagina) {
        let resultado = paginador.paginar(pagina, this.state.reservas);
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
        console.log(this.state.reservaCancelar)
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
                <div className="card row">
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
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
                                this.state.reservas.map(res=> {
                                    var desde = new Date(res[0].FechaDesde.seconds * 1000);
                                    var hasta = new Date(res[0].FechaHasta.seconds * 1000);
                                    var editar = '/propietario/visualizarReserva/' + res[1];
                                    var estado = validator.estadoReserva(desde, hasta, res[0].Cancelado)
                                    return (
                                        <tr className="table-light">
                                            <th scope="row">{res[0].Nombre}</th>
                                            <th scope="row">{res[0].Servicio}</th>
                                            <td>{estado.Nombre}</td>
                                            <td>{desde.toLocaleDateString()}</td>
                                            <td>{desde.toLocaleTimeString()}</td>
                                            <td>{hasta.toLocaleTimeString()}</td>
                                            <td><Link to={editar}><Button bsStyle="info" fill wd>
                                                Visualizar
                                            </Button></Link></td>
                                            <td><Button bsStyle="warning" fill wd disabled={res[0].Cancelado} onClick={ () => {

                                                this.cancelar(res)
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