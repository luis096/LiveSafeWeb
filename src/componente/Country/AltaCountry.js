import React, { Component } from 'react';
import { Database, Firebase } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import { operacion } from '../Operaciones';
import { errorHTML } from '../Error';
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
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.registrar = this.registrar.bind(this);

        this.errorNombre = {error: false, mensaje: ''};
        this.errorTitular = {error: false, mensaje: ''};
        this.errorCalle = {error: false, mensaje: ''};
        this.errorCelular= {error:false, mensaje:''};
        this.errorNumero= {error:false, mensaje:''};
        this.errorDescripcion= {error:false, mensaje:''}
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
        if (event.target.value == "")
        {this.errorNombre= validator.requerido(event.target.value)}
        else{this.errorNombre =validator.soloLetras(event.target.value)}
    }


    ChangeCalle(event) {
        this.setState({calle: event.target.value});
        if (event.target.value == "")
        {this.errorCalle= validator.requerido(event.target.value)}
        else{this.errorCalle =validator.soloLetras(event.target.value)}
    }


    ChangeNumero(event) {
        this.setState({numero: event.target.value});
        if (event.target.value == "")
        {this.errorNumero= validator.requerido(event.target.value)}
        else{this.errorNumero =validator.numero(event.target.value)}
    }


    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        if (event.target.value == "")
        {this.errorCelular= validator.requerido(event.target.value)}
        else{this.errorCelular =validator.numero(event.target.value)}
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
        if (event.target.value == "")
        {this.errorTitular= validator.requerido(event.target.value)}
        else{this.errorTitular =validator.soloLetras(event.target.value)}
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
        this.errorDescripcion = validator.soloLetras(event.target.value);

    }

    registrar() {
        if (this.state.nombre == "" || this.state.calle == "" || this.state.numero =="" || this.state.titular == "" ||
         this.state.celular == "" ) {
            operacion.sinCompletar("Debe completar todos los campos requeridos")
            return
        }
        Database.collection('Country').add({
            Nombre: this.state.nombre,
            Calle: this.state.calle,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            FechaAlta: new Date()
        });
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Nuevo barrio</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Nombre del barrio </label>
                                <input className={ errorHTML.classNameError(this.errorNombre, 'form-control') }
                                       placeholder="Nombre"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Titular </label>
                                <input className={ errorHTML.classNameError(this.errorTitular, 'form-control') }
                                       placeholder="Titular"
                                       value={this.state.titular}
                                       onChange={this.ChangeTitular}
                                />
                                {errorHTML.errorLabel(this.errorTitular)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Calle </label>
                                <input className={ errorHTML.classNameError(this.errorCalle, 'form-control') }
                                       placeholder="Calle"
                                       value={this.state.calle}
                                       onChange={this.ChangeCalle}/>
                                 {errorHTML.errorLabel(this.errorCalle)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Numero </label>
                                <input className={ errorHTML.classNameError(this.errorNumero, 'form-control') }
                                       placeholder="Numero"
                                       value={this.state.numero}
                                       onChange={this.ChangeNumero}/>
                                {errorHTML.errorLabel(this.errorNumero)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Celular </label>
                                <input className={ errorHTML.classNameError(this.errorCelular, 'form-control') }
                                       placeholder="Celular"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}/>
                                 {errorHTML.errorLabel(this.errorCelular)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Descripcion </label>
                                <textarea className={ errorHTML.classNameError(this.errorDescripcion, 'form-control') }
                                          rows="3"
                                          placeholder="Description"
                                          value={this.state.descripcion}
                                          onChange={this.ChangeDescripcion}/>
                              {errorHTML.errorLabel(this.errorDescripcion)}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {/*<progress value={this.state.upLoadValue} max='100'>*/}
                        {/*{this.state.upLoadValue}%*/}
                    {/*</progress>*/}

                    {/*<input type="file" onChange={this.handleFiles}/>*/}

                    {/*<img width="320" src={this.state.picture}/>*/}

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

export default AltaCountry;
