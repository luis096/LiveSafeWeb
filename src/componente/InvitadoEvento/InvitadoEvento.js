import React, { Component } from 'react';
import { Database } from '../../config/config';
import '../Style/Alta.css';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { operacion } from '../Operaciones';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';
import { validator } from '../validator';
import Spinner from 'react-spinner-material';
import "../Style/SpinnerAltas.scss"
import {errorHTML} from "../Error";

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
            reservaNombre: '',
            vigente: true,
            loading: true,
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
        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const { tipoD } = this.state;
        try {
            await Database.collection('TipoDocumento')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.state.tipoD.push({ value: doc.id, label: doc.data().Nombre });
                    });
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
            await Database.collection('Country')
                .doc(this.idCountry)
                .collection('Propietarios')
                .doc(this.idPropietario)
                .collection('Reservas')
                .doc(this.idReserva)
                .get()
                .then((doc) => {
                    this.setState({ reservaNombre: doc.data().Nombre });
                    if (doc.data().Cancelado || validator.obtenerFecha(doc.data().FechaHasta) < new Date()) {
                        this.setState({ vigente: false });
                    }
                    this.setState({ loading: false });
                    console.log(doc.data());
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
        } catch (e) {
            this.notificationSystem.current.addNotification(operacion.error(e.message));
        }

        this.setState({ tipoD });
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        if (event.target.value === "") {
            this.errorNombre = validator.requerido(event.target.value)
        } else {
            this.errorNombre = validator.soloLetrasNumeros(event.target.value)
        }
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        if (event.target.value === "") {
            this.errorApellido = validator.requerido(event.target.value)
        } else {
            this.errorApellido = validator.soloLetrasNumeros(event.target.value)
        }
    }
    ChangeSelect(event) {
        this.setState({ tipoDocumento: event });
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        if (event.target.value === "") {
            this.errorDocumento = validator.requerido(event.target.value)
        } else {
            this.errorDocumento = validator.numero(event.target.value)
        }
        if (!event.target.value) return;
        this.errorDocumento = validator.documento(event.target.value);
    }

    restaurar() {
        this.setState({
            nombre: '',
            apellido: '',
            documento: '',
            tipoDocumento: '',
        });
    }

    async registrar() {
        this.setState({loading: true});

        let tipoDocumentoRef = operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);
        let existeInvitado = false;
        let e = false;
        try {
            await Database.collection('Country')
                .doc(this.idCountry)
                .collection('Propietarios')
                .doc(this.idPropietario)
                .collection('Reservas')
                .doc(this.idReserva)
                .collection('Invitados')
                .where('TipoDocumento', '==', tipoDocumentoRef)
                .where('Documento', '==', this.state.documento)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        existeInvitado = doc.exists;
                    });
                })
                .catch((error) => {
                    e = true;
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });

            if (existeInvitado) {
                this.notificationSystem.current.addNotification(operacion.error('Ya se encuentra registrado al eveneto.'));
                return;
            }

            await Database.collection('Country')
                .doc(this.idCountry)
                .collection('Propietarios')
                .doc(this.idPropietario)
                .collection('Reservas')
                .doc(this.idReserva)
                .collection('Invitados')
                .add({
                    Nombre: this.state.nombre,
                    Apellido: this.state.apellido,
                    Documento: this.state.documento,
                    TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
                    TipoDocumentoLabel: this.state.tipoDocumento.label,
                    Estado: false,
                    IdInvitado: '',
                })
                .catch((error) => {
                    e = true;
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
            if (e) return;
            await Database.collection('Country')
                .doc(this.idCountry)
                .collection('Notificaciones')
                .add({
                    Fecha: new Date(),
                    IdPropietario: Database.doc('Country/' + this.idCountry + '/Propietarios/' + this.idPropietario),
                    Tipo: 'Invitación a evento',
                    Texto: this.state.nombre + ' ' + this.state.apellido + ' se registró para asistir a tu evento "' + this.state.reservaNombre + '"."',
                    Visto: false,
                    IdReserva: this.idReserva,
                })
                .then(this.restaurar())
                .catch((error) => {
                    error = true;
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
            if (e) return;
            this.setState({loading: false});
            this.notificationSystem.current.addNotification(operacion.registroConExito('Se registro con exito.'));
        } catch (e) {
            this.setState({loading: false});
            this.notificationSystem.current.addNotification(operacion.error(e.message));
        }
    }

    FormInvalid() {

        let invalid = (this.errorNombre.error || this.errorApellido.error ||
            this.errorDocumento.error );

        if (!invalid) {
            invalid = (!this.state.nombre || !this.state.apellido ||
               !this.state.documento || !this.state.tipoDocumento);
        }

        if (!invalid) {
            invalid = (!this.state.tipoDocumento.value);
        }

        return invalid;
    }

    render() {
        return (
            <div className={this.state.loading ? "col-12 form" : "col-12"}>
                <div hidden={!this.state.vigente}>
                    <legend>
                        <h3 className="row">Evento: {this.state.reservaNombre}</h3>
                    </legend>
                    <div className="row card">
                        <div className="card-body">
                            <h5>Ingrese sus datos personales: </h5>
                            <div className="row col-md-12">
                                <div className="row-secction col-md-5">
                                    <label> Nombre (*)</label>
                                    <input className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                           placeholder="Nombre"
                                           type="text"
                                           maxLength={50}
                                           value={this.state.nombre}
                                           onChange={this.ChangeNombre}
                                    />
                                    {errorHTML.errorLabel(this.errorNombre)}
                                </div>
                                <div className="row-secction col-md-5">
                                    <label> Apellido (*)</label>
                                    <input className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                           placeholder="Apellido"
                                           type="text"
                                           maxLength={50}
                                           value={this.state.apellido}
                                           onChange={this.ChangeApellido}/>
                                    {errorHTML.errorLabel(this.errorApellido)}
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="row-secction col-md-5">
                                    <label> Tipo de Documento (*)</label>
                                    <Select
                                        className="select-documento"
                                        placeholder="Seleccionar"
                                        classNamePrefix="select"
                                        value={this.state.tipoDocumento}
                                        isSearchable={true}
                                        options={this.state.tipoD}
                                        onChange={this.ChangeSelect.bind(this)}
                                    />
                                </div>
                                <div className="row-secction col-md-5">
                                    <label> Número de Documento (*)</label>
                                    <input className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                           placeholder="Número de Documento"
                                           type="number"
                                           value={this.state.documento}
                                           onChange={this.ChangeDocumento}/>
                                    {errorHTML.errorLabel(this.errorDocumento)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <Button bsStyle="success" fill wd onClick={this.registrar} disabled={this.FormInvalid()}>
                            Agregar invitación
                        </Button>
                    </div>
                </div>
                <div hidden={this.state.vigente || this.state.loading}>
                    <h3 className="row">El link ya no está vigente</h3>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
                <div className="spinnerAlta" hidden={!this.state.loading}>
                    <Spinner radius={80} color={'black'}
                             stroke={5}/>
                </div>
            </div>
        );
    }
}

export default InvitadoEvento;
