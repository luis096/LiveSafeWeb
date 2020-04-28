import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Link } from 'react-router-dom';
import { Database, Firebase } from '../../config/config';
import { errorHTML } from '../Error';
import { validator } from '../validator';
import SweetAlert from 'react-bootstrap-sweetalert';
import { operacion } from '../Operaciones';

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
            descripcion: '',
            fechaNacimiento: '',
            fechaAlta: '',
            mail: '',
            pass: '',
            idCountry: '',
            tipoD: [],// Para cargar el combo
            resultado: ''
        };
        this.addEncargado = this.addEncargado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
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
                Descripcion: this.state.descripcion,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
                FechaNacimiento: this.state.fechaNacimiento,
                FechaAlta: new Date(),
                Usuario: this.state.mail
            }).then(doc=> {
                this.setState({idEncargadoCreado: doc.id});
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
        this.setState({fechaNacimiento: event.target.value});
    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
        if (event.target.value == "")
        {this.errorMail = validator.requerido(event.target.value)}
        else{this.errorMail =validator.mail(event.target.value)}

    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
    }


    registrar() {
        if (this.state.nombre == "" || this.state.apellido == "" || this.state.documento =="" || this.state.tipoDocumento == "" ||
            this.state.fechaNacimiento == "" || this.state.celular == "" || this.state.mail == "") {
                operacion.sinCompletar("Debe completar todos los campos requeridos")
                return
            }
        if (true) {
            this.addEncargado();
        }
    }

    async crearUsuario() {
        const {mail} = this.state;
        const {pass} = this.state;
        if (true) {
            Firebase.auth().createUserWithEmailAndPassword(mail, pass).then(
                await  Database.collection('Usuarios').doc(mail).set({
                    NombreUsuario: mail,
                    TipoUsuario: Database.doc('/TiposUsuario/Encargado'),
                    IdCountry: Database.doc('Country/' + localStorage.getItem('idCountry')),
                    IdPersona: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + this.state.idEncargadoCreado)
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
            <div className="col-12">
                <div className="row">
                    <legend> Registrar Alta</legend>
                    <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Nombre </label>
                            <input type="name" className={ errorHTML.classNameError(this.errorNombre, 'form-control') } placeholder="Nombre"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                            {errorHTML.errorLabel(this.errorNombre)}
                    </div>
                    <div className="col-md-6  flex-container form-group">
                            <label for="Apellido"> Apellido </label>
                            <input type="family-name" className={ errorHTML.classNameError(this.errorApellido, 'form-control') }  placeholder="Apellido"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                            {errorHTML.errorLabel(this.errorApellido)}
                        </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="TipoDocumento"> Tipo Documento </label>
                        <Select
                            className="select-documento"
                            classNamePrefix="select"
                            defaultValue={this.state.tipoD[0]}
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            options={this.state.tipoD}
                            onChange={this.ChangeSelect.bind(this)}
                            styles={this.errorTipoDocumento.error ? {
                                control: (base, state)=>({
                                    ...base,
                                    borderColor: 'red',
                                    boxShadow: 'red'
                                })
                            } : {}}
                        />
                    </div>
                    <div className="col-md-6  flex-container form-group">
                            <label for="NumeroDocumento"> Numero de Documento </label>
                            <input type="document" className={ errorHTML.classNameError(this.errorDocumento, 'form-control') }

                                   placeholder="Document number"
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

                    <div className="col-md-6  flex-container form-group">
                            <label for="NumeroCelular"> Celular </label>
                            <input type="tel" className={ errorHTML.classNameError(this.errorCelular, 'form-control') }

                                   placeholder="Mobile number"
                                   value={this.state.celular}
                                   onChange={this.ChangeCelular}/>
                            {errorHTML.errorLabel(this.errorCelular)}
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="exampleInputEmail1"> Dirección de correo electrónico </label>
                        <input type="email" className={ errorHTML.classNameError(this.errorMail, 'form-control') }
                               id="exampleInputEmail1"
                               aria-describe by="emailHelp" placeholder="Enter email"
                               value={this.state.mail}
                               onChange={this.ChangeMail}/>
                        {errorHTML.errorLabel(this.errorMail)}
                    </div>

                    <div className="col-md-6  flex-container form-group">
                        <label for="exampleTextarea"> Descripcion </ label>
                        <textarea className="form-control" id="exampleTextarea" rows="3"
                                  value={this.state.descripcion}
                                  onChange={this.ChangeDescripcion}
                        > </textarea>

                    </div>
                </div>
                <div className="form-group izquierda">
                    <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                    <Link to="/" type="button" className="btn btn-primary boton"
                    >Volver</Link>
                </div>
            </div>
        );


    }
}

export default AltaEncargado;
