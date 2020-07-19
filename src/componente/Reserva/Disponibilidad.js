import React, {Component} from 'react';
import Switch from 'react-bootstrap-switch';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Collapse } from 'reactstrap';
import Card from 'components/Card/Card.jsx';
import {validator} from "../validator";

class Disponibilidad extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disponibilidad: props.disponibilidad,
            collapsed: false,
            dias: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
        };
    }

    render() {
        return (
            <div className="col-12">
                <Button bsStyle="warning" fill wd onClick={() => { this.setState({collapsed: !this.state.collapsed})}}>
                    Ver disponibilidad del servicio
                </Button>
                <div>
                    <Collapse isOpen={this.state.collapsed}>
                        <div className="row">
                            {
                                this.props.disponibilidad.map((disp, i) => {
                                    return (
                                        <div className="row-secction"
                                             hidden={!(disp && !!disp.horarios.length)}>
                                            <Card title={this.state.dias[i]} content={
                                                <div>
                                                    {
                                                        disp.horarios.map(value => {
                                                            let desde = validator.obtenerFecha(value.desde).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                            let hasta = validator.obtenerFecha(value.hasta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                            return (
                                                                <span>{"De: " + desde + "Hs. a: " + hasta + "Hs. - "}</span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }>
                                            </Card>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Collapse>
                </div>
            </div>


        );
    }
}

export default Disponibilidad;
