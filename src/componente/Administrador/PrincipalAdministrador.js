import React, { Component } from 'react';
import '../Style/Alta.css';
import '../Administrador/Index.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import Administrador from './Administrador';


class PrincipalAdministrador extends Component {

    constructor() {
        super();
        this.state = {
            administradores: []
        };

        this.actualizar = this.actualizar.bind(this);

    }

    async componentDidMount() {
        const {administradores} = this.state;
        await Database.collection('Country').get().then(querySnapshot=> {
            querySnapshot.forEach(country=> {
                Database.collection('Country').doc(country.id)
                    .collection('Administradores').get()
                    .then(querySnapshot=> {
                        querySnapshot.forEach(doc=> {
                            this.state.administradores.push(
                                [doc.data(), doc.id]
                            );
                        });
                    });
            });
        });
        this.setState({administradores});
    }


    actualizar(id) {
        const {administradores} = this.state;
        this.state.administradores.map(valor=> {
            if (valor[1] == id) {
                administradores.splice(administradores.indexOf(valor), 1);
            }
        });
        this.setState({administradores});
    }

    render() {
        return (
            <div className="col-12 PrincipalAdm">
                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Administradores</label>
                    </div>
                    <div className="col-5 izquierda">
                        <Link to='/altaAdministrador' type="button" className="btn btn-primary">Nuevo
                            Administrador</Link>
                    </div>
                </div>

                <div className="row">

                    <div className="col-md-1"></div>
                    <div className="col-md-10 ">

                        <br></br>

                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Nombre y Apellido</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Legajo</th>
                                <th scope="col">Celular</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.administradores.map(admin=> {
                                        return (
                                            <Administrador
                                                idAdministrador={admin[1]}
                                                nombre={admin[0].Nombre}
                                                apellido={admin[0].Apellido}
                                                legajo={admin[0].Legajo}
                                                documento={admin[0].Documento}
                                                celular={admin[0].Celular}
                                                act={this.actualizar}
                                            >
                                            </Administrador>
                                        );
                                    }
                                )
                            }

                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div>
                    < hr className="my-4"></hr>
                </div>
                <div className="espacio"></div>
            </div>
        );
    }
}

export default PrincipalAdministrador;