import React, { Component } from 'react';
import Select from 'react-select';
//import '../Style/Alta.css';
import '../Propietario/Index.css';
import { Link } from 'react-router-dom';
import { Database, Firebase } from '../../config/config';
import { errorHTML } from '../Error';
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
            titular: 'Si',
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
        this.reset = this.reset.bind(this);

        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorCelular= {error:false, mensaje:''};
        this.errorTelefono= {error:false, mensaje:''};
        this.errorMail= {error:false, mensaje:''}
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
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        this.errorApellido = validator.soloLetras(event.target.value);
    }

    ChangeNumero(event) {
        this.setState({numero: event.target.value});
        this.errorNumero = validator.numero(event.target.value);
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
        this.errorDocumento = validator.numero(event.target.value);
    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
        this.erroMail = validator.mail(event.target.value)
    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
    }

    ChangeRadio(event) {
        this.setState({titular: event.currentTarget.value});
    }

    async registrar() {
        //Agregar validaciones para no registrar cualquier gilada
        if (true) {
            await this.addPropietario();
            await this.reset();
        }
    }

    reset(){
        this.setState({
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            titular: 'Si',
            telefonoFijo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            mail: '',
            pass: '',
            resultado: '',
        })
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
                        <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Nombre </label>
                            <input  className={ errorHTML.classNameError(this.errorNombre, 'form-control') } 
                                    placeholder="Nombre"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}/>
                             {errorHTML.errorLabel(this.errorNombre)}
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="Apellido"> Apellido </label>
                            <input type="family-name" className={ errorHTML.classNameError(this.errorApellido, 'form-control') }
                                   placeholder="Apellido"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                            {errorHTML.errorLabel(this.errorApellido)}       
                        </div>
                        <div className="col-md-6  flex-container form-group">
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
                        <div className="col-md-6  flex-container form-group">
                            <label for="NumeroDocumento"> Numero de Documento </label>
                            <input className={ errorHTML.classNameError(this.errorDocumento, 'form-control') }
                                   placeholder="Numero del documento"
                                   value={this.state.documento}
                                   onChange={this.ChangeDocumento}/>
                            {errorHTML.errorLabel(this.errorDocumento)}       
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="FechaNacimiento"> Fecha de Nacimiento </label>
                            <input type="date" className="form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                        <fieldset className="col-md-6  flex-container form-group">
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
                        <div className="col-md-6  flex-container form-group">
                            <label for="NumeroCelular"> Celular </label>
                            <input type="tel" className={ errorHTML.classNameError(this.errorCelular, 'form-control') }
                                   placeholder="Numero de celular"
                                   value={this.state.celular}
                                   onChange={this.ChangeCelular}/>
                            {errorHTML.errorLabel(this.errorCelular)}        
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="NumeroTelefono"> Telefono Fijo </label>
                            <input type="tel" className={ errorHTML.classNameError(this.errorTelefono, 'form-control') }
                                   placeholder="Numero de telefono fijo"
                                   value={this.state.telefonoFijo}
                                   onChange={this.ChangeTelefonoFijo}/>
                            {errorHTML.errorLabel(this.errorTelefono)}       
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="exampleInputEmail1"> Dirección de correo electrónico </label>
                            <input type="name" className={ errorHTML.classNameError(this.errorMail, 'form-control') } id="exampleInputEmail1"
                                   aria-describe by="emailHelp" placeholder="Mail"
                                   value={this.state.mail}
                                   onChange={this.ChangeMail}/>
                            {errorHTML.errorLabel(this.errorMail)}        
                        </div>
                        
                        <div className="col-md-6  flex-container form-group">
                            <label for="exampleTextarea"> Descripcion </ label>
                            <textarea className="form-control" id="exampleTextarea" rows="3"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}> </textarea>
                        </div>

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