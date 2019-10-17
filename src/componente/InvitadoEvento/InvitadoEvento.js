import React, { Component } from 'react';
import {Database} from '../../config/config';
import "../Style/Alta.css";
import Select from 'react-select';


class InvitadoEvento extends Component{

    constructor(){
        super();
        this.state= {
            nombre: '',
            apellido: '',
            documento: '',
            tipoDocumento: '',
           tipoD: [],
        }
        this.restaurar = this.restaurar.bind(this);
        this.registrar = this.registrar.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
    }

    async componentDidMount() {
        const {tipoD} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        this.setState({tipoD});
    }


    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeSelect(event) {
        this.setState({tipoDocumento: event});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    restaurar(){
        this.setState({
            nombre: '',
            apellido: '',
            documento: '',
            tipoDocumento: '',
        })
    }
    
    registrar(){
        this.restaurar();
    }

    render(){
        return(
            <div className="content">
                <div className="form-group">
                    <div>
                        <label className="h2">Registrarme en un evento</label>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">

                    <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Nombre </label>
                            <input type="name" className="form-control" placeholder="Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                            <label for="Apellido"> Apellido </label>
                            <input type="family-name" className="form-control" placeholder="Surname"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="TipoDocumento"> Tipo Documento </label>
                        <Select
                            className="select-documento"
                            classNamePrefix="select"
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            options={this.state.tipoD}
                            onChange={this.ChangeSelect.bind(this)}
                        />
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="NumeroDocumento"> Numero de Documento </label>
                        <input type="document" className="form-control" placeholder="Document number"
                                value={this.state.documento}
                                onChange={this.ChangeDocumento}/>
                    </div>

                    </div>
                </div>
                <div className="form-group izquierda">
                    <button className="btn btn-primary boton" onClick={this.restaurar}>Restaurar</button>
                    <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                </div>
            </div>
        );
    }
}

export default InvitadoEvento;