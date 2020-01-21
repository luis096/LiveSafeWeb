import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Link } from 'react-router-dom';
import { Database, Firebase } from '../../config/config';
import { validator } from '../validator';

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
            descripcion: '',
            fechaNacimiento: '',
            fechaAlta: '',
            mail: '@countryapp.com',
            pass: '',
            idCountry: '',
            tipoD: [],
            countryList: [],
            resultado: '',
            errorMail: {error: false, mensaje: ''}
        };
        this.addAdministrador = this.addAdministrador.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.registrar = this.registrar.bind(this);
    }

    async componentDidMount() {
        const {tipoD, countryList} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
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
                Descripcion: this.state.descripcion,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.value),
                FechaNacimiento: this.state.fechaNacimiento,
                FechaAlta: new Date(),
                Usuario: this.state.mail,
            }).then(doc=> {
                this.setState({idAdminCreado: doc.id});
            });
        await this.crearUsuario();
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
        this.state.errorMail = {error: false, mensaje: ''};
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }


    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeSelectCountry(value) {
        this.setState({idCountry: value});
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event.target.value});
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
        if (true) {
            await Database.collection('UsuariosTemp').doc(mail).set({
                NombreUsuario: mail,
                TipoUsuario: Database.doc('/TiposUsuario/Administrador'),
                IdCountry: Database.doc('Country/' + localStorage.getItem('idCountry')),
                IdPersona: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Administradores/' + this.state.idAdminCreado)
            });
        }
    }


    render() {
        return (
            <div className="col-md-12 ">
                <div>
                    <div className="row">
                        <legend> Registrar Administrador</legend>
                        <div className="col-md-6 flex-container form-group">
                            <label> Nombre </label>
                            <input type="name" className="form-control" placeholder="Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                        </div>
                        <div className="col-md-6 flex-container form-group">
                            <label> Apellido </label>
                            <input type="family-name" className="form-control" placeholder="Surname"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                        </div>
                        <div className="col-md-6 flex-container form-group">
                            <label> Tipo Documento </label>
                            <Select
                                id='documento'
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
                        <div className="col-md-6 flex-container form-group">
                            <label> Numero de Documento </label>
                            <input type="document" className="form-control"
                                   placeholder="Document number"
                                   value={this.state.documento}
                                   onChange={this.ChangeDocumento}/>
                        </div>
                        <div className="col-md-6 flex-container form-group">
                            <label> Fecha de Nacimiento </label>
                            <input type="date" className="form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                        <div className="col-md-6 flex-container form-group">
                            <label> Country </label>
                            <Select
                                id='country'
                                className="select-country"
                                classNamePrefix="select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.countryList}
                                onChange={this.ChangeSelectCountry.bind(this)}
                            />
                        </div>
                        <div className="col-md-6 flex-container form-group">
                            <label> Celular </label>
                            <input type="tel" className="form-control" placeholder="Mobile number"
                                   value={this.state.celular}
                                   onChange={this.ChangeCelular}/>
                        </div>
                        <div className="col-md-6 flex-container form-group">
                            <label> Dirección de correo electrónico </label>
                            <input type="email" className={this.state.errorMail.error? "form-control error":"form-control"}
                                   placeholder="ingrese el mail"
                                   onChange={this.ChangeMail}
                                   value={this.state.mail}/>
                            <label className='small text-danger'
                                   hidden={!this.state.errorMail.error}>{this.state.errorMail.mensaje}</label>
                        </div>
                        <div className="col-md-6 flex-container form-group">
                            <label> Descripcion </ label>
                            <textarea className="form-control" id="exampleTextarea" rows="3"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}
                            ></textarea>
                        </div>
                    </div>
                    <div className="form-group izquierda">
                        <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AltaAdministrador;