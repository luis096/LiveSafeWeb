import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import ModalEliminar from '../ModalEliminar';

class Country extends Component {

    constructor(props) {
        super(props);
        this.idCountry = props.idCountry;
        this.nombre = props.nombre;
        this.calle = props.calle;
        this.numero = props.numero;
        this.titular = props.titular;
        this.celular = props.celular;
        this.urlEditar = '/editarCountry/' + props.idCountry;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar() {
        Database.collection('Country').doc(this.idCountry).delete()
            .then(this.props.act(this.idCountry))
            .catch(err=> {
                //En caso de error, hacer esto...
            });
    }

    render() {
        return (
            <tr class="table-light">
                <th scope="row">{this.nombre}</th>
                <td>{this.calle}</td>
                <td>{this.numero}</td>
                <td> {this.titular}</td>
                <td>{this.celular}</td>
                <td><Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link></td>
                <td><ModalEliminar nombre='Country' elemento={this.nombre} borrar={this.eliminar}></ModalEliminar></td>
            </tr>
        );
    }
}

export default Country;