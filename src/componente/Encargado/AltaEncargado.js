import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Database, Firebase } from '../../config/config';
import { errorHTML } from '../Error';
import Datetime from 'react-datetime';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";
import {operacion} from "../Operaciones";


class AltaEncargado extends Component {

    constructor() {
        super();
        this.state = {
            idEncargadoCreado: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            celular: '',
            fechaNacimiento: new Date(),
            fechaAlta: '',
            mail: '',
            idCountry: '',
            tipoD: [],// Para cargar el combo
            resultado: ''
        };
        this.notificationSystem = React.createRef();
        this.addEncargado = this.addEncargado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.registrar = this.registrar.bind(this);

        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorCelular= {error:false, mensaje:''};
        this.errorMail = {error:false , mensaje:''}
        this.errorTipoDocumento = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const {tipoD} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        this.setState({tipoD});
    }


    async addEncargado() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Encargados').add({
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Documento: this.state.documento,
                Celular: this.state.celular,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
                FechaNacimiento: new Date(this.state.fechaNacimiento),
                FechaAlta: new Date(),
                Usuario: this.state.mail
            }).then(doc=> {
                this.setState({idEncargadoCreado: doc.id});
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        await this.crearUsuario();

    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        if (event.target.value == "")
        {this.errorNombre= validator.requerido(event.target.value)}
        else{this.errorNombre =validator.soloLetras(event.target.value)}
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        if (event.target.value == "")
        {this.errorApellido = validator.requerido(event.target.value)}
        else{this.errorApellido =validator.soloLetras(event.target.value)}

    }


    ChangeCelular(event) {
        this.setState({celular: event.target.value});

        if (event.target.value == "")
        {this.errorCelular = validator.requerido(event.target.value)}
        else{this.errorCelular =validator.numero(event.target.value)}

    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        if (event.target.value == "")
        {this.errorDocumento = validator.requerido(event.target.value)}
        else{this.errorDocumento =validator.numero(event.target.value)}

    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event});
    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
        if (event.target.value == "")
        {this.errorMail = validator.requerido(event.target.value)}
        else{this.errorMail =validator.mail(event.target.value)}

    }


    async registrar() {
        let mailValido = await validator.validarMail(this.state.mail);
        if (mailValido) {
            await this.addEncargado();
            await this.reset();
        } else {
            this.setState({errorMail: {error: true, mensaje: 'El mail ingresado ya esta en uso. Intente nuevamente'}})
        }
    }

    reset(){
        this.setState({
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            celular: '',
            fechaNacimiento: '',
            mail: '',
            resultado: '',
        })
    }

    async crearUsuario() {
        const {mail} = this.state;
        const pass = this.state.documento;

        await Database.collection('UsuariosTemp').doc(mail).set({
                NombreUsuario: mail,
                TipoUsuario: Database.doc('/TiposUsuario/Encargado'),
                IdCountry: Database.doc('Country/' + localStorage.getItem('idCountry')),
                IdPersona: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + this.state.idEncargadoCreado),
                Password: pass
            }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });

    }


    render() {
        return (
            <div className="col-12">
            <legend><h3 className="row">Nuevo Encargado</h3></legend>
            {this.state.alert}
            <div className="row card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 row-secction">
                            <label> Nombre </label>
                            <input type="name" className={ errorHTML.classNameError(this.errorNombre, 'form-control') }
                                   placeholder="Nombre"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                            {errorHTML.errorLabel(this.errorNombre)}
                        </div>
                        <div className="col-md-4 row-secction">
                            <label> Apellido </label>
                            <input className={ errorHTML.classNameError(this.errorApellido, 'form-control') }
                                   placeholder="Apellido"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                            {errorHTML.errorLabel(this.errorApellido)}
                        </div>
                        <div className="col-md-4 row-secction">
                            <label> Fecha de Nacimiento </label>
                            <Datetime
                                inputProps={{placeholder: 'Fecha de Nacimiento'}}
                                timeFormat={false}
                                value={this.state.fechaNacimiento}
                                onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 row-secction">
                            <label> Número de Documento </label>
                            <input className={ errorHTML.classNameError(this.errorDocumento, 'form-control') }
                                   placeholder="Número de Documento"
                                   value={this.state.documento}
                                   onChange={this.ChangeDocumento}/>
                            {errorHTML.errorLabel(this.errorDocumento)}
                        </div>
                        <div className="col-md-4 row-secction">
                            <label> Tipo de Documento </label>
                            <Select
                                placeholder="Seleccionar"
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.tipoD}
                                value = {this.state.tipoDocumento }
                                onChange={this.ChangeSelect.bind(this)}
                                styles={this.errorTipoDocumento.error ? {
                                    control: (base, state)=>({
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
                            <input className={ errorHTML.classNameError(this.errorCelular, 'form-control') }
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
                            <input type="email" className={ errorHTML.classNameError(this.errorMail, 'form-control') }
                                   placeholder="ingrese el mail"
                                   onChange={this.ChangeMail}
                                   value={this.state.mail}/>
                            {errorHTML.errorLabel(this.errorMail)}
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
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
        </div>
        );


    }
}

export default AltaEncargado;
