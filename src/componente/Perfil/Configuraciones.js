import React, { Component } from 'react';
import { Database, Storage } from 'config/config';


class Configuraciones extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    async componentDidMount() {

    }


    render() {
        return (
            <div className="col-12">
                <div className="row card">
                    <div className="card-body">
                        <legend><h3 className="row"><i className="pe-7s-tools"/> Configuraciones</h3></legend>
                        <div className="row">
                            <div className="col-md-3 row-secction">
                                <h4><strong>Cambiar mi contraseña</strong></h4>
                                <h5 id='Lala'>asd</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Configuraciones;
