import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';

class ModalConfirmar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
        this.nombre = props.nombre;
        this.elemento = props.elemento;
    }


    render() {
        const {show} = this.state;

        const handleClose = ()=>this.setState({show: false});

        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar {this.nombre}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Esta seguro de Registrar el {this.nombre.toLowerCase()} "{this.elemento}"
                        ? </Modal.Body>
                    <Modal.Footer>

                        <button variant="primary" onClick={handleClose} class="btn btn-success">
                            Aceptar
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ModalConfirmar;