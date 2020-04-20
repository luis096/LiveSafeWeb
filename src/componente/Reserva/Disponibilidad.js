import React, {Component} from 'react';
import Switch from 'react-bootstrap-switch';

class Disponibilidad extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dias: props.dias,
        };
        console.log(this.state.dias)
    }

    render() {
        return (
            <div className="col-12">
                <div className="row">
                    <div className="row-secction col-md-1 col-sm-1" style={{margin: '0px 10px'}}>
                        <p className="category">Lunes</p>
                        <Switch
                            onText="✔"
                            offText="✘"
                            value={!!this.props.dias[0]}
                        />
                    </div>
                    <div className="row-secction col-md-1 col-sm-1" style={{margin: '0px 10px'}}>
                        <p className="category">Martes</p>
                        <Switch
                            onText="✔"
                            offText="✘"
                            value={!!this.props.dias[1]}
                        />
                    </div>
                    <div className="row-secction col-md-1 col-sm-1" style={{margin: '0px 10px'}}>
                        <p className="category">Miercoles</p>
                        <Switch
                            onText="✔"
                            offText="✘"
                            value={!!this.props.dias[2]}
                        />
                    </div>
                    <div className="row-secction col-md-1 col-sm-1" style={{margin: '0px 10px'}}>
                        <p className="category">Jueves</p>
                        <Switch
                            onText="✔"
                            offText="✘"
                            value={!!this.props.dias[3]}
                        />
                    </div>
                    <div className="row-secction col-md-1 col-sm-1" style={{margin: '0px 10px'}}>
                        <p className="category">Viernes</p>
                        <Switch
                            onText="✔"
                            offText="✘"
                            value={!!this.props.dias[4]}
                        />
                    </div>
                    <div className="row-secction col-md-1 col-sm-1" style={{margin: '0px 10px'}}>
                        <p className="category">Sábado</p>
                        <Switch
                            onText="✔"
                            offText="✘"
                            value={!!this.props.dias[5]}
                        />
                    </div>
                    <div className="row-secction col-md-1 col-sm-1" style={{margin: '0px 10px'}}>
                        <p className="category">Domingo</p>
                        <Switch
                            onText="✔"
                            offText="✘"
                            value={!!this.props.dias[6]}
                        />
                    </div>
                </div>
            </div>


        );
    }
}

export default Disponibilidad;
