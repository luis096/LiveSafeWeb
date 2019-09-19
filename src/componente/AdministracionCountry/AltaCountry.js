import React, { Component } from 'react';
// import '../Style/Alta.css';
import { Database, Firebase } from '../../config/config';
import { Link } from 'react-router-dom';
import ModalEliminar  from '../ModalEliminar'
import { validator } from '../validator';

class AltaCountry extends Component {

    constructor() {
        super();
        this.state = {
            nombre: '',
            calle: '',
            numero: '',
            titular: '',
            celular: '',
            descripcion: '',
            resultado: 0,
            picture: '',
            upLoadValue: 0

        };
        this.addCountry = this.addCountry.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.registrar = this.registrar.bind(this);

        this.errorNombre = {error: false, mensaje: ''};
        this.errorCalle = {error: false, mensaje: ''};
        this.errorNumero = {error: false, mensaje: ''};
        this.errorTitular = {error: false, mensaje: ''};
        this.errorCelular = {error: false, mensaje: ''};
        this.errorDescripcion = {error: false, mensaje: ''};
    }

    addCountry() {
        Database.collection('Country').add({
            Nombre: this.state.nombre,
            Calle: this.state.calle,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            Foto: this.state.picture
        });

    }

    handleFiles(event) {
        const file = event.target.files[0];
        const storageRef = Firebase.storage().ref(`/Img/Country/${file.name}`);
        const task = storageRef.put(file);
        task.on('state_changed', snapshot=> {
            let porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({
                upLoadValue: porcentaje
            });
        }, error=> {
            console.log(error.message);
        }, ()=> {
            this.setState({
                upLoadValue: 100,
                picture: task.snapshot.downloadURL
            });
        });
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.requerido(event.target.value);
        if(!this.errorNombre.error){
            this.errorNombre = validator.soloLetras(event.target.value);
        }

    }

    ChangeCalle(event) {
        this.setState({calle: event.target.value});
        this.errorCalle = validator.numero(event.target.value);
    }

    ChangeNumero(event) {
        this.setState({numero: event.target.value});
        this.errorNumero = validator.requerido(event.target.value);
        if(!this.errorNumero.error){
            this.errorNumero = validator.numero(event.target.value);
        }
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        this.errorCelular = validator.numero(event.target.value);
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
        this.errorTitular = validator.numero(event.target.value);
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
        this.errorDescripcion = validator.numero(event.target.value);
    }

    registrar() {
        if (!(this.esValido())) {
            // this.addCountry();
            this.setState({
                nombre: '',
                calle: '',
                numero: '',
                titular: '',
                celular: '',
                descripcion: '',
                resultado: 1
            });
        } else {
            this.setState({resultado : 2})
        }
    }


    esValido(){
        return(
        this.errorNombre||
        this.errorCalle ||
        this.errorNumero ||
        this.errorTitular ||
        this.errorCelular ||
        this.errorDescripcion
        )
    }

    render() {

        return (
            <div className="col-12">
                <div className="col-md-12 ">
                    <div className="row">
                        <legend> Registrar Alta de un Barrio</legend>
                        {/*Cambios que se hicieron: validador version 2:
                         1- Se cambia el has-error por has-danger.
                         2- Se agrega al input la bandera, queda igual que al div principal pero con la clase is-invalid
                         3- El mensaje de error es un div SEGUIDO DEL INPUT de la clase: invalid-feedback*/}
                        <div className={this.errorNombre.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre" className=''> Nombre del Barrio </label>
                            <div className=''>
                                <input type="name" className={this.errorNombre.error ? "form-control is-invalid ":'form-control'} placeholder="Name Country"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}/>
                                <div className="invalid-feedback">{this.errorNombre.mensaje}</div>
                            </div>
                        </div>
                        <div className={this.errorTitular.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre" className=''> Titular </label>
                            <div className=''>
                                <input type="name" className="form-control " placeholder="Nombre de titular"
                                       value={this.state.titular}
                                       onChange={this.ChangeTitular}/>
                            </div>
                            <label for="Nombre" className=' small text-danger' 
                            hidden={!this.errorTitular.error} > {this.errorTitular.mensaje}  </label>
                        </div>
                        <div className={this.errorCalle.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre" className=''> Calle </label>
                            <div className=''>
                                <input type="name" className="form-control " placeholder="Nombre de calle"
                                       value={this.state.calle}
                                       onChange={this.ChangeCalle}/>
                            </div>
                            <label for="Nombre" className=' small text-danger' 
                            hidden={!this.errorCalle.error} > {this.errorCalle.mensaje}  </label>
                        </div>
                        <div className={this.errorCelular.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre" className=''> Celular </label>
                            <div className=''>
                                <input type="name" className="form-control " placeholder="Celular"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}/>
                            </div>
                            <label for="Nombre" className=' small text-danger' 
                            hidden={!this.errorCelular.error} > {this.errorCelular.mensaje}  </label>
                        </div>
                        <div className={this.errorNumero.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre" className=''> Numero </label>
                            <div className=''>
                                <input type="name" className="form-control " placeholder="Nombre de calle"
                                       value={this.state.numero}
                                       onChange={this.ChangeNumero}/>
                            </div>
                            <label for="Nombre" className=' small text-danger' 
                            hidden={!this.errorNumero.error} > {this.errorNumero.mensaje}  </label>
                        </div>

                        <div className={this.errorDescripcion.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre" className=''> Descripcion </label>
                            <div className=''>
                                <textarea type="name" className="form-control " placeholder="Nombre de calle"
                                       value={this.state.descripcion}
                                       onChange={this.ChangeDescripcion}></textarea>
                            </div>
                            <label for="Nombre" className=' small text-danger' 
                            hidden={!this.errorDescripcion.error} > {this.errorDescripcion.mensaje}  </label>
                        </div>

                        <div>
                        </div>
                    </div>

                    <div className="col-md-6  flex-container form-group">
                        <progress value={this.state.upLoadValue} max='100'>
                            {this.state.upLoadValue}%
                        </progress>

                        <input type="file" onChange={this.handleFiles}/>

                        <img width="320" src={this.state.picture}/>

                    </div>
                    <div hidden={!(this.state.resultado==1)} className="alert alert-success" role="alert">
                            <strong>Se ha creado con exito</strong> 
                    </div>
                    <div hidden={!(this.state.resultado==2)} className="alert alert-danger" role="alert">
                    <strong>Hay errores en el formulario!</strong> 
                    </div>

                    <div className="form-group izquierda">
                        <button className="btn btn-primary boton" onClick={this.registrar} >Registrar</button>
                        <Link to="/" type="button" className="btn btn-primary boton">Volver</Link>
                    </div>
                </div>

            </div>

        );
    }
}

export default AltaCountry;