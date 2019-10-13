import React, { Component } from 'react';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import ModalEliminar from '../ModalEliminar';

class Servicio extends Component {

    constructor(props) {
        super(props);

        this.idServicio = props.idServicio;
        this.nombre = props.nombre;
        this.disponibilidad = props.disponibilidad;
        this.estado = props.estado;
        this.urlEditar = '/editarServicio/' + props.idServicio;
        this.eliminar = this.eliminar.bind(this);
    }


    eliminar() {
        Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Servicios').doc(this.idServicio).delete()
            .then(
                this.props.act(this.idServicio)
            )
            .catch(err=> {
                //En caso de error, hacer esto...
            });
    }


    render() {

        return (

            <tr class="table-light">
                <th scope="row">{this.nombre}</th>
                <td>{this.estado ? 'Disponible' : 'No Disponible'}</td>
                <td> {this.disponibilidad}</td>
                <td><Link to={this.urlEditar} type="button" className="btn btn-primary">Editar</Link></td>
                <td><ModalEliminar nombre='Servicio' elemento={this.nombre} borrar={this.eliminar}></ModalEliminar></td>
            </tr>


        );
    }
}

export default Servicio;