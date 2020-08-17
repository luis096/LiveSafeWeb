import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import { errorHTML } from '../Error';
import { operacion } from '../Operaciones';
import Datetime from 'react-datetime';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';
import Spinner from "react-spinner-material";

class AltaEgreso extends Component {
    constructor() {
        super();
        this.state = {
            ingreso: [],
            existePersonaSinIngreso: false,
            busqueda: false,
            tipoDocumento: '',
            documento: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            observacion: '',
            tipoD: [],
            alert: null,
            errorDocumento: { error: false, mensaje: '' },
        };
        this.notificationSystem = React.createRef();
        this.hideAlert = this.hideAlert.bind(this);
        this.reestablecer = this.reestablecer.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeObservacion = this.ChangeObservacion.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscar = this.buscar.bind(this);

        this.errorTipoDocumento = { error: false, mensaje: '' };
        this.errorDocumento = { error: false, mensaje: '' };
        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorObservacion = { error: false, mensaje: '' };
        this.errorFechaNacimiento = { error: false, mensaje: '' };
    }

    async componentDidMount() {
        let tiposDocumento = await operacion.obtenerTiposDocumento();
        this.setState({ tipoD: tiposDocumento });
    }

    ChangeSelect(value) {
        this.setState({ tipoDocumento: value });
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);
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

    ChangeObservacion(event) {
        this.setState({ observacion: event.target.value });
        this.errorObservacion = validator.requerido(event.target.value);
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

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event});
        this.errorFechaNacimiento = validator.fecha(event);
    }


    async buscar() {
        const { ingreso } = this.state;
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);

        //Busco en los ingresos aquel que coincida con los datos ingresados (El ultimo ingreso de la persona)
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Fecha', 'desc')
            .where('Estado', '==', true)
            .where('Documento', '==', this.state.documento)
            .where('TipoDocumento', '==', refTipoDocumento)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists && !doc.data().Egreso) {
                        ingreso.push(doc.data(), doc.id);
                        this.setState({
                            nombre: doc.data().Nombre,
                            apellido: doc.data().Apellido,
                        });
                    }
                });
            });

        if (!ingreso.length) {
            // Buscar entre los propietarios. Para averiguar si existe en el sistema y cargar los datos.
            await Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('Propietarios')
                .where('Documento', '==', this.state.documento)
                .where('TipoDocumento', '==', refTipoDocumento)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.exists) {
                            this.setState({
                                nombre: doc.data().Nombre,
                                apellido: doc.data().Apellido,
                                fechaNacimiento: validator.obtenerFecha(doc.data().FechaNacimiento),
                                existePersonaSinIngreso: true,
                            });
                        }
                    });
                });
        }

        if (!this.state.existePersonaSinIngreso) {
            // Buscar entre los invitados. Para averiguar si existe en el sistema y cargar los datos.
            await Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('Invitados')
                .where('Documento', '==', this.state.documento)
                .where('TipoDocumento', '==', refTipoDocumento)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.exists) {
                            this.setState({
                                nombre: doc.data().Nombre,
                                apellido: doc.data().Apellido,
                                fechaNacimiento: validator.obtenerFecha(doc.data().FechaNacimiento),
                                existePersonaSinIngreso: true,
                            });
                        }
                    });
                });
        }

        this.setState({ ingreso, busqueda: true });
    }

    async registrar() {
        const { ingreso } = this.state;

        let egreso = {
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: operacion.obtenerReferenciaDocumento(this.state.tipoDocumento),
            Documento: this.state.documento,
            Fecha: new Date(),
            Observacion: this.state.observacion,
            IdEncargado: operacion.obtenerMiReferencia(2),
            Estado: true
        };

        if (!this.state.observacion) {
            await Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('Ingresos')
                .doc(ingreso[1])
                .update({ Egreso: true })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
            if (!!ingreso[0].IdPropietario) {
                await Database.collection('Country')
                    .doc(localStorage.getItem('idCountry'))
                    .collection('Notificaciones')
                    .add({
                        Fecha: new Date(),
                        IdPropietario: ingreso[0].IdPropietario,
                        Tipo: 'Egreso',
                        Texto: this.state.nombre + ' ' + this.state.apellido + ' ha salido del Country.',
                        Visto: false,
                    })
                    .catch((error) => {
                        this.notificationSystem.current.addNotification(operacion.error(error.message));
                    });
            }
        }

        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Egresos')
            .add(egreso)
            .then(this.reestablecer)
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
    }

    hideAlert() {
        this.setState({ alert: null });
    }

    reestablecer() {
        this.setState({
            ingreso: [],
            existePersonaSinIngreso: false,
            busqueda: false,
            tipoDocumento: '',
            documento: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            observacion: '',
        });
    }

    FormInvalid() {

        let invalid = (this.errorDocumento.error );

        if (!invalid) {
            invalid = (!this.state.documento || !this.state.tipoDocumento);
        }

        if (!invalid) {
            invalid = (!this.state.tipoDocumento.value);
        }

        return invalid;
    }

    FormInvalidRegister() {

        if (!!this.state.ingreso.length) return false;
        let invalid = (this.errorApellido.error || this.errorNombre.error ||
            this.errorFechaNacimiento.error || this.errorObservacion.error);

        if (!invalid) {
            invalid = (!this.state.nombre || !this.state.apellido ||
                !this.state.fechaNacimiento || !this.state.observacion);
        }

        return invalid;
    }

    render() {
        return (
            <div className={this.state.loading ? "col-12 form" : "col-12"}>
                <legend>
                    <h3 className="row">Nuevo Egreso</h3>
                </legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Buscar persona</h5>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label>Tipo de Documento</label>
                                <Select
                                    value={this.state.tipoDocumento}
                                    isDisabled={this.state.busqueda}
                                    placeholder="Seleccionar"
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelect.bind(this)}
                                    styles={
                                        this.errorTipoDocumento.error
                                            ? {
                                                  control: (base, state) => ({
                                                      ...base,
                                                      borderColor: 'red',
                                                      boxShadow: 'red',
                                                  }),
                                              }
                                            : {}
                                    }
                                />
                                <label className="small text-danger" hidden={!this.errorTipoDocumento.error}>
                                    {this.errorTipoDocumento.mensaje}
                                </label>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Número de Documento</label>
                                <input
                                    className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                    placeholder="Número de Documento"
                                    type="number"
                                    disabled={this.state.busqueda}
                                    value={this.state.documento}
                                    onChange={this.ChangeDocumento}
                                />
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-1 row-secction" style={{ marginTop: '25px', marginRight: '35px' }}>
                                <Button bsStyle="default" style={{ marginRight: '10px' }} fill wd onClick={this.reestablecer}>
                                    Restablecer
                                </Button>
                            </div>
                            <div className="col-md-2 row-secction" style={{ marginTop: '25px' }}>
                                <Button bsStyle="primary" fill wd onClick={this.buscar} disabled={this.FormInvalid()}>
                                    Buscar
                                </Button>
                            </div>
                        </div>
                        <div hidden={!this.state.busqueda}>
                            <div hidden={this.state.ingreso.length}>
                                <div hidden={!this.state.existePersonaSinIngreso}>
                                    <h5 className="row text-danger">
                                        La persona ingresada no tiene un ingreso registrado. Para continuar se debe indicar una observación.
                                    </h5>
                                </div>
                                <div hidden={this.state.existePersonaSinIngreso}>
                                    <h5 className="row text-danger">
                                        La persona ingresada no existe en el sistema. Para registrar el egreso se solicita completar datos
                                        personales junto con una observación.
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row card" hidden={!this.state.busqueda}>
                        <div className="card-body">
                            <h5 className="row">Resultado de la búsqueda </h5>
                            <div className="row">
                                {/*<div className="col-md-3 row-secction">*/}
                                {/*    <label>Tipo de Egreso</label>*/}
                                {/*    <input*/}
                                {/*        className="form-control"*/}
                                {/*        disabled={true}*/}
                                {/*        value={*/}
                                {/*            this.state.ingreso[0] ? (this.state.ingreso[0].IdPropietario ? 'Invitado' : 'Propietario') : '-'*/}
                                {/*        }*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div className="col-md-3 row-secction">
                                    <label>Nombre</label>
                                    <input
                                        className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                        placeholder="Nombre"
                                        type="text"
                                        maxLength={50}
                                        value={this.state.nombre}
                                        onChange={this.ChangeNombre}
                                        disabled={this.state.existePersonaSinIngreso}
                                    />
                                    {errorHTML.errorLabel(this.errorNombre)}
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Apellido</label>
                                    <input
                                        className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                        placeholder="Apellido"
                                        type="text"
                                        maxLength={50}
                                        value={this.state.apellido}
                                        onChange={this.ChangeApellido}
                                        disabled={this.state.existePersonaSinIngreso}
                                    />
                                    {errorHTML.errorLabel(this.errorApellido)}
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Fecha de Nacimiento</label>
                                    <Datetime className={errorHTML.classNameErrorDate(this.errorFechaNacimiento)}
                                        timeFormat={false}
                                        onChange={this.ChangeFechaNacimiento}
                                        value={this.state.fechaNacimiento}
                                        inputProps={{ placeholder: 'Fecha de Nacimiento', disabled: this.state.existePersonaSinIngreso }}
                                    />
                                    {errorHTML.errorLabel(this.errorFechaNacimiento)}
                                </div>
                            </div>
                            <div className="row" hidden={this.state.ingreso.length}>
                                <div className="col-md-6 row-secction">
                                    <label>Observación</label>
                                    <textarea
                                        className={errorHTML.classNameError(this.errorObservacion, 'form-control')}
                                        rows="3"
                                        type="text"
                                        maxLength={200}
                                        placeholder="Observación"
                                        value={this.state.observacion}
                                        onChange={this.ChangeObservacion}
                                    />
                                    {errorHTML.errorLabel(this.errorObservacion)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center" style={{ marginBottom: '10px' }} hidden={!this.state.busqueda}>
                    <Button bsStyle="info" fill wd onClick={this.registrar} disabled={this.FormInvalidRegister()}>
                        Registrar Egreso
                    </Button>
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

export default AltaEgreso;
