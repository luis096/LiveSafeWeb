import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import { errorHTML } from '../Error';
import { validator } from '../validator';


class EditarEncargado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            encargados: [],
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            legajo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            fechaAlta: '',
            usuario: '',
            idCountry: '',

            tipoD: [],// Para cargar el combo
            temp: '', // Puto el que lee
            resultado: ''
        };
        this.editEncargado = this.editEncargado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeLegajo = this.ChangeLegajo.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.registrar = this.registrar.bind(this);

        this.idTD = '';
        const url = this.props.location.pathname.split('/');
        this.idEncargado = url[url.length - 1];

        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorCelular= {error:false, mensaje:''};
        
        
        
    }

    async componentDidMount() {
        const {tipoD, encargados} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Encargados').doc(this.idEncargado).get()
            .then(doc=> {
                if (doc.exists) {
                    this.state.encargados.push(doc.data());
                } else {

                }
            })
            .catch(err=> {
                //En caso de error, hacer esto...
            });
        this.setState({tipoD});
        this.setState({encargados});
        const estrella = this.state.encargados[0];
        await Database.collection('TipoDocumento').doc(estrella.TipoDocumento.id).get()
            .then(doc=> {
                if (doc.exists) {
                    this.state.tipoDocumento = {value: doc.id, label: doc.data().Nombre};
                }
            });

        this.setState({
            nombre: estrella.Nombre,
            apellido: estrella.Apellido,
            legajo: estrella.Legajo,
            documento: estrella.Documento,
            fechaNacimiento: estrella.FechaNacimiento,
            fechaAlta: estrella.FechaAlta,
            celular: estrella.Celular,
            descripcion: estrella.Descripcion,
            usuario: estrella.Usuario
        });
    }


    editEncargado() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Encargados').doc(this.idEncargado).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Legajo: this.state.legajo,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: this.state.fechaAlta,
            Usuario: this.state.usuario
        });

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

    }

    ChangeLegajo(event) {
        this.setState({legajo: event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento = validator.numero(event.target.value);

    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        this.errorCelular = validator.numero(event.target.value);

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

    ChangeRadio(event) {
        this.setState({titular: event.currentTarget.value});
    }

    registrar() {
        //Agregar validaciones para no registrar cualquier gilada
        if (true) {
            this.editEncargado();

        }
    }

    render() {
        return (
            <div className="col-12 jumbotron">
                <div>
                    <div className="row">
                        <legend> Editar Encargados</legend>
                        <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Nombre </label>
                            <input type="name" className="form-control" placeholder="Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                            {errorHTML.errorLabel(this.errorNombre)}
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="Apellido"> Apellido </label>
                            <input type="family-name" className={ errorHTML.classNameError(this.errorApellido, 'form-control') }  placeholder="Surname"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}/>
                            {errorHTML.errorLabel(this.errorApellido)}       
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="TipoDocumento"> Tipo de Documento </label>
                            <Select
                                className="select-documento"
                                value={this.state.tipoDocumento}
                                classNamePrefix="Select"
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
                                   value={this.state.fechaNacimiento}
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
                            <label for="exampleTextarea"> Descripcion </ label>
                            <textarea className="form-control" id="exampleTextarea" rows="3"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}> </textarea>
                        </div>
                    </div>
                    <div className="form-group izquierda">
                        <Link to="/" type="button" className="btn btn-primary boton"
                        >Volver</Link>
                        <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                    </div>
                </div>
            </div>
        );


    }
}

export default EditarEncargado;