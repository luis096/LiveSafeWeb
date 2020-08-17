import React, { Component } from 'react';
import Select from 'react-select';
import { Database, Firebase } from '../../config/config';
import { validator } from '../validator';
import Button from 'components/CustomButton/CustomButton.jsx';
import Datetime from 'react-datetime';
import SweetAlert from 'react-bootstrap-sweetalert';
import { operacion } from '../Operaciones';
import { errorHTML } from '../Error';
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";



class AltaAdministrador extends Component {

    constructor() {
        super();
        this.state = {
            idAdminCreado: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            celular: '',
            fechaNacimiento: new Date(),
            fechaAlta: '',
            mail: '',
            idCountry: '',
            tipoD: [],
            countryList: [],
            errorMail: { error: false, mensaje: '' }
        };
        this.notificationSystem = React.createRef();
        this.addAdministrador = this.addAdministrador.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.registrar = this.registrar.bind(this);

        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorDocumento = { error: false, mensaje: '' };
        this.errorCelular = { error: false, mensaje: '' };
        this.errorTipoDocumento = { error: false, mensaje: '' };
        this.errorMail = { error: false, mensaje: '' }
        this.errorCountry = { error: false, mensaje: '' }

    }


    async componentDidMount() {
        const { tipoD, countryList } = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                tipoD.push(
                    { value: doc.id, label: doc.data().Nombre }
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        await Database.collection('Country').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.countryList.push(
                    { value: doc.id, label: doc.data().Nombre }
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        this.setState({ tipoD, countryList });
    }


    async addAdministrador() {
        await Database.collection('Country').doc(this.state.idCountry.value)
            .collection('Administradores').add({
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Documento: this.state.documento,
                Celular: this.state.celular,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.value),
                FechaNacimiento: new Date(this.state.fechaNacimiento),
                FechaAlta: new Date(),
                Usuario: this.state.mail,
            }).then(doc => {
                this.setState({ idAdminCreado: doc.id });
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        await this.crearUsuario();
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

    ChangeCelular(event) {
        this.setState({ celular: event.target.value });
        if (event.target.value == "") { this.errorCelular = validator.requerido(event.target.value) }
        else { this.errorCelular = validator.numero(event.target.value) }
    }

    ChangeDocumento(event) {
        this.setState({ documento: event.target.value });
        if (event.target.value == "") { this.errorDocumento = validator.requerido(event.target.value) }
        else { this.errorDocumento = validator.numero(event.target.value) }
    }

    ChangeMail(event) {
        this.setState({ mail: event.target.value });
        if (event.target.value == "") { this.errorMail = validator.requerido(event.target.value) }
        else { this.errorMail = validator.mail(event.target.value) }
    }

    ChangeSelect(value) {
        this.setState({ tipoDocumento: value });
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);

    }

    ChangeSelectCountry(value) {
        this.setState({ idCountry: value });
        this.errorCountry = validator.requerido(value ? value.value : null);

    }

    ChangeFechaNacimiento(event) {
        this.setState({ fechaNacimiento: event });
    }


    async registrar() {
        // if (this.state.nombre == "" || this.state.apellido == "" || this.state.documento =="" || this.state.tipoDocumento == "" ||
        //     this.state.fechaNacimiento == "" || this.state.celular == "" || this.state.mail == "") {
        //         operacion.sinCompletar("Debe completar todos los campos requeridos")
        //         return
        //     }
        let mailValido = await validator.validarMail(this.state.mail);
        if (mailValido) {
            await this.addAdministrador();
        } else {
            this.setState({ errorMail: { error: true, mensaje: 'El mail ingresado ya esta en uso. Intente nuevamente' } })
        }
    }

    async crearUsuario() {
        const { mail } = this.state;
        const pass = this.state.documento;

        await Database.collection('UsuariosTemp').doc(mail).set({
            NombreUsuario: mail,
            TipoUsuario: Database.doc('/TiposUsuario/Administrador'),
            IdCountry: Database.doc('Country/' + this.state.idCountry.value),
            IdPersona: Database.doc('Country/' + this.state.idCountry.value + '/Administradores/' + this.state.idAdminCreado),
            Password: pass
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });

    }


    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Nuevo Administrador</h3></legend>
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
                                <label> Número  de Documento </label>
                                <input className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                    placeholder="Número  de Documento"
                                    value={this.state.documento}
                                    onChange={this.ChangeDocumento} />
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Tipo de Documento </label>
                                <Select
                                    isClearable={true}
                                    placeholder="Seleccionar"
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
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Dirección de correo electrónico </label>
                                <input type="email" className={errorHTML.classNameError(this.errorMail, 'form-control')}
                                    placeholder="Correo electrónico"
                                    onChange={this.ChangeMail}
                                    value={this.state.mail} />
                                {errorHTML.errorLabel(this.errorMail)}
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Country </label>
                                <Select
                                    placeholder="Seleccionar"
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.countryList}
                                    onChange={this.ChangeSelectCountry.bind(this)}
                                    styles={this.errorCountry.error ? {
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: 'red',
                                            boxShadow: 'red'
                                        })
                                    } : {}}
                                />
                                <label className='small text-danger'
                                    hidden={!this.errorCountry.error}>{this.errorCountry.mensaje}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>
                        Registrar
                    </Button>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
            </div>
        );
    }
}

export default AltaAdministrador;
