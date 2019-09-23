import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Link } from 'react-router-dom';
import { Database, Firebase } from '../../config/config';
import { validator } from '../validator';

class AltaPropietario extends Component {
    constructor() {
        super();
        this.state = {
            idPropietarioCreado: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            titular: '',
            telefonoFijo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            idCountry: '',
            mail: '',
            pass: '',
            tipoD: [],// Para cargar el combo
            resultado: ''
        };
        this.addPropietario = this.addPropietario.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeTelefonoFijo = this.ChangeTelefonoFijo.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.ChangeRadio = this.ChangeRadio.bind(this);
        this.registrar = this.registrar.bind(this);

        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorTelefono = {error: false, mensaje: ''};
        this.errorCelular = {error: false, mensaje: ''};
        this.errorDescripcion = {error: false, mensaje: ''};
        this.errorNacimiento = {error: false, mensaje: ''};
        this.errorMail = {error: false, mensaje: ''};
        this.errorPass = {error: false, mensaje: ''};
        this.errorSelect = {error: false, mensaje: ''};

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

    async addPropietario() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').add({
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Titular: this.state.titular === 'Si' ? true : false,
                Celular: this.state.celular,
                TelefonoFijo: this.state.telefonoFijo,
                Descripcion: this.state.descripcion,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.value),
                Documento: this.state.documento,
                FechaNacimiento: this.state.fechaNacimiento,
                FechaAlta: new Date(),
                Usuario: this.state.mail
            }).then(doc=> {
                this.setState({idPropietarioCreado: doc.id});
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

    ChangeNumero(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento = validator.requerido(event.target.value);
        if (!this.errorDocumento.error) {
            this.errorDocumento = validator.numero(event.target.value);
        }
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        this.errorCelular = validator.numero(event.target.value);
        
        
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    ChangeTelefonoFijo(event) {
        this.setState({telefonoFijo: event.target.value});
        this.errorTelefono = validator.numero(event.target.value);
    }

    ChangeSelect(event) {
        this.setState({tipoDocumento: event});
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento = validator.requerido(event.target.value);
        if (!this.errorDocumento.error) {
            this.errorDocumento = validator.numero(event.target.value);
        }
    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
    }

    ChangeRadio(event) {
        this.setState({titular: event.currentTarget.value});
    }

    /*registrar() {
        //Agregar validaciones para no registrar cualquier gilada
        if (true) {
            this.addPropietario();
        }
    }*/
    registrar() {
        if (true) {
            this.addPropietario();
            this.setState({
                idPropietarioCreado: '',
                nombre: '',
                apellido: '',
                tipoDocumento: '',
                documento: '',
                titular: '',
                telefonoFijo: '',
                celular: '',
                descripcion: '',
                fechaNacimiento: '',
                idCountry: '',
                mail: '',
                pass: '',
                tipoD: [],// Para cargar el combo
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
            this.errorDocumento ||
            this.errorTelefono||
            this.errorCelular||
            this.errorDescripcion
            
            
            
        );
    }

    async crearUsuario() {
        const {mail} = this.state;
        const {pass} = this.state;
        if (true) {
            Firebase.auth().createUserWithEmailAndPassword(mail, pass).then(
                await Database.collection('Usuarios').doc(mail).set({
                    NombreUsuario: mail,
                    TipoUsuario: Database.doc('/TiposUsuario/Propietario'),
                    IdCountry: Database.doc('Country/' + localStorage.getItem('idCountry')),
                    IdPersona: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + this.state.idPropietarioCreado)
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
            <div className="col-12 ">
                <div>
                    <div className="row">
                        <legend> Registrar Propietario</legend>
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
                            <label for="TipoDocumento"> Tipo Documento </label>
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
                            <input type="date" className="form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                            <div className="invalid-feedback">{this.errorNacimiento.mensaje}</div>
                        </div>
                        <fieldset className={this.errorSelect.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <legend> Titular</legend>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio" className="form-check-input"
                                           value='Si' checked={this.state.titular === 'Si'}
                                           onChange={this.ChangeRadio}/>
                                    Si
                                </label>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio" className="form-check-input" value='No'
                                           onChange={this.ChangeRadio} checked={this.state.titular === 'No'}/>
                                    No
                                </label>
                            </div>
                        </fieldset>
                        <div className={this.errorCelular.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="NumeroCelular"> Celular </label>
                            <input type="tel" className={this.errorCelular.error ? 'form-control is-invalid ' : 'form-control'}
                                     placeholder="Mobile number"
                                   value={this.state.celular}
                                   onChange={this.ChangeCelular}/>
                            <div className="invalid-feedback">{this.errorCelular.mensaje}</div>
                        </div>
                        <div className={this.errorTelefono.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="NumeroTelefono"> Telefono Fijo </label>
                            <input type="tel" className={this.errorTelefono.error ? 'form-control is-invalid ' : 'form-control'}
                                   placeholder="Landline number"
                                   value={this.state.telefonoFijo}
                                   onChange={this.ChangeTelefonoFijo}/>
                            <div className="invalid-feedback">{this.errorTelefono.mensaje}</div>
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
                            <textarea className="form-control" id="exampleTextarea" rows="3"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}> </textarea>
                            <div className="invalid-feedback">{this.errorDescripcion.mensaje}</div>
                        </div>

                    </div>
                    <div hidden={!(this.state.resultado == 1)} className="alert alert-success" role="alert">
                    <strong>Se ha creado con exito</strong>
                    </div>
                    <div hidden={!(this.state.resultado == 2)} className="alert alert-danger" role="alert">
                        <strong>Hay errores en el formulario!</strong>
                    </div>
                    <div className="form-group izquierda">
                        <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                        <Link to="/" type="button" className="btn btn-primary boton"
                        >Volver</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default AltaPropietario;
