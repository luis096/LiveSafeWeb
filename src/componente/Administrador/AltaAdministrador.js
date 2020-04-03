import React, { Component } from 'react';
import Select from 'react-select';
import { Database, Firebase } from '../../config/config';
import { validator } from '../validator';
import Button from 'components/CustomButton/CustomButton.jsx';
import Datetime from 'react-datetime';
import { errorHTML } from '../Error';


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
            mail: '@countryapp.com',
            idCountry: '',
            tipoD: [],
            countryList: [],
            errorMail: {error: false, mensaje: ''}
        };
        this.addAdministrador = this.addAdministrador.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.registrar = this.registrar.bind(this);


        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorCelular= {error:false, mensaje:''};
        
        this.errorMail= {error:false, mensaje:''}
        
    }
    

    async componentDidMount() {
        const {tipoD, countryList} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        await Database.collection('Country').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.countryList.push(
                    {value: doc.id, label: doc.data().Nombre}
                );

            });
        });
        this.setState({tipoD, countryList});
    }


    async addAdministrador() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Administradores').add({
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Documento: this.state.documento,
                Celular: this.state.celular,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.value),
                FechaNacimiento: new Date(this.state.fechaNacimiento),
                FechaAlta: new Date(),
                Usuario: this.state.mail,
            }).then(doc=> {
                this.setState({idAdminCreado: doc.id});
            });
        await this.crearUsuario();
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre= validator.soloLetras(event.target.value);

    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        this.errorApellido= validator.soloLetras(event.target.value);

    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        this.errorCelular= validator.numero(event.target.value);

    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento= validator.numero(event.target.value);

    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
        this.errorMail= validator.mail(event.target.value);

    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeSelectCountry(value) {
        this.setState({idCountry: value});
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event});
    }


    async registrar() {
        let mailValido = await validator.validarMail(this.state.mail)
        if (mailValido) {
            this.addAdministrador();
        } else {
            this.setState({errorMail: {error: true, mensaje: 'El mail ingresado ya esta en uso. Intente nuevamente'}})
        }
    }

    async crearUsuario() {
        const {mail} = this.state;
        const pass = this.state.documento;

            await Database.collection('UsuariosTemp').doc(mail).set({
                NombreUsuario: mail,
                TipoUsuario: Database.doc('/TiposUsuario/Administrador'),
                IdCountry: Database.doc('Country/' + localStorage.getItem('idCountry')),
                IdPersona: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Administradores/' + this.state.idAdminCreado)
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
                                <label> Numero de Documento </label>
                                <input className={ errorHTML.classNameError(this.errorDocumento, 'form-control') }
                                       placeholder="Numero de Documento"
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento}/>
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Tipo de Documento </label>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    value = {this.state.tipoDocumento }
                                    onChange={this.ChangeSelect.bind(this)}
                                />
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
                            <div className="col-md-6 row-secction">
                                <label> Country </label>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.countryList}
                                    onChange={this.ChangeSelectCountry.bind(this)}
                                />
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

export default AltaAdministrador;