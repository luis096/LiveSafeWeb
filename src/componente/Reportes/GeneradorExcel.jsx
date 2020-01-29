import React, { Component } from 'react';
import { errorHTML } from '../Error';
import ReactExport from "react-data-export";
import { Modal } from 'react-bootstrap';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class GeneradorExcel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            elementos: props.elementos,
            estructura: props.estructura,
            pagina: props.pagina,
            show: props.show,
            name: '',
        };
        this.ChangeName = this.ChangeName.bind(this);
    }

    ChangeName(event) {
        this.setState({name: event.target.value});
    }

    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={()=>{this.setState({show: false}); this.props.ocultar()}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Exportar Archivo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Nombre del Archivo: </label>
                        <input className={'form-control'}
                               value={this.state.name}
                               onChange={this.ChangeName} placeholder="Nombre archivo"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <ExcelFile element={<Button bsStyle="success" fill wd
                        onClick={()=>{this.props.ocultar()}}>Descargar</Button>}
                                   filename={this.state.name}>
                            <ExcelSheet data={this.state.elementos} name={this.state.pagina}>
                                {
                                    this.state.estructura.map((fila) => {
                                        return(
                                            <ExcelColumn label={fila.label} value={fila.value}/>
                                        )
                                    })
                                }
                            </ExcelSheet>
                        </ExcelFile>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default GeneradorExcel;