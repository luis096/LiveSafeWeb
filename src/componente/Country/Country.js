import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link, NavLink } from 'react-router-dom';
import Icons from "../../views/Icons.jsx";

class Country extends Component {

    constructor(props) {
        super(props);
        this.idCountry = props.idCountry;
        this.nombre = props.nombre;
        this.calle = props.calle;
        this.numero = props.numero;
        this.titular = props.titular;
        this.celular = props.celular;
        this.urlEditar = 'editarCountry/' + props.idCountry;
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
            <tr>
                <th scope="row">{this.nombre}</th>
                <td>{this.calle}</td>
                <td>{this.numero}</td>
                <td> {this.titular}</td>
                <td>{this.celular}</td>
                <td><NavLink
                      to={this.urlEditar}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className='pe-7s-pen'/>
                    </NavLink>
                </td>
                <td><NavLink
                      to={this.urlEditar}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className='pe-7s-trash'/>
                    </NavLink></td>
            </tr>
        );
    }
}

export default Country;