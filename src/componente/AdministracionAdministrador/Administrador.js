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
            legajo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            fechaAlta: '',
            mail: '',
            pass: '',
            idCountry: '',
            tipoD: [],// Para cargar el combo
            countryList: [],
            resultado: ''
        };
        this.addAdministrador = this.addAdministrador.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeLegajo = this.ChangeLegajo.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.registrar = this.registrar.bind(this);


        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorLegajo = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorCelular = {error: false, mensaje: ''};
        this.errorDescripcion = {error: false, mensaje: ''};
        this.errorNacimiento = {error: false, mensaje: ''};
        this.errorMail = {error: false, mensaje: ''};
        this.errorPass = {error: false, mensaje: ''};
        this.errorSelect = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const {tipoD, countryList} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {

                this.state.tipoD.push(
                    {value: doc.data().Id, label: doc.data().Nombre}
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
        this.setState({tipoD});
        this.setState({countryList});
    }


    async addAdministrador() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Administradores').add({
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Legajo: this.state.legajo,
                Documento: this.state.documento,
                Celular: this.state.celular,
                Descripcion: this.state.descripcion,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
                FechaNacimiento: this.state.fechaNacimiento,
                FechaAlta: new Date(),
                Usuario: this.state.mail
            }).then(doc=> {
                this.setState({idAdminCreado: doc.id});
            });

        await this.crearUsuario();


    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.requerido(event.target.value);
        if (!this.errorNombre.error) {
            this.errorNombre = validator.soloLetras(event.target.value);
        }
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        this.errorApellido = validator.requerido(event.target.value);
        if (!this.errorApellido.error) {
            this.errorApellido = validator.soloLetras(event.target.value);
        }
    }

    ChangeLegajo(event) {
        this.setState({legajo: event.target.value});
        this.errorLegajo = validator.requerido(event.target.value);
        if (!this.errorLegajo.error) {
            this.errorLegajo = validator.numero(event.target.value);
        }
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        this.errorCelular = validator.numero(event.target.value);
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento = validator.requerido(event.target.value);
        if (!this.errorDocumento.error) {
            this.errorDocumento = validator.numero(event.target.value);
        }
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
        this.errorNumero = validator.requerido(event.target.value);
    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
        this.errorNumero = validator.requerido(event.target.value);
    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
        this.errorNumero = validator.requerido(event.target.value);
    }


    /*registrar() {
        Agregar validaciones para no registrar cualquier gilada
        if (true) {
            this.addAdministrador();
        }
    }*/
    registrar() {
        if (!(this.esValido())) {
            // this.addCountry();
            this.setState({
                nombre: '',
                apellido: '',
                tipoDocumento: '',
                documento: '',
                legajo: '',
                celular: '',
                descripcion: '',
                fechaNacimiento: '',
                fechaAlta: '',
                mail: '',
                pass: '',
                tipoD: [],
                resultado: 1
            });
        } else {
            this.setState({resultado: 2});
        }
    }

    esValido() {
        return (
            this.errorNombre ||
            this.errorApellido ||
            this.errorLegajo ||
            this.errorDocumento ||
            this.errorCelular ||
            this.errorDescripcion||
            this.errorNacimiento||
            this.errorMail||
            this.errorPass
        );
    }
    async crearUsuario() {
        const {mail} = this.state;
        const {pass} = this.state;
        if (true) {
            Firebase.auth().createUserWithEmailAndPassword(mail, pass).then(
                await Database.collection('Usuarios').doc(mail).set({
                    NombreUsuario: mail,
                    TipoUsuario: Database.doc('/TiposUsuario/Administrador'),
                    IdCountry: Database.doc('Country/' + localStorage.getItem('idCountry')),
                    IdPersona: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Administradores/' + this.state.idAdminCreado)
                })
            )
                .catch(function (error) {
                    console.log('error :', error);
                    //La pass debe tener al menos 6 caracteres wachina
                });
        }
    }


    render() {
        return (
            <div className="col-md-12 ">
                <div>
                    <div className="row">

                        <legend> Registrar Administrador</legend>
                        <div className={this.errorNombre.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre"> Nombre </label>
                            <input type="name" className={this.errorNombre.error ? 'form-control is-invalid ' : 'form-control'} 
                                    placeholder="Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                            <div className="invalid-feedback">{this.errorNombre.mensaje}</div>
                        </div>
                        <div className={this.errorApellido.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Apellido"> Apellido </label>
                            <input type="family-name" className={this.errorApellido.error ? 'form-control is-invalid ' : 'form-control'} 
                                    placeholder="Surname"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                            <div className="invalid-feedback">{this.errorApellido.mensaje}</div>
                        </div>
                        <div className={this.errorSelect.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Tipo Documento"> Tipo Documento </label>
                            <Select
                                id='documento'
                                className="select-documento"
                                classNamePrefix="select"
                                // defaultValue={this.state.tipoD[0]}
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.tipoD}
                                onChange={this.ChangeSelect.bind(this)}
                            />
                            <div className="invalid-feedback">{this.errorNombre.mensaje}</div>
                        </div>
                        <div className={this.errorDocumento.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="NumeroDocumento"> Numero de Documento </label>
                            <input type="document" className={this.errorDocumento.error ? 'form-control is-invalid ' : 'form-control'}
                                   placeholder="Document number"
                                   value={this.state.documento}
                                   onChange={this.ChangeDocumento}/>
                            <div className="invalid-feedback">{this.errorDocumento.mensaje}</div>
                        </div>
                        <div className={this.errorNacimiento.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="FechaNacimiento"> Fecha de Nacimiento </label>
                            <input type="date" className={this.errorNacimiento.error ? 'form-control is-invalid ' : 'form-control'} 
                                    name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                            <div className="invalid-feedback">{this.errorNacimiento.mensaje}</div>
                        </div>
                        <div className={this.errorLegajo.error ? 'col-md-6 form-group has-feedback has-danger' : "col-md-6 flex-container form-group"}>
                            <label for="Legajo"> Legajo </label>
                            <input type="tel" className={this.errorLegajo.error ? 'form-control is-invalid ' : 'form-control'} 
                                    placeholder="Legajo"
                                   value={this.state.legajo}
                                   onChange={this.ChangeLegajo}/>
                            <div className="invalid-feedback">{this.errorLegajo.mensaje}</div>
                        </div>
                        <div className={this.errorSelect.error ? 'col-md-6 form-group has-feedback has-danger' : "col-md-6 flex-container form-group"}>
                            <label for="Country"> Country </label>
                            <Select
                                id='country'
                                className="select-country"
                                classNamePrefix="select"
                                // defaultValue={this.state.countryList[0]}
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.countryList}
                                onChange={this.ChangeSelectCountry.bind(this)}
                            />
                            <div className="invalid-feedback">{this.errorNombre.mensaje}</div>
                        </div>
                        <div className={this.errorCelular.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="NumeroCelular"> Celular </label>
                            <input type="tel" className={this.errorCelular.error ? 'form-control is-invalid ' : 'form-control'}
                                    placeholder="Mobile number"
                                   value={this.state.celular}
                                   onChange={this.ChangeCelular}/>
                            <div className="invalid-feedback">{this.errorCelular.mensaje}</div>
                        </div>
                        <div className={this.errorMail.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="exampleInputEmail1"> Dirección de correo electrónico </label>
                            <input type="email" className={this.errorMail.error ? 'form-control is-invalid ' : 'form-control'} 
                                    id="exampleInputEmail1"
                                   aria-describe by="emailHelp" placeholder="Enter email"
                                   value={this.state.mail}
                                   onChange={this.ChangeMail}/>
                            <div className="invalid-feedback">{this.errorMail.mensaje}</div>
                        </div>
                        <div className={this.errorPass.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="exampleInputPassword1"> Contraseña </label>
                            <input type="password" className={this.errorPass.error ? 'form-control is-invalid ' : 'form-control'} 
                                    id="exampleInputPassword1"
                                   placeholder="Password"
                                   value={this.state.pass}
                                   onChange={this.ChangePass}/>
                            <div className="invalid-feedback">{this.errorPass.mensaje}</div>
                        </div>
                        <div className={this.errorDescripcion.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="exampleTextarea"> Descripcion </ label>
                            <textarea className={this.errorDescripcion.error ? 'form-control is-invalid ' : 'form-control'}
                                        id="exampleTextarea" rows="3"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}
                            > </textarea>
                            <div className="invalid-feedback">{this.errorDescripcion.mensaje}</div>
                        </div>
                
                    </div>
                    <div hidden={!(this.state.resultado == 1)} className="alert alert-success" role="alert">
                        <strong>Se ha creado con exito</strong>
                    </div>
                    <div hidden={!(this.state.resultado == 2)} className="alert alert-danger" role="alert">
                        <strong>Hay errores en el formulario!</strong>
                    </div>
                    <div className={this.errorNombre.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                        <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                        <Link to="/" type="button" className="btn btn-primary boton"
                        >Volver</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default AltaAdministrador;