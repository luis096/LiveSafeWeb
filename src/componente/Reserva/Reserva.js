import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import ModalEliminar from '../ModalEliminar';
import { Link } from 'react-router-dom';

class Reserva extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.idReserva = props.idReserva;
        this.estado = props.estado;
        this.nombre = props.nombre;
        this.hora = props.hora;
        this.urlEditar = '/editarReserva/' + props.idReserva;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Reservas').doc(this.idReserva).delete()
            .then(
                this.props.act(this.idReserva)
            )
            .catch(err=> {
                //En caso de error, hacer esto...
            });
    }

    render() {
        return (

            <tr class="table-light">
                <th scope="row">{this.nombre}</th>
                <td>{this.estado}</td>
                <td>{this.hora}</td>
                <td><Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link></td>
                <td><ModalEliminar nombre='Reservas' elemento={this.nombre} borrar={this.eliminar}></ModalEliminar></td>
            </tr>


        );
    }
}

export default Reserva;