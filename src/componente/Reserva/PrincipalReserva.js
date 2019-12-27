import React, { Component } from 'react';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';


class PrincipalReserva extends Component {

    constructor() {
        super();
        this.state = {
            reservas: [],
            idPropietario: '',
            idCountry: '',
            alert: null
        };
        this.actualizar = this.actualizar.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.cancelar = this.cancelar.bind(this);
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
    }


    actualizar(id) {
        const {reservas} = this.state;
        reservas.map(valor=> {
            if (valor[1] == id) {
                reservas.splice(reservas.indexOf(valor), 1);
            }
        });
        this.setState({reservas});
    }

    cancelar() {
        this.setState({
            alert: (
                <SweetAlert
                    warning
                    style={{ display: "block", marginTop: "-100px", position: "center"  }}
                    title="¿Estas seguro?"
                    onConfirm={() => this.successDelete()}
                    onCancel={() => this.cancelDetele()}
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
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{ display: "block", marginTop: "-100px", position: "center"  }}
                    title="Reserva cancelada"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
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
                    style={{ display: "block", marginTop: "-100px", position: "center"  }}
                    title="Se cancelo la operacion"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
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

                <div className="row ">
                    <div className="col-5">
                        <label className="h2">Reservas</label>
                    </div>
                </div>
                {this.state.alert}
                <div className="row">
                    <div className="col-md-10 ">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Nombre</th>
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
                                        return (
                                                <tr className="table-light">
                                                    <th scope="row">{res[0].Nombre}</th>
                                                    <td>{'Pendiente'}</td>
                                                    <td>{desde.toLocaleDateString()}</td>
                                                    <td>{desde.toLocaleTimeString()}</td>
                                                    <td>{hasta.toLocaleTimeString()}</td> 
                                                    <td><Link to={editar}><Button bsStyle="info" fill wd>
                                                        Visualizar
                                                    </Button></Link></td>
                                                    <td><Button bsStyle="warning" fill wd onClick={this.cancelar}>
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
            </div>
        );
    }
}

export default PrincipalReserva;