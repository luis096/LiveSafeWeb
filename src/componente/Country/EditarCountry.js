import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import { operacion } from '../Operaciones';
import { errorHTML } from '../Error';
import { validator } from '../validator';



class EditarCountry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barrio: [],
            nombre: '',
            calle: '',
            numero: '',
            titular: '',
            fechaAlta: '',
            celular: '',
            descripcion: ''
        };
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);
        const url = this.props.location.pathname.split('/');
        this.idBarrio = url[url.length - 1];


        this.errorNombre = {error: false, mensaje: ''};
        this.errorTitular = {error: false, mensaje: ''};
        this.errorCalle = {error: false, mensaje: ''};
        this.errorCelular= {error:false, mensaje:''};
        this.errorNumero= {error:false, mensaje:''};
        this.errorDescripcion= {error:false, mensaje:''}
    }


    async componentDidMount() {
        await Database.collection('Country').doc(this.idBarrio).get().then(doc=> {
            if (doc.exists) {
                this.setState({
                    nombre: doc.data().Nombre,
                    calle: doc.data().Calle,
                    numero: doc.data().Numero,
                    titular: doc.data().Titular,
                    celular: doc.data().Celular,
                    fechaAlta: doc.data().FechaAlta,
                    descripcion: doc.data().Descripcion
                });
            }
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
        Database.collection('Country').doc(this.idBarrio).update({
            Nombre: this.state.nombre,
            Calle: this.state.calle,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion
        });
    }


    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Editar barrio</h3></legend>
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

export default EditarCountry;
