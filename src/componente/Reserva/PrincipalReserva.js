import React, { Component } from 'react';
// import '../Style/Alta.css';
import { Database } from '../../config/config';
import Reserva from './Reserva';
import { Link } from 'react-router-dom';


class PrincipalReserva extends Component {

    constructor() {
        super();
        this.state = {
            reservas: [],
            idPropietario: '',
            idCountry: '',
            show: false
        };
        this.actualizar = this.actualizar.bind(this);
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

    render() {
        return (
            <div className="col-12">

                <div className="row ">
                    <div className="col-5">
                        <label className="h2">Reservas</label>
                    </div>
                </div>

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
                                                    <td><Link to={editar} type="button" className="btn btn-primary"
                                                        >Visualizar</Link></td>
                                                    <td><button type="button" className="btn btn-primary"
                                                    >Cancelar</button></td>
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