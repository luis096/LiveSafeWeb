import React, { Component } from 'react';
// import '../Style/Alta.css';
import { Database, Firebase } from '../../config/config';
import { Link } from 'react-router-dom';

import { validator } from './validator';

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
            resultado: '',
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

        this.errorName = false;
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
        this.errorName = validator.numero(event.target.value);
    }

    ChangeCalle(event) {
        this.setState({calle: event.target.value});
    }

    ChangeNumero(event) {
        console.log('numerom', validator.numero(event.target.value));
        this.setState({numero: event.target.value});
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    registrar() {
//Agregar validaciones
        if (true) {
            this.addCountry();
            this.setState({
                nombre: '',
                calle: '',
                numero: '',
                titular: '',
                celular: '',
                descripcion: '',
                resultado: 'Se registro con exito'
            });
        }
    }


    render() {

        return (
            <div className="col-12">
                <div className="col-md-12 ">
                    <div className="row">
                        <legend> Registrar Alta de un Barrio</legend>

                        <div
                            className={this.errorName ? 'col-md-6 form-group has-feedback has-error' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre" className=''> Nombre del Barrio </label>
                            <div className=''>
                                <input type="name" className="form-control " placeholder="Name Country"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}/>
                                {/*<span className="glyphicon glyphicon-remove form-control-feedback"></span>*/}
                            </div>
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Titular </label>
                            <input type="name" className="form-control" placeholder="Name Headline"
                                   value={this.state.titular}
                                   onChange={this.ChangeTitular}/>
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Calle </label>
                            <input type="name" className="form-control" placeholder="Street"
                                   value={this.state.calle}
                                   onChange={this.ChangeCalle}/>
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Celular </label>
                            <input type="name" className="form-control" placeholder="Mobile"
                                   value={this.state.celular}
                                   onChange={this.ChangeCelular}/>
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Numero </label>
                            <input type="name" className="form-control" placeholder="Number"
                                   value={this.state.numero}
                                   onChange={this.ChangeNumero}/>
                        </div>


                        <div className="col-md-6  flex-container form-group">
                            <label for="Nombre"> Descripcion </label>
                            <textarea className="form-control" id="exampleTextarea" rows="3" placeholder="Description"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}> </textarea>
                        </div>
                        <div>
						<span>
							<strong>{this.state.resultado}</strong>
						</span>
                        </div>
                    </div>

                    <div className="col-md-6  flex-container form-group">
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