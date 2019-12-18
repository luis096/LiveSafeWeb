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
            .collection('Reservas').get().then(querySnapshot=> {
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
        this.render();
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
                                <th scope="col">Hora</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.reservas.map(reservas=> {
                                        return (
                                            <Reserva
                                                idReserva={reservas[1]}
                                                nombre={reservas[0].Nombre}
                                                hora={reservas[0].Hora}
                                                estado={reservas[0].Estado}
                                                act={this.actualizar}
                                            >
                                            </Reserva>
                                        );
                                    }
                                )

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