import React, {Component} from 'react';
import {Database, Firebase, Storage} from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import {operacion} from '../Operaciones';
import {errorHTML} from '../Error';
import {validator} from '../validator';
import NotificationSystem from "react-notification-system";
import {style} from "../../variables/Variables";
import Select from "react-select";


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
            imagenCountry: '',
            upLoadValue: 0,
            imgStorgeRef: '',
            departamento: [],
            departamentoBarrio: {label: "Select..."},
            localidades: [],
            localidadBarrio: {label: "Select..."},
            calles: [],
            calleBarrio: {label: "Select..."}
        };
        this.notificationSystem = React.createRef();
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeLoc = this.ChangeLoc.bind(this);
        this.ChangeDto = this.ChangeDto.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.registrar = this.registrar.bind(this);
        this.eliminarImg = this.eliminarImg.bind(this);

        this.errorNombre = {error: false, mensaje: ''};
        this.errorTitular = {error: false, mensaje: ''};
        this.errorCalle = {error: false, mensaje: ''};
        this.errorCelular = {error: false, mensaje: ''};
        this.errorNumero = {error: false, mensaje: ''};
        this.errorDescripcion = {error: false, mensaje: ''}
    }

    componentDidMount() {
        let depto = [];
        document.getElementById('imgBarrio').src = '';
        fetch("https://apis.datos.gob.ar/georef/api/departamentos?provincia=14&max=1000").then(res => res.json())
            .then((result) => {
                    result.departamentos.forEach(loc => {
                        depto.push({value: loc.id, label: loc.nombre})
                    })
                }
                , (error) => {
                    console.log(error);
                });

        this.setState({departamentos: depto})
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
        }, error => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));

        }, () => {
            this.setState({
                upLoadValue: 100,
            });
            Storage.ref(name).getDownloadURL().then((url) => {
                document.getElementById('imgBarrio').src = url;
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        })
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        if (event.target.value == "") {
            this.errorNombre = validator.requerido(event.target.value)
        } else {
            this.errorNombre = validator.soloLetras(event.target.value)
        }
    }


    ChangeCalle(event) {
        this.setState({calleBarrio: event});
    }


    ChangeNumero(event) {
        this.setState({numero: event.target.value});
        if (event.target.value == "") {
            this.errorNumero = validator.requerido(event.target.value)
        } else {
            this.errorNumero = validator.numero(event.target.value)
        }
    }


    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        if (event.target.value == "") {
            this.errorCelular = validator.requerido(event.target.value)
        } else {
            this.errorCelular = validator.numero(event.target.value)
        }
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
        if (event.target.value == "") {
            this.errorTitular = validator.requerido(event.target.value)
        } else {
            this.errorTitular = validator.soloLetras(event.target.value)
        }
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
        this.errorDescripcion = validator.soloLetras(event.target.value);

    }

    ChangeDto(event) {
        let localidades = [];
        this.setState({calleBarrio: {value: null, label: "Select..."}});
        this.setState({localidadBarrio: {value: null, label: "Select..."}});

        if (!!event) {
            fetch("https://apis.datos.gob.ar/georef/api/localidades-censales?provincia=cordoba&departamento="
                + event.value.toString() + "&max=1000&formato=json").then(res => res.json())
                .then((result) => {
                        result.localidades_censales.forEach(loc => {
                            localidades.push({value: loc.id, label: loc.nombre})
                        })
                    }
                    , (error) => {
                        console.log(error);
                    });
        }
        this.setState({localidades: localidades});
        this.setState({departamentoBarrio: event});
    }

    async ChangeLoc(event) {
        let callesLocalidad = [];
        this.setState({localidadBarrio: event});
        this.setState({calleBarrio: {value: null, label: "Select..."}});

        let total = 0;
        if (!!event) {
            await fetch("https://apis.datos.gob.ar/georef/api/calles?provincia=14&&departamento="
                + this.state.departamentoBarrio.value.toString() + "&localidad_censal=" + event.value.toString()
                + "&max=4000&formato=json").then(res => res.json())
                .then((result) => {
                        result.calles.forEach(loc => {
                            callesLocalidad.push({value: loc.id, label: loc.nombre})
                        });
                        total = result.total;
                    }
                    , (error) => {
                        console.log(error);
                    });
        }

        if (total > 5000) {
            await fetch("https://apis.datos.gob.ar/georef/api/calles?provincia=14&&departamento="
                + this.state.departamentoBarrio.value.toString() + "&localidad_censal=" + event.value.toString()
                + "&max=5000&inicio=5000&formato=json").then(res => res.json())
                .then((result) => {
                        result.calles.forEach(loc => {
                            callesLocalidad.push({value: loc.id, label: loc.nombre})
                        });
                        total = result.total;
                    }
                    , (error) => {
                        console.log(error);
                    });
        }

        this.setState({calles: callesLocalidad});
    }

    eliminarImg() {
        this.state.imgStorgeRef.delete().then(() => {
            document.getElementById('imgBarrio').src = '';
            this.setState({imgStorgeRef: '', upLoadValue: 0, name: ''})
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
    }

    async registrar() {
        // if (this.state.nombre == "" || this.state.calle == "" || this.state.numero =="" || this.state.titular == "" ||
        //  this.state.celular == "" ) {
        //     operacion.sinCompletar("Debe completar todos los campos requeridos")
        //     return
        // }
        await Database.collection('Country').add({
            Nombre: this.state.nombre,
            Calle: this.state.calleBarrio,
            Departamento: this.state.departamentoBarrio,
            Localidad: this.state.localidadBarrio,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            FechaAlta: new Date(),
            Imagen: this.state.imagenCountry
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
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
                                <input className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                       placeholder="Nombre"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Titular </label>
                                <input className={errorHTML.classNameError(this.errorTitular, 'form-control')}
                                       placeholder="Titular"
                                       value={this.state.titular}
                                       onChange={this.ChangeTitular}
                                />
                                {errorHTML.errorLabel(this.errorTitular)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="row-secction col-md-3">
                                <label> Departamento </label>
                                <Select
                                    className="select-documento"
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.departamentos}
                                    onChange={this.ChangeDto.bind(this)}
                                />
                            </div>
                            <div className="row-secction col-md-3">
                                <label> Localidad </label>
                                <Select
                                    className="select-documento"
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    value={this.state.localidadBarrio}
                                    options={this.state.localidades}
                                    onChange={this.ChangeLoc.bind(this)}
                                />
                            </div>
                            <div className="row-secction col-md-3">
                                <label> Calle </label>
                                <Select
                                    className="select-documento"
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    value={this.state.calleBarrio}
                                    options={this.state.calles}
                                    onChange={this.ChangeCalle.bind(this)}
                                />
                            </div>
                            <div className="col-md-3 row-secction">
                                <label> Número </label>
                                <input className={ errorHTML.classNameError(this.errorNumero, 'form-control') }
                                       placeholder="Numero"
                                       value={this.state.numero}
                                       onChange={this.ChangeNumero}/>
                                {errorHTML.errorLabel(this.errorNumero)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Celular </label>
                                <input className={errorHTML.classNameError(this.errorCelular, 'form-control')}
                                       placeholder="Celular"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}/>
                                {errorHTML.errorLabel(this.errorCelular)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 row-secction">
                                <label> Descripcion </label>
                                <textarea className={errorHTML.classNameError(this.errorDescripcion, 'form-control')}
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
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}

export default AltaCountry;
