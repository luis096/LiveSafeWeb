import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link, NavLink } from 'react-router-dom';
import ModalEliminar from '../ModalEliminar';


class Administrador extends Component {

    constructor(props) {
        super(props);

        this.idAdministrador = props.idAdministrador;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.legajo = props.legajo;
        this.documento = props.documento;
        this.celular = props.celular;
        this.idCountry = props.idCountry;
        this.country = '';
        this.urlEditar = '/editarAdministrador/' + props.idAdministrador;
        this.eliminar = this.eliminar.bind(this);
    }

    async componentWillMount() {
        // await Database.collection('Barrios').doc(this.idCountry).get()
        //     .then(doc => {
        //         if (doc.exists) {
        //             this.country = doc.data().Nombre;
        //         }
        //     })
    }

    eliminar() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Administradores').doc(this.idAdministrador).delete()
            .then(
                this.props.act(this.idAdministrador)
            )
            .catch(err=> {
                //En caso de error, hacer esto...
            });
    }

    render() {
        return (

            <tr>
                <th scope="row">{this.nombre}, {this.apellido}</th>
                <td>{this.documento}</td>
                <td> {this.legajo}</td>
                <td>{this.celular}</td>

                <td><NavLink
                      to={this.urlEditar}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className='pe-7s-pen'/>
                    </NavLink></td>
                <td><ModalEliminar nombre='Administrador' elemento={this.nombre} borrar={this.eliminar}></ModalEliminar>
                </td>
            </tr>


        );
    }
}

export default Administrador;