import React, { Component } from 'react';
//import '../Style/Alta.css';
import '../Propietario/Index.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import Propietario from './Propietario';


class PrincipalPropietario extends Component {
    constructor() {
        super();
        this.state = {
            propietarios: [],
            idCountry: ''
        };
        this.actualizar = this.actualizar.bind(this);
    }

    async componentDidMount() {
        const {propietarios} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    this.state.propietarios.push(
                        [doc.data(), doc.id]
                    );
                });
            });
        this.setState({propietarios});
    }

    actualizar(id) {
        const {propietarios} = this.state;
        this.state.propietarios.map(valor=> {
            if (valor[1] == id) {
                propietarios.splice(propietarios.indexOf(valor), 1);
            }
        });
        this.setState({propietarios});
        this.render();
    }

    render() {
        return (
            <div className="col-12 PrincipalPropietario">

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Propietario</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className="mr-sm-2 borde-button"
                               placeholder="Buscar"/>
                        <Link to='/admin/altaPropietario' type="button" className="btn btn-primary" type="submit">Nuevo
                            Propietario</Link>
                    </div>

                </div>

                <div className="row conteiner">
                    <div className="col-md-12 ">

                        <br></br>

                        <table className="table table-hover  ">
                            <thead>
                            <tr>
                                <th scope="col">Nombre y Apellido</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Titular</th>
                                <th scope="col">Celular</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {

                                this.state.propietarios.map(propietario=> {
                                        return (

                                            <Propietario
                                                idPersona={propietario[1]}
                                                nombre={propietario[0].Nombre}
                                                apellido={propietario[0].Apellido}

                                                titular={propietario[0].Titular}
                                                celular={propietario[0].Celular}
                                                documento={propietario[0].Documento}
                                                act={this.actualizar}
                                            >
                                            </Propietario>
                                        );
                                    }
                                )
                            }

                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    < hr className="my-4"></hr>
                </div>
                <div className="espacio"></div>
            </div>
        );
    }
}

export default PrincipalPropietario;