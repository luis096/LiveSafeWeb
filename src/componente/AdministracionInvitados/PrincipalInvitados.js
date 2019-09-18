import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Invitado from './Invitado';
import AltaInvitado from './AltaInvitado';
import Modal from 'react-bootstrap/Modal';


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
        const {show} = this.state;

        const handleClose = ()=>this.setState({show: false});
        const handleShow = ()=>this.setState({show: true});
        return (
            <div className="col-12">

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Invitados</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className="mr-sm-2 borde-button" control de formulario tipo="texto"
                               placeholder="Buscar"/>
                        <button type="button" className="btn btn-primary"
                                onClick={handleShow}
                        >Nuevo Invitado
                        </button>
                        <Modal show={show} onHide={handleClose}
                               size="lg"
                               aria-labelledby="contained-modal-title-vcenter"
                               centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Nuevo Invitado</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><AltaInvitado cerrar={handleClose}></AltaInvitado> </Modal.Body>

                        </Modal>

                    </div>

                </div>

                <div className="row">

                    <div className="col-md-1"></div>
                    <div className="col-md-10 ">

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

export default PrincipalInvitados;