import React, { Component } from 'react';
import { Database } from '../../config/config';
import '../Style/Alta.css';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import {operacion} from "../Operaciones";
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";


class InvitadoEvento extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            apellido: '',
            documento: '',
            tipoDocumento: '',
            tipoD: [],
            barrios: [],
            reservaNombre: ''
        };
        this.notificationSystem = React.createRef();
        const url = this.props.location.pathname.split('/');
        this.idCountry = url[url.length - 3];
        this.idPropietario = url[url.length - 2];
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
        await Database.collection('Country').doc(this.idCountry)
            .collection('Propietarios').doc(this.idPropietario)
            .collection('Reservas').doc(this.idReserva).get().then(doc=> {
                this.setState({reservaNombre: doc.data().Nombre})
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

    async registrar() {
        await Database.collection('Country').doc(this.idCountry)
            .collection('Propietarios').doc(this.idPropietario)
            .collection('Reservas').doc(this.idReserva).collection('Invitados').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Documento: this.state.documento,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            TipoDocumentoLabel: this.state.tipoDocumento.label,
            Estado: false,
            IdInvitado: ''
        });
        await Database.collection('Country').doc(this.idCountry)
            .collection('Notificaciones').add({
                Fecha: new Date(),
                IdPropietario: Database.doc('Country/' + this.idCountry + '/Propietarios/'
                    + this.idPropietario),
                Titulo: 'Nueva Solicitud',
                Texto: 'El invitado ' + this.state.apellido + ', ' + this.state.nombre + ' le envio una solicitud ' +
                    'para asistir al evento ' + this.state.reservaNombre + '.',
                Visto: false
            }).then(this.restaurar());
    }

    render() {
        return (
            <div className="content">
                <legend><h3>{this.state.reservaNombre}</h3></legend>
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
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}

export default InvitadoEvento;
