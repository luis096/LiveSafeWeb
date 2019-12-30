import React, { Component } from 'react';
import '../Style/Alta.css';
import '../Administrador/Index.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';


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
        let idBarrios = [];
        // await Database.collection('Country').get().then(querySnapshot=> {
        //     querySnapshot.forEach(country=> {
        //         Database.collection('Country').doc(country.id)
        //             .collection('Administradores').get()
        //             .then(querySnapshot=> {
        //                 querySnapshot.forEach(doc=> {
        //                     administradores.push(
        //                         [doc.data(), doc.id]
        //                     );
        //                 });
        //             });
        //     });
        // });
        await Database.collection('Country').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                idBarrios.push(doc.id)
            });
        });

        idBarrios.map(id => {
            Database.collection('Country').doc(id)
                .collection('Administradores').get()
                .then(querySnapshot=> {
                    querySnapshot.forEach(doc=> {
                        administradores.push(
                            [doc.data(), doc.id]
                        );
                    });
                });
        });

        this.setState({administradores});
        console.log(this.state.administradores)
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
            <div className="col-12 ">
                <div className="row ">
                    <div className="col-5">
                        <label className="h2">Administradores</label>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-10">
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
                                this.state.administradores.map(admin => {
                                        return (
                                            <tr>
                                                <th scope="row">{admin[0].Nombre}, {admin[0].Apellido}</th>
                                                <td>{admin[0].Documento}</td>
                                                <td> {admin[0].Legajo}</td>
                                                <td>{admin[0].Celular}</td>
                                                <td>{'editar'}</td>
                                                <td>{'asd'}</td>
                                            </tr>
                                        );
                                    }
                                )
                            }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrincipalAdministrador;