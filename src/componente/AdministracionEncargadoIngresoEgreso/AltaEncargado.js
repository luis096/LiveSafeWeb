import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Link } from 'react-router-dom';
import { Database, Firebase } from '../../config/config';


class AltaEncargado extends Component {

    constructor() {
        super();
        this.state = {
            idEncargadoCreado: '',
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
            resultado: ''
        };
        this.addEncargado = this.addEncargado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeLegajo = this.ChangeLegajo.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.registrar = this.registrar.bind(this);

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
                Legajo: this.state.legajo,
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
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeLegajo(event) {
        this.setState({legajo: event.target.value});
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event.target.value});
    }

    ChangeMail(event) {
        this.setState({mail: event.target.value});
    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
    }


    registrar() {
        //Agregar validaciones para no registrar cualquier gilada
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
                        <input type="name" className="form-control" placeholder="Name"
                               value={this.state.nombre}
                               onChange={this.ChangeNombre}
                        />
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="Apellido"> Apellido </label>
                        <input type="family-name" className="form-control" placeholder="Surname"
                               value={this.state.apellido}
                               onChange={this.ChangeApellido}/>
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
                        />
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="NumeroDocumento"> Numero de Documento </label>
                        <input type="document" className="form-control"
                               placeholder="Document number"
                               value={this.state.documento}
                               onChange={this.ChangeDocumento}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="FechaNacimiento"> Fecha de Nacimiento </label>
                        <input type="date" className="form-control" name="FechaNacimiento"
                               step="1" min="1920-01-01"
                               onChange={this.ChangeFechaNacimiento}
                        />
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="NumeroCelular"> Legajo </label>
                        <input type="tel" className="form-control" placeholder="Mobile number"
                               value={this.state.legajo}
                               onChange={this.ChangeLegajo}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="NumeroCelular"> Celular </label>
                        <input type="tel" className="form-control" placeholder="Mobile number"
                               value={this.state.celular}
                               onChange={this.ChangeCelular}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="exampleInputEmail1"> Dirección de correo electrónico </label>
                        <input type="email" className="form-control" id="exampleInputEmail1"
                               aria-describe by="emailHelp" placeholder="Enter email"
                               value={this.state.mail}
                               onChange={this.ChangeMail}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="exampleInputPassword1"> Contraseña </label>
                        <input type="password" className="form-control" id="exampleInputPassword1"
                               placeholder="Password"
                               value={this.state.pass}
                               onChange={this.ChangePass}/>
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
