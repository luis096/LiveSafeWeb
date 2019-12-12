import React, { Component } from 'react';
import { Database, Firebase } from '../../config/config';
import { Link } from 'react-router-dom';
import { validator } from '../validator';
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";

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
            picture: '',
            upLoadValue: 0,
            _notificationSystem: null,

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
        const storageRef = Firebase.storage().ref(`/Img/${file.name}`);
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
        console.log(this.errorNombre.error);
        if (!this.errorNombre.error) {
            this.errorNombre = validator.soloLetras(event.target.value);
            console.log(this.errorNombre.error);
        }

    }

    ChangeCalle(event) {
        this.setState({calle: event.target.value});
        this.errorCalle = validator.numero(event.target.value);
    }

    ChangeNumero(event) {
        this.setState({numero: event.target.value});
        this.errorNumero = validator.requerido(event.target.value);
        if (!this.errorNumero.error) {
            this.errorNumero = validator.numero(event.target.value);
        }
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        this.errorCelular = validator.numero(event.target.value);
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
        this.errorTitular = validator.requerido(event.target.value);
        if (!this.errorTitular.error) {
            this.errorTitular = validator.soloLetras(event.target.value);
        }
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
        this.errorDescripcion = validator.numero(event.target.value);
    }

    registrar() {
        this.setState({ _notificationSystem: this.refs.notificationSystem });
        var _notificationSystem = this.refs.notificationSystem;
        if (this.esValido()) {
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
            _notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-close-circle"/>,
                message: (
                    <div>
                        <span><strong>Correcto:</strong></span><br/>
                        Se registro con exito
                    </div>
                ),
                level: "success",
                position: "tc",
                autoDismiss: 15
            });
        } else {
            _notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-close-circle"/>,
                message: (
                    <div>
                        <span><strong>Error: </strong></span><br/>
                        Hay errores en el formulario.
                    </div>
                ),
                level: "error",
                position: "tc",
                autoDismiss: 15
            });
        }
    }


    esValido() {
        return !(
            this.errorNombre.error ||
            this.errorCalle.error ||
            this.errorNumero.error ||
            this.errorTitular.error ||
            this.errorCelular.error ||
            this.errorDescripcion.error
        );
    }

    render() {
        return (
            <div className="content">
                <NotificationSystem ref="notificationSystem" style={style} />
                <div className="form-group">
                    <label className="h2">Registrar un nuevo barrio</label>
                </div>
                <div>
                    <div className="row">
                        <div className={this.errorNombre.error ? 'col-md-6 form-group has-feedback has-error'
                            : 'col-md-6 form-group'}>
                            <label>Nombre del Barrio</label>
                            <input type="name"
                                   className={this.errorNombre.error ? 'form-control is-invalid' : 'form-control '}
                                   placeholder="Nombre del Country"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}/>
                                <span className={this.errorNombre.error?'glyphicon glyphicon-remove form-control-feedback':''}></span>
                            <label className='small text-danger'
                                   hidden={!this.errorNombre.error}> {this.errorNombre.mensaje}</label>
                        </div>
                        <div className={this.errorTitular.error ? 'col-md-6 form-group has-feedback has-error'
                            : 'col-md-6 form-group has-feedback'}>
                            <label>Titular</label>
                            <input type="name" className="form-control" placeholder="Nombre del titular"
                                   value={this.state.titular}
                                   onChange={this.ChangeTitular}/>
                            <span className={this.errorTitular.error?'glyphicon glyphicon-remove form-control-feedback':''}></span>
                            <label className='small text-danger'
                                   hidden={!this.errorTitular.error}> {this.errorTitular.mensaje}</label>
                        </div>
                        <div className={this.errorCalle.error ? 'col-md-6 form-group has-feedback has-error'
                            : 'col-md-6 form-group has-feedback'}>
                            <label>Calle</label>
                            <input type="name" className="form-control " placeholder="Nombre de la calle"
                                   value={this.state.calle}
                                   onChange={this.ChangeCalle}/>
                            <span className={this.errorCalle.error?'glyphicon glyphicon-remove form-control-feedback':''}></span>
                            <label className=' small text-danger'
                                   hidden={!this.errorCalle.error}> {this.errorCalle.mensaje}  </label>
                        </div>
                        <div
                            className={this.errorCelular.error ? 'col-md-6 form-group has-feedback has-error' : 'col-md-6 form-group has-feedback'}>
                            <label>Celular</label>
                            <input type="name" className="form-control " placeholder="Celular"
                                   value={this.state.celular}
                                   onChange={this.ChangeCelular}/>
                            <span className={this.errorCelular.error?'glyphicon glyphicon-remove form-control-feedback':''}></span>
                            <label className=' small text-danger'
                                   hidden={!this.errorCelular.error}> {this.errorCelular.mensaje}  </label>
                        </div>
                        <div
                            className={this.errorNumero.error ? 'col-md-6 form-group has-feedback has-error' : 'col-md-6 form-group has-feedback'}>
                            <label>Numero</label>
                            <input type="name" className="form-control " placeholder="Nombre de calle"
                                   value={this.state.numero}
                                   onChange={this.ChangeNumero}/>
                            <span className={this.errorNumero.error?'glyphicon glyphicon-remove form-control-feedback':''}></span>
                            <label className='small text-danger'
                                   hidden={!this.errorNumero.error}> {this.errorNumero.mensaje}  </label>
                        </div>

                        <div className={this.errorDescripcion.error ? 'col-md-6 form-group has-feedback has-error' :
                            'col-md-6 form-group has-feedback'}>
                            <label>Descripcion</label>
                            <textarea type="name" className="form-control" placeholder="Nombre de calle"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}></textarea>
                            <span className={this.errorDescripcion.error?'glyphicon glyphicon-remove form-control-feedback':''}></span>
                            <label className='small text-danger'
                                   hidden={!this.errorDescripcion.error}> {this.errorDescripcion.mensaje}  </label>
                        </div>
                        <div>
                        </div>
                    </div>

                    <div className="col-md-6  flex-container form-group" hidden={true}>
                        <progress value={this.state.upLoadValue} max='100'>
                            {this.state.upLoadValue}%
                        </progress>

                        <input type="file" onChange={this.handleFiles}/>

                        <img width="320" src={this.state.picture}/>

                    </div>

                    <div className="form-group izquierda">
                        <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                        <Link to="/" type="button" className="btn btn-primary boton">Volver</Link>
                    </div>
                </div>
            </div>

        );
    }
}

export default AltaCountry;