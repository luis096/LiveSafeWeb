import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';


class EditarCountry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barrio: [],
            nombre: '',
            calle: '',
            numero: '',
            titular: '',
            fechaAlta: '',
            celular: '',
            descripcion: ''
        };
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);
        const url = this.props.location.pathname.split('/');
        this.idBarrio = url[url.length - 1];
    }


    async componentDidMount() {
        await Database.collection('Country').doc(this.idBarrio).get().then(doc=> {
            if (doc.exists) {
                this.setState({
                    nombre: doc.data().Nombre,
                    calle: doc.data().Calle,
                    numero: doc.data().Numero,
                    titular: doc.data().Titular,
                    celular: doc.data().Celular,
                    fechaAlta: doc.data().FechaAlta,
                    descripcion: doc.data().Descripcion
                });
            }
        });
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeCalle(event) {
        this.setState({calle: event.target.value});
    }

    ChangeNumero(event) {
        this.setState({numero: event.target.value});
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    registrar() {
        Database.collection('Country').doc(this.idBarrio).update({
            Nombre: this.state.nombre,
            Calle: this.state.calle,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion
        });
    }


    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Editar barrio</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Nombre del barrio </label>
                                <input className="form-control" placeholder="Nombre"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}
                                />
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Titular </label>
                                <input className="form-control" placeholder="Titular"
                                       value={this.state.titular}
                                       onChange={this.ChangeTitular}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Calle </label>
                                <input className="form-control" placeholder="Calle"
                                       value={this.state.calle}
                                       onChange={this.ChangeCalle}/>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Numero </label>
                                <input className="form-control" placeholder="Numero"
                                       value={this.state.numero}
                                       onChange={this.ChangeNumero}/>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Celular </label>
                                <input className="form-control" placeholder="Celular"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Descripcion </label>
                                <textarea className="form-control" rows="3"
                                          placeholder="Description"
                                          value={this.state.descripcion}
                                          onChange={this.ChangeDescripcion}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>
                        Registrar
                    </Button>
                </div>
            </div>

        );
    }
}

export default EditarCountry;