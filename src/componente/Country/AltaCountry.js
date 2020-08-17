import React, { Component } from 'react';
import { Database, Firebase, Storage } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import { operacion } from '../Operaciones';
import { errorHTML } from '../Error';
import { validator } from '../validator';
import NotificationSystem from 'react-notification-system';
import { style } from '../../variables/Variables';
import Select from 'react-select';
import Delete from '../../assets/img/delete.svg'
import {Redirect} from "react-router-dom";
import Spinner from "react-spinner-material";
import "../Style/SpinnerAltas.scss"

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
            departamentoBarrio: { label: 'Seleccione un departamento' },
            localidades: [],
            localidadBarrio: { label: 'Seleccione una localidad' },
            redirect: false,
            loading: false
        };
        this.notificationSystem = React.createRef();
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeLoc = this.ChangeLoc.bind(this);
        this.ChangeDto = this.ChangeDto.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.registrar = this.registrar.bind(this);
        this.eliminarImg = this.eliminarImg.bind(this);

        this.errorNombre = { error: false, mensaje: '' };
        this.errorTitular = { error: false, mensaje: '' };
        this.errorCalle = { error: false, mensaje: '' };
        this.errorCelular = { error: false, mensaje: '' };
        this.errorNumero = { error: false, mensaje: '' };
        this.errorDescripcion = { error: false, mensaje: '' };
    }

    componentDidMount() {
        let depto = [];
        document.getElementById('imgBarrio').src = '';
        fetch('https://apis.datos.gob.ar/georef/api/departamentos?provincia=14&max=1000')
            .then((res) => res.json())
            .then(
                (result) => {
                    result.departamentos.forEach((loc) => {
                        depto.push({ value: loc.id, label: loc.nombre });
                    });

                    depto = depto.sort(function (a, b) {
                        if (a.label > b.label) {
                            return 1;
                        }
                        if (a.label < b.label) {
                            return -1;
                        }
                        return 0;
                    });
                },
                (error) => {
                    console.log(error);
                }
            );

        this.setState({ departamentos: depto });
    }

    handleFiles(event) {
        const file = event.target.files[0];
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/x-icon') {
            this.notificationSystem.current.addNotification(operacion.error("Error en tipo de archivo"));
            return;
        }
        const name = `/Img/${file.name}`;
        const storageRef = Storage.ref(name);
        const task = storageRef.put(file);

        this.setState({ imgStorgeRef: storageRef, imagenCountry: name });
        task.on(
            'state_changed',
            (snapshot) => {
                let porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setState({
                    upLoadValue: porcentaje,
                });
            },
            (error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            },
            () => {
                this.setState({
                    upLoadValue: 100,
                });
                Storage.ref(name)
                    .getDownloadURL()
                    .then((url) => {
                        document.getElementById('imgBarrio').src = url;
                    })
                    .catch((error) => {
                        this.notificationSystem.current.addNotification(operacion.error(error.message));
                    });
            }
        );
    }

    ChangeNombre(event) {
        this.setState({ nombre: event.target.value });
        if (event.target.value === '') {
            this.errorNombre = validator.requerido(event.target.value);
        } else {
            this.errorNombre = validator.soloLetrasNumeros(event.target.value);
        }
    }

    ChangeCalle(event) {
        this.setState({ calle: event.target.value });
        if (event.target.value === '') {
            this.errorCalle = validator.requerido(event.target.value);
        } else {
            this.errorCalle = validator.soloLetrasNumeros(event.target.value);
        }
    }

    ChangeNumero(event) {
        this.setState({ numero: event.target.value });
        if (event.target.value === '') {
            this.errorNumero = validator.requerido(event.target.value);
        } else {
            this.errorNumero = validator.numero(event.target.value);
        }
        if (!event.target.value) return;
        this.errorNumero = validator.longitud(event.target.value, 5);
    }

    ChangeCelular(event) {
        this.setState({ celular: event.target.value });
        if (event.target.value === '') {
            this.errorCelular = validator.requerido(event.target.value);
        } else {
            this.errorCelular = validator.numero(event.target.value);
        }
        if (!event.target.value) return;
        this.errorCelular = validator.longitud(event.target.value, 10);
    }

    ChangeTitular(event) {
        this.setState({ titular: event.target.value });
        if (event.target.value === '') {
            this.errorTitular = validator.requerido(event.target.value);
        } else {
            this.errorTitular = validator.soloLetrasNumeros(event.target.value);
        }
    }

    ChangeDescripcion(event) {
        this.setState({ descripcion: event.target.value });
        this.errorDescripcion = validator.soloLetrasNumeros(event.target.value);
    }

    ChangeDto(event) {
        let localidades = [];
        this.setState({ localidadBarrio: { value: null, label: 'Seleccione una localidad' } });

        if (!!event) {
            fetch(
                'https://apis.datos.gob.ar/georef/api/localidades-censales?provincia=cordoba&departamento=' +
                event.value.toString() +
                '&max=1000&formato=json'
            )
                .then((res) => res.json())
                .then(
                    (result) => {
                        result.localidades_censales.forEach((loc) => {
                            localidades.push({ value: loc.id, label: loc.nombre });
                        });
                        localidades = localidades.sort(function (a, b) {
                            if (a.label > b.label) {
                                return 1;
                            }
                            if (a.label < b.label) {
                                return -1;
                            }
                            return 0;
                        });
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        }
        this.setState({ localidades: localidades });
        this.setState({ departamentoBarrio: event });
    }

    async ChangeLoc(event) {
        this.setState({ localidadBarrio: event });
    }

    eliminarImg() {
        this.state.imgStorgeRef
            .delete()
            .then(() => {
                document.getElementById('imgBarrio').src = '';
                this.setState({ imgStorgeRef: '', upLoadValue: 0, name: ''});
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
    }

    async registrar() {
        this.setState({loading: true});
        let error = false;
        await Database.collection('Country')
            .add({
                Nombre: this.state.nombre,
                Calle: this.state.calle,
                Departamento: this.state.departamentoBarrio,
                Localidad: this.state.localidadBarrio,
                Numero: this.state.numero,
                Titular: this.state.titular,
                Celular: this.state.celular,
                Descripcion: !!this.state.descripcion?this.state.descripcion:"Sin descripción",
                FechaAlta: new Date(),
                Imagen: this.state.imagenCountry,
            })
            .catch((e) => {
                error = true;
                this.state.loading = false;
                this.notificationSystem.current.addNotification(operacion.error(e.message));
            });

        if (error) return;
        this.reset();
        this.notificationSystem.current.addNotification(
            operacion.registroConExito("El country se registró con exito"));
    }

    reset() {
        this.setState({
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
            departamentoBarrio: { label: 'Seleccione un departamento' },
            localidades: [],
            localidadBarrio: { label: 'Seleccione una localidad' },
            loading: false
        });
        document.getElementById('imgBarrio').src = '';
    }

    FormInvalid() {

        let invalid = (this.errorNombre.error || this.errorTitular.error ||
            this.errorCalle.error || this.errorNumero.error ||
            this.errorCelular.error || this.errorDescripcion.error);

        if (!invalid) {
            invalid = (!this.state.nombre || !this.state.titular ||
                !this.state.calle || !this.state.numero ||
                !this.state.celular || !this.state.departamentoBarrio
                || !this.state.localidadBarrio);
        }

        if (!invalid) {
            invalid = (!this.state.departamentoBarrio.value
                || !this.state.localidadBarrio.value);
        }

        return invalid;
    }

    render() {
        return (
            <div className={this.state.loading?"col-12 form":"col-12"}>
                <legend>
                    <h3 className="row">Nuevo Country</h3>
                </legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Nombre del country (*)</label>
                                <input
                                    className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                    placeholder="Nombre del country"
                                    value={this.state.nombre}
                                    onChange={this.ChangeNombre}
                                    type="text"
                                    maxLength={50}
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Titular (*)</label>
                                <input
                                    className={errorHTML.classNameError(this.errorTitular, 'form-control')}
                                    placeholder="Titular"
                                    value={this.state.titular}
                                    onChange={this.ChangeTitular}
                                    type="text"
                                    maxLength={50}
                                />
                                {errorHTML.errorLabel(this.errorTitular)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="row-secction col-md-3">
                                <label> Departamento (*)</label>
                                <Select
                                    placeholder="Seleccionar"
                                    className="select-documento"
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={false}
                                    isSearchable={true}
                                    noOptionsMessage={() => "Sin opciones disponibles"}
                                    value={this.state.departamentoBarrio}
                                    options={this.state.departamentos}
                                    onChange={this.ChangeDto.bind(this)}
                                />
                            </div>
                            <div className="row-secction col-md-3">
                                <label> Localidad (*)</label>
                                <Select
                                    className="select-documento"
                                    placeholder="Seleccionar"
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={false}
                                    isSearchable={true}
                                    noOptionsMessage={() => "Sin opciones disponibles"}
                                    value={this.state.localidadBarrio}
                                    options={this.state.localidades}
                                    onChange={this.ChangeLoc.bind(this)}
                                />
                            </div>
                            <div className="row-secction col-md-3">
                                <label> Calle (*)</label>
                                <input
                                    className={errorHTML.classNameError(this.errorCalle, 'form-control')}
                                    placeholder="Calle"
                                    type="text"
                                    maxLength={50}
                                    value={this.state.calle}
                                    onChange={this.ChangeCalle}
                                />
                                {errorHTML.errorLabel(this.errorCalle)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label> Número (*)</label>
                                <input
                                    className={errorHTML.classNameError(this.errorNumero, 'form-control')}
                                    placeholder="Número"
                                    type="number"
                                    value={this.state.numero}
                                    onChange={this.ChangeNumero}
                                />
                                {errorHTML.errorLabel(this.errorNumero)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Celular (*)</label>
                                <input
                                    className={errorHTML.classNameError(this.errorCelular, 'form-control')}
                                    placeholder="Celular"
                                    type="number"
                                    value={this.state.celular}
                                    onChange={this.ChangeCelular}
                                />
                                {errorHTML.errorLabel(this.errorCelular)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 row-secction">
                                <label> Descripción </label>
                                <textarea
                                    className={errorHTML.classNameError(this.errorDescripcion, 'form-control')}
                                    rows="3"
                                    type="text"
                                    maxLength={200}
                                    placeholder="Descripción"
                                    value={this.state.descripcion}
                                    onChange={this.ChangeDescripcion}
                                />
                                {errorHTML.errorLabel(this.errorDescripcion)}
                            </div>
                        </div>
                        <div className="row">
                            <div style={{display:"inline-block"}} >
                                <div style={{display:"flex", justifyContent:'space-between'}} >
                                    <label> Mapa del country </label>
                                    <div hidden={this.state.upLoadValue != 100}>
                                       <img style={{width:'20px'}} src={Delete}  onClick={this.eliminarImg}/>
                                </div>
                                </div>

                                <div hidden={!!this.state.upLoadValue}>
                                    <div hidden={!this.state.upLoadValue}>
                                        <progress value={this.state.upLoadValue} max="100">
                                            {this.state.upLoadValue}%
                                        </progress>
                                    </div>
                                    <label htmlFor="file" className="custom-file">
                                        <i className="pe-7s-cloud-upload"/>
                                        <p>Subir Imagen</p>
                                    </label>
                                    <input id="file" type="file" onChange={this.handleFiles} accept="image/*"/>
                                </div>
                                <img width="320" id="imgBarrio"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{marginBottom:'15px'}} className="text-center">
                    <Button bsStyle="primary" fill wd
                            onClick={this.registrar}
                            disabled={this.FormInvalid()}
                    >
                        Registrar
                    </Button>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
                <div className="spinnerAlta" hidden={!this.state.loading}>
                    <Spinner radius={80} color={'black'}
                             stroke={5}/>
                </div>

            </div>
        );
    }
}

export default AltaCountry;
