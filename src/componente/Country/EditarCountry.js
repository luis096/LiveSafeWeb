import React, { Component } from 'react';
import '../Style/Alta.css';
import {Database, Storage} from '../../config/config';
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
            descripcion: '',
            imagenCountry: '',
            upLoadValue: 0,
            imgStorgeRef: '',
            borrar: false
        };
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.eliminarImg = this.eliminarImg.bind(this);

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
        document.getElementById('imgBarrio').src = '';
        await Database.collection('Country').doc(this.idBarrio).get().then(doc=> {
            if (doc.exists) {
                this.setState({
                    nombre: doc.data().Nombre,
                    calle: doc.data().Calle,
                    numero: doc.data().Numero,
                    titular: doc.data().Titular,
                    celular: doc.data().Celular,
                    fechaAlta: doc.data().FechaAlta,
                    descripcion: doc.data().Descripcion,
                    imagenCountry: doc.data().Imagen
                });
            }
        });
        if (!!this.state.imagenCountry) {
            this.setState({imgStorgeRef: Storage.ref(this.state.imagenCountry), upLoadValue: 100});
            Storage.ref(this.state.imagenCountry).getDownloadURL().then((url)=>{
                document.getElementById('imgBarrio').src = url;
            });
        } else {
            this.setState({borrar: true});
        }
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

    handleFiles(event) {
        const file = event.target.files[0];
        const name = `/Img/${file.name}`;
        const storageRef = Storage.ref(name);
        const task = storageRef.put(file);

        this.setState({imgStorgeRef: storageRef, imagenCountry: name});
        task.on('state_changed', (snapshot) => {
            let porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({
                upLoadValue: porcentaje
            });
        }, error=> {
            console.log(error.message);
        }, ()=> {
            this.setState({
                upLoadValue: 100,
            });
            Storage.ref(name).getDownloadURL().then((url)=>{
                document.getElementById('imgBarrio').src = url;
            });
        })
    }

    eliminarImg() {
        if (this.state.borrar){
            this.state.imgStorgeRef.delete().then(() => {
                document.getElementById('imgBarrio').src = '';
                this.setState({imgStorgeRef: '', upLoadValue: 0, name: ''})
            }).catch((error) => {
                console.log('Error:', error)
            });
        } else {
            document.getElementById('imgBarrio').src = '';
            this.setState({imgStorgeRef: '', upLoadValue: 0, name: ''})
            this.setState({borrar: true});
        }
    }

    registrar() {
       //  if (this.state.nombre == "" || this.state.calle == "" || this.state.numero =="" || this.state.titular == "" ||
       //  this.state.celular == "" ) {
       //     operacion.sinCompletar("Debe completar todos los campos requeridos")
       //     return
       // }
        Database.collection('Country').doc(this.idBarrio).update({
            Nombre: this.state.nombre,
            Calle: this.state.calle,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            Imagen: this.state.imagenCountry
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
                        <div className="row">
                            <div className="col-md-12 row-secction">
                                <label> Imagen del barrio </label>
                                <div hidden={!!this.state.upLoadValue}>
                                    <div hidden={!this.state.upLoadValue}>
                                        <progress value={this.state.upLoadValue} max='100'>
                                            {this.state.upLoadValue}%
                                        </progress>
                                    </div>
                                    <input type="file" onChange={this.handleFiles}/>
                                </div>
                                <img width="320" id="imgBarrio"/>
                                <div hidden={this.state.upLoadValue != 100}>
                                    <Button bsStyle="warning" fill onClick={this.eliminarImg}>X</Button>
                                </div>
                            </div>
                        </div>
                    </div>
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
