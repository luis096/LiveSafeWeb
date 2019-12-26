import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Invitado from './Invitado';

class PrincipalInvitados extends Component {

    constructor() {
        super();
        this.state = {
            invitados: [],
            idPropietario: '',
            idCountry: '',
            show: false
        };
        this.actualizar = this.actualizar.bind(this);
    }

    async componentDidMount() {
        const {invitados} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if(doc.data().IdPropietario.id == localStorage.getItem('idPersona')){
                        this.state.invitados.push(
                            [doc.data(), doc.id]
                        );
                    }

                });
            });
        this.setState({invitados});
    }


    actualizar(id) {
        const {invitados} = this.state;
        this.state.invitados.map(valor=> {
            if (valor[1] == id) {
                invitados.splice(invitados.indexOf(valor), 1);
            }
        });
        this.setState({invitados});
        this.render();
    }

    render() {
        return (
            <div className="col-12">

                <div className="row ">
                    <div className="col-5">
                        <label className="h2">Invitados</label>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 ">
                        <br></br>
                        <table className="table table-hover  ">
                            <thead>
                            <tr>
                                <th scope="col">Documento</th>
                                <th scope="col">Apellido y Nombre</th>
                                <th scope="col">Grupo</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.invitados.map(invitados=> {
                                        return (

                                            <Invitado
                                                idPersona={invitados[1]}
                                                grupo={invitados[0].Grupo}
                                                nombre={invitados[0].Nombre}
                                                apellido={invitados[0].Apellido}
                                                estado={invitados[0].Estado}
                                                documento={invitados[0].Documento}
                                                act={this.actualizar}
                                            >
                                            </Invitado>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrincipalInvitados;