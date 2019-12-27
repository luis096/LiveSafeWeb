import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { NavLink } from 'react-router-dom';
import Button from 'components/CustomButton/CustomButton.jsx';


class Invitado extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.idPersona = props.idPersona;
        this.grupo = props.grupo;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.estado = props.estado;
        this.documento = props.documento;
        this.urlEditar = 'editarInvitado/' + props.idPersona;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').doc(this.idPersona).delete()
            .then(
                this.props.act(this.idPersona)
            )
            .catch(err=> {
                //En caso de error, hacer esto...
            });
    }

    render() {
        return (

            <tr class="table-light">
                <th scope="row">{this.documento}</th>
                <td>{this.nombre}, {this.apellido}</td>
                <td>{this.grupo}</td>
                <td> {this.estado ? 'Activo' : 'Inactivo'}</td>
                <td><Button bsStyle="info" fill wd disabled={!this.nombre}>Invitar</Button></td>
                <td><NavLink
                      to={this.urlEditar}
                      className="nav-link"
                      activeClassName="active"
                    >
                    <Button bsStyle="warning" fill wd disabled={!this.nombre}>Editar</Button>
                    </NavLink></td>
                <td><Button bsStyle="danger" fill wd>Eliminar</Button></td>
            </tr>


        );
    }
}

export default Invitado;