import React, { Component } from 'react';
import './Style/Alta.css';
import Modal from 'react-bootstrap/Modal';

class ModalEliminar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.nombre = props.nombre;
        this.elemento = props.elemento;
        this.eliminar = this.eliminar.bind(this);
    }


    eliminar() {
        this.setState({show: false});
        this.props.borrar();
    }

    render() {
        const {show} = this.state;

        const handleClose = ()=>this.setState({show: false});
        const handleShow = ()=>this.setState({show: true});

        return (
            <>
                <button variant="primary" onClick={handleShow} class="btn btn-primary">
                    Eliminar
                </button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar {this.nombre}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Esta seguro de eliminar el {this.nombre.toLowerCase()} "{this.elemento}"
                        ? </Modal.Body>
                    <Modal.Footer>
                        <button variant="secondary" onClick={handleClose} class="btn btn-danger">
                            Cancelar
                        </button>
                        <button variant="primary" onClick={this.eliminar} class="btn btn-success">
                            Confirmar
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ModalEliminar;