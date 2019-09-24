import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import Encargado from './Encargado';


class PrincipalEncargado extends Component {

    constructor() {
        super();
        this.state = {
            encargados: [],
            idCountry: ''
        };
        this.actualizar = this.actualizar.bind(this);

    }

    async componentDidMount() {
        const {encargados} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Encargados').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    this.state.encargados.push(
                        [doc.data(), doc.id]
                    );
                });
            });
        this.setState({encargados});

    }

    actualizar(id) {
        const {encargados} = this.state;
        this.state.encargados.map(valor=> {
            if (valor[1] == id) {
                encargados.splice(encargados.indexOf(valor), 1);
            }
        });
        this.setState({encargados});
        this.render();
    }

    render() {
        return (
            <div className="col-12">

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Encargados</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className="mr-sm-2 borde-button" control de formulario tipo="texto"
                               placeholder="Buscar"/>
                        <Link to='/altaEncargado' type="button" className="btn btn-primary" type="submit">Nuevo
                            Encargado</Link>
                    </div>

                </div>

                <div className="row">

                    <div className="col-md-1"></div>
                    <div className="col-md-10 ">

                        <br></br>

                        <table className="table table-hover  ">
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

                                this.state.encargados.map(encargados=> {
                                        return (

                                            <Encargado
                                                idEncargado={encargados[1]}
                                                nombre={encargados[0].Nombre}
                                                apellido={encargados[0].Apellido}
                                                legajo={encargados[0].Legajo}
                                                documento={encargados[0].Documento}
                                                celular={encargados[0].Celular}
                                                act={this.actualizar}
                                            >
                                            </Encargado>
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

export default PrincipalEncargado;