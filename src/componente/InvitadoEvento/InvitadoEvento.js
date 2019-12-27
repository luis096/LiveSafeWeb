import React, { Component } from 'react';
import { Database } from '../../config/config';
import '../Style/Alta.css';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';


class InvitadoEvento extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            apellido: '',
            documento: '',
            tipoDocumento: '',
            tipoD: []
        };
        const url = this.props.location.pathname.split('/');
        this.idReserva = url[url.length - 1];
        this.esPropietario = !!localStorage.getItem('user');
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

    restaurar() {
        this.setState({
            nombre: '',
            apellido: '',
            documento: '',
            tipoDocumento: ''
        });
    }

    registrar() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').doc(this.idReserva).collection('Invitados').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Documento: this.state.documento,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            TipoDocumentoLabel: this.state.tipoDocumento.label,
            Estado: false,
            IdInvitado: ''
        });
        this.restaurar();
    }

    render() {
        return (
            <div className="content">
                <legend><h3>Agregar invitado a un evento</h3></legend>
                <div className="card">
                    <div className="card-body">
                        <div className="col-md-6">
                            <label> Nombre </label>
                            <input type="name" className="form-control" placeholder="Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}/>
                        </div>
                        <div className="col-md-6">
                            <label> Apellido </label>
                            <input type="family-name" className="form-control" placeholder="Surname"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                        </div>
                        <div className="col-md-6">
                            <label> Tipo Documento </label>
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
                        <div className="col-md-6">
                            <label> Numero de Documento </label>
                            <input type="document" className="form-control" placeholder="Document number"
                                   value={this.state.documento}
                                   onChange={this.ChangeDocumento}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <Button bsStyle="primary" fill wd onClick={this.restaurar}>Limpiar</Button>
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>Agregar invitado</Button>
                </div>
            </div>
        );
    }
}

export default InvitadoEvento;