import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import ModalEliminar from '../ModalEliminar';

class Encargado extends Component {

    constructor(props) {
        super(props);
        this.idEncargado = props.idEncargado;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.legajo = props.legajo;
        this.documento = props.documento;
        this.celular = props.celular;
        this.urlEditar = '/editarEncargado/' + props.idEncargado;
        this.eliminar = this.eliminar.bind(this);

    }

    eliminar() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Encargados').doc(this.idEncargado).delete()
            .then(
                this.props.act(this.idEncargado)
            )
            .catch(err=> {
                //En caso de error, hacer esto...
            });
    }

    render() {

        return (

            <tr class="table-light">
                <th scope="row">{this.nombre}, {this.apellido}</th>
                <td>{this.documento}</td>
                <td> {this.legajo}</td>
                <td>{this.celular}</td>
                <td><Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link></td>
                <td><ModalEliminar nombre='Encargado' elemento={this.nombre} borrar={this.eliminar}></ModalEliminar>
                </td>
            </tr>


        );
    }
}

export default Encargado;