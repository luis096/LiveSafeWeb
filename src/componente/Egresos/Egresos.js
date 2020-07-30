import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import ModalEliminar from '../ModalEliminar';
import { style } from '../../variables/Variables';

// import moment from 'moment';

class Egresos extends Component {
    constructor(props) {
        super(props);
        this.idEgreso = props.idEgreso;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.documento = props.documento;
        this.hora = props.hora;
        this.descripcion = props.descripcion;
        this.cancelar = this.cancelar.bind(this);
    }

    cancelar() {
        Database.collection('Egreso').doc(this.idEgreso).set({ Estado: false });
    }

    render() {
        const opciones = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        return (
            <tr class="table-light">
                <th scope="row">
                    {this.nombre} {this.apellido}
                </th>
                <td> {this.documento}</td>
                <td>{'sd'}</td>
                {/* <td>{Date(this.hora).toLocaleString()}</td> */}
                <td>hora</td>
                <td>{this.descripcion != '' && this.descripcion != undefined ? 'Si' : '-'}</td>
                <td>
                    <ModalEliminar nombre="Egreso" elemento={this.nombre} borrar={this.cancelar}></ModalEliminar>
                </td>
            </tr>
        );
    }
}

export default Egresos;
