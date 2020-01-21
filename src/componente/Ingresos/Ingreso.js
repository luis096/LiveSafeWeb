import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import ModalEliminar from '../ModalEliminar';
import { strict } from 'assert';


class Ingreso extends Component {

    constructor(props) {
        super(props);
        this.idIngreso = props.idIngreso;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.persona = props.persona;
        this.documento = props.documento;
        this.descripcion = props.descripcion;
        this.hora = props.hora;
        this.urlEditar = '/editarIngreso/' + props.idIngreso;
        this.eliminar = this.eliminar.bind(this);

    }

    eliminar() {
        Database.collection('Ingreso').doc(this.idIngreso).delete()
            .then(
                this.props.act(this.idIngreso)
            )
            .catch(err=> {
                //En caso de error, hacer esto...
            });
    }

    render() {

        return (

            <tr class="table-light">
                <th scope="row">{this.nombre}, {this.apellido}</th>
                <td> {this.documento}</td>
                <td>{this.persona}</td>
                <td>{'sd'}</td>
                <td> {this.descripcion != '' && this.descripcion != undefined ? 'Si' : '-'}</td>
                <td><ModalEliminar nombre='Ingreso' elemento={this.nombre} borrar={this.eliminar}></ModalEliminar></td>
            </tr>


        );
    }
}

export default Ingreso;