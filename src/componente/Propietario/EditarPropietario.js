import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { errorHTML } from '../Error';
import { validator } from '../validator';
import Switch from 'react-bootstrap-switch';
import Datetime from 'react-datetime';
import Button from 'components/CustomButton/CustomButton.jsx';
import { operacion } from '../Operaciones';
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";


class EditarPropietario extends Component {

    constructor(props) {
        super(props);
        this.state = {
            propietario: [],
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            titular: '',
            celular: '',
            fechaNacimiento: '',
            usuario: '',
            idTipoPersona: '',
            idCountry: '',

            tipoD: [],// Para cargar el combo
            temp: '',
            resultado: ''
        };
        this.notificationSystem = React.createRef();
        this.editPropietario = this.editPropietario.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeRadio = this.ChangeRadio.bind(this);
        this.registrar = this.registrar.bind(this);

        this.idTD = '';
        const url = this.props.location.pathname.split('/');
        this.idPropietario = url[url.length - 1];


        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorDocumento = { error: false, mensaje: '' };
        this.errorCelular = { error: false, mensaje: '' };
        this.errorMail = { error: false, mensaje: '' }
        this.errorTipoDocumento = { error: false, mensaje: '' };

    }

    async componentDidMount() {
        const { tipoD, propietario } = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    { value: doc.id, label: doc.data().Nombre }
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(this.idPropietario).get()
            .then(doc => {
                if (doc.exists) {
                    this.state.propietario.push(doc.data());
                }
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({ tipoD });
        this.setState({ propietario });
        const estrella = this.state.propietario[0];

        await Database.collection('TipoDocumento').doc(estrella.TipoDocumento.id).get()
            .then(doc => {
                if (doc.exists) {
                    this.state.tipoDocumento = { value: doc.id, label: doc.data().Nombre };
                }
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({
            nombre: estrella.Nombre,
            apellido: estrella.Apellido,
            titular: estrella.Titular,
            documento: estrella.Documento,
            fechaNacimiento: validator.obtenerFecha(estrella.FechaNacimiento),
            fechaAlta: estrella.FechaAlta,
            telefonoFijo: estrella.TelefonoFijo,
            celular: estrella.Celular,
            descripcion: estrella.Descripcion,
            usuario: estrella.Usuario
        });
    }


    async editPropietario() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(this.idPropietario).set({
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Titular: this.state.titular,
                Celular: this.state.celular,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
                Documento: this.state.documento,
                FechaNacimiento: new Date(this.state.fechaNacimiento),
                FechaAlta: this.state.fechaAlta,
                Usuario: this.state.usuario
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

    }

    ChangeNombre(event) {
        this.setState({ nombre: event.target.value });
        if (event.target.value == "") { this.errorNombre = validator.requerido(event.target.value) }
        else { this.errorNombre = validator.soloLetras(event.target.value) }
    }

    ChangeApellido(event) {
        this.setState({ apellido: event.target.value });
        if (event.target.value == "") { this.errorApellido = validator.requerido(event.target.value) }
        else { this.errorApellido = validator.soloLetras(event.target.value) }

    }

    ChangeNumero(event) {
        this.setState({ numero: event.target.value });
        this.errorNumero = validator.numero(event.target.value);

    }


    ChangeDocumento(event) {
        this.setState({ documento: event.target.value });
        if (event.target.value == "") { this.errorDocumento = validator.requerido(event.target.value) }
        else { this.errorDocumento = validator.numero(event.target.value) }

    }

    ChangeCelular(event) {
        this.setState({ celular: event.target.value });
        if (event.target.value == "") { this.errorCelular = validator.requerido(event.target.value) }
        else { this.errorCelular = validator.numero(event.target.value) }

    }


    ChangeSelect(value) {
        this.setState({ tipoDocumento: value });
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);

    }

    ChangeFechaNacimiento(event) {
        this.setState({ fechaNacimiento: event });
    }

    ChangeRadio(event) {
        this.setState({ titular: event.currentTarget.value });
    }

    registrar() {
        // if (this.state.nombre == "" || this.state.apellido == "" || this.state.documento =="" || this.state.tipoDocumento == "" ||
        //     this.state.fechaNacimiento == "" || this.state.celular == "" || this.state.mail == "") {
        //         operacion.sinCompletar("Debe completar todos los campos requeridos")
        //         return
        //     }
        this.editPropietario();

    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Editar Propietario</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Nombre </label>
                                <input type="name" className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                    placeholder="Nombre"
                                    value={this.state.nombre}
                                    onChange={this.ChangeNombre}
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Apellido </label>
                                <input className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                    placeholder="Apellido"
                                    value={this.state.apellido}
                                    onChange={this.ChangeApellido} />
                                {errorHTML.errorLabel(this.errorApellido)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Fecha de Nacimiento </label>
                                <Datetime
                                    inputProps={{ placeholder: 'Fecha de Nacimiento' }}
                                    timeFormat={false}
                                    value={this.state.fechaNacimiento}
                                    onChange={this.ChangeFechaNacimiento}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Número de Documento </label>
                                <input className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                    placeholder="Número de Documento"
                                    value={this.state.documento}
                                    onChange={this.ChangeDocumento} />
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Tipo de Documento </label>
                                <Select
                                    placeholder="Seleccionar"
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    value={this.state.tipoDocumento}
                                    onChange={this.ChangeSelect.bind(this)}
                                    styles={this.errorTipoDocumento.error ? {
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: 'red',
                                            boxShadow: 'red'
                                        })
                                    } : {}}
                                />
                                <label className='small text-danger'
                                    hidden={!this.errorTipoDocumento.error}>{this.errorTipoDocumento.mensaje}</label>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Celular </label>
                                <input className={errorHTML.classNameError(this.errorCelular, 'form-control')}
                                    placeholder="Celular"
                                    value={this.state.celular}
                                    onChange={this.ChangeCelular}
                                />
                                {errorHTML.errorLabel(this.errorCelular)}
                            </div>
                        </div>
                        {/*<div className="row">*/}
                        {/*    <fieldset className="col-md-6 row-secction">*/}
                        {/*        <label> Titular</label>*/}
                        {/*        <div className="form-check">*/}
                        {/*            <Switch disabled={true} onText="Si" offText="No"*/}
                        {/*                value={this.state.titular}*/}
                        {/*                onChange={() => {*/}
                        {/*                    this.ChangeRadio();*/}
                        {/*                }} />*/}
                        {/*        </div>*/}
                        {/*    </fieldset>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>
                        Guardar cambios
                    </Button>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
            </div>
        );


    }
}

export default EditarPropietario;
