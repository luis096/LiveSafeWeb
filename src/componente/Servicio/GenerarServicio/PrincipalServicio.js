import React, { Component } from 'react';
import '../../Style/Alta.css';
import { Database } from '../../../config/config';
import { Link } from 'react-router-dom';
import Servicio from './Servicio';


class PrincipalServicio extends Component {

    constructor() {
        super();
        this.state = {
            servicios: [],
            idCountry: ''
        };
        this.actualizar = this.actualizar.bind(this);
    }

    async componentWillMount() {
        const {servicios} = this.state;
        // await Database.collection('Administradores').get().then(querySnapshot => {
        //     querySnapshot.forEach(doc => {
        //         if(doc.data().Usuario === localStorage.getItem('mail')){
        //             this.state.idCountry = doc.data().IdCountry
        //         }
        //     });
        // })

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    this.state.servicios.push(
                        [doc.data(), doc.id]);
                });
            });
        this.setState({servicios});
    }

    actualizar(id) {
        const {servicios} = this.state;
        this.state.servicios.map(valor=> {
            if (valor[1] == id) {
                servicios.splice(servicios.indexOf(valor), 1);
            }
        });
        this.setState({servicios});
        this.render();
    }

    render() {
        return (
            <div className="col-12">
                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Servicios</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className="mr-sm-2 borde-button" control de formulario tipo="texto"
                               placeholder="Buscar"/>
                        <Link to='/altaServicio' type="button" className="btn btn-primary" type="submit">Nuevo
                            Servicio</Link>
                    </div>

                </div>

                <div className="row">

                    <div className="col-md-1"></div>
                    <div className="col-md-10 ">

                        <br></br>

                        <table className="table table-hover  ">
                            <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Disponibilidad</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.servicios.map(servicios=> {
                                        return (
                                            <Servicio
                                                idServicio={servicios[1]}
                                                nombre={servicios[0].Nombre}
                                                estado={servicios[0].Estado}
                                                disponibilidad={servicios[0].Disponibilidad}
                                                act={this.actualizar}
                                            >
                                            </Servicio>
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

export default PrincipalServicio;