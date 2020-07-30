import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import ModalEliminar from '../ModalEliminar';

class Propietario extends Component {
    constructor(props) {
        super(props);
        this.idPersona = props.idPersona;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.titular = props.titular;
        this.celular = props.celular;
        this.documento = props.documento;
        this.urlEditar = '/editarPropietario/' + props.idPersona;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar() {
        Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Propietarios')
            .doc(this.idPersona)
            .delete()
            .then(this.props.act(this.idPersona))
            .catch((err) => {
                //En caso de error, hacer esto...
            });
    }

    render() {
        return (
            <tr className="table-light">
                <th scope="row">
                    {this.nombre} {this.apellido}
                </th>
                <td>{this.documento}</td>
                <td> {this.titular ? 'Si' : 'No'}</td>
                <td>{this.celular}</td>
                <td>
                    <Link to={this.urlEditar} type="button" className="btn btn-primary">
                        Editar
                    </Link>
                </td>
                <td>
                    <ModalEliminar nombre="Propietario" elemento={this.nombre} borrar={this.eliminar}></ModalEliminar>
                </td>
            </tr>
        );
    }
}

export default Propietario;
