import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import {Redirect} from 'react-router-dom';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import SweetAlert from 'react-bootstrap-sweetalert';
import { errorHTML } from '../Error';
import { operacion } from '../Operaciones';
import Datetime from "react-datetime";


class AltaEgreso extends Component {

    constructor() {
        super();
        this.state = {
            ingreso: [],
            existePersonaSinIngreso: false,
            busqueda: false,
            tipoDocumento: '',
            documento: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            observacion: '',
            tipoD: [],
            alert: null,
            errorDocumento: {error: false, mensaje: ''}
        };
        this.hideAlert = this.hideAlert.bind(this);
        this.reestablecer = this.reestablecer.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeObservacion = this.ChangeObservacion.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscar = this.buscar.bind(this);
        this.errorDocumento = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        let tiposDocumento = await operacion.obtenerTiposDocumento();
        this.setState({tipoD: tiposDocumento});
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    ChangeObservacion(event) {
        this.setState({observacion: event.target.value});
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: new Date(event)});
    }

    async buscar() {
        const { ingreso } = this.state;
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);

       //Busco en los ingresos aquel que coincida con los datos ingresados (El ultimo ingreso de la persona)
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Hora', 'desc')
            .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
            .limit(1).get().then(querySnapshot=> { querySnapshot.forEach(doc=> {
                if (doc.exists && !doc.data().Egreso){
                    ingreso.push(doc.data(), doc.id);
                    this.setState({
                        nombre: doc.data().Nombre,
                        apellido: doc.data().Apellido
                    })
                }
            });});

        if (!ingreso.length){
            // Buscar entre los propietarios. Para averiguar si existe en el sistema y cargar los datos.
            await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Propietarios')
                .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
                .get().then(querySnapshot=> { querySnapshot.forEach(doc=> {
                    if (doc.exists) {
                        this.setState({
                            nombre: doc.data().Nombre,
                            apellido: doc.data().Apellido,
                            fechaNacimiento: validator.obtenerFecha(doc.data().FechaNacimiento),
                            existePersonaSinIngreso: true
                        })
                    }
                });});
        }

        if (!this.state.existePersonaSinIngreso){
            // Buscar entre los invitados. Para averiguar si existe en el sistema y cargar los datos.
            await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Invitados')
                .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
                .get().then(querySnapshot=> { querySnapshot.forEach(doc=> {
                    if (doc.exists) {
                        this.setState({
                            nombre: doc.data().Nombre,
                            apellido: doc.data().Apellido,
                            fechaNacimiento: validator.obtenerFecha(doc.data().FechaNacimiento),
                            existePersonaSinIngreso: true
                        })
                    }
                });});
        }

        this.setState({ingreso, busqueda: true});
    }

    async registrar() {
        const { ingreso } = this.state;

        let egreso = {
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: operacion.obtenerReferenciaDocumento(this.state.tipoDocumento),
            Documento: this.state.documento,
            Hora: new Date(),
            Observacion: this.state.observacion,
            IdEncargado: operacion.obtenerMiReferencia(2),
        };

        if(!this.state.observacion){
            Database.collection('Country').doc(localStorage.getItem('idCountry'))
                .collection('Ingresos').doc(ingreso[1]).update({Egreso: true});
        }

        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Egresos').add(egreso).then(this.reestablecer);

    }

    hideAlert() {
        this.setState({alert: null});
    }


    reestablecer() {
        this.setState({
            ingreso: [],
            existePersonaSinIngreso: false,
            busqueda: false,
            tipoDocumento: '',
            documento: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            observacion: ''
        });
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Nuevo Egreso</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Buscar persona</h5>
                        <div className='row'>
                            <div className="col-md-4 row-secction">
                                <label>Tipo Documento</label>
                                <Select
                                    value={this.state.tipoDocumento}
                                    isDisabled={this.state.busqueda}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelect.bind(this)}
                                />
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Número de Documento</label>
                                <input className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                       placeholder="Numero de Documento"
                                       disabled={this.state.busqueda}
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento}/>
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-2 row-secction">
                                <Button bsStyle="default" fill wd onClick={this.reestablecer}>
                                    Reestablecer
                                </Button>
                            </div>
                            <div className="col-md-2 row-secction">
                                <Button bsStyle="primary" fill wd onClick={this.buscar}>
                                    Buscar
                                </Button>
                            </div>
                        </div>
                        <div hidden={!this.state.busqueda}>
                            <div hidden={this.state.ingreso.length}>
                                <div hidden={!this.state.existePersonaSinIngreso}>
                                    <h5 className="row text-danger">
                                        La persona ingresada no tiene un ingreso registrado.
                                        Para continuar se debe indicar una observación.
                                    </h5>
                                </div>
                                <div hidden={this.state.existePersonaSinIngreso}>
                                    <h5 className="row text-danger">
                                        La persona ingresada no existe en el sistema. Para registrar el egreso se solicita
                                        completar datos personales junto con una observacion.
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row card" hidden={!this.state.busqueda}>
                        <div className="card-body">
                            <h5 className="row">Resultado de la busqueda</h5>
                            <div className="row">
                                <div className="col-md-3 row-secction">
                                    <label>Tipo de Egreso</label>
                                    <input className="form-control"
                                           disabled={true}
                                           value={this.state.ingreso[0]?
                                               (this.state.ingreso[0].IdPropietario ?
                                                   'Invitado' : 'Propietario') : '-'}
                                    />
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Nombre</label>
                                    <input className="form-control" placeholder="Nombre"
                                           value={this.state.nombre}
                                           onChange={this.ChangeNombre}
                                           disabled={this.state.existePersonaSinIngreso}
                                    />
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Apellido</label>
                                    <input className="form-control" placeholder="Apellido"
                                           value={this.state.apellido}
                                           onChange={this.ChangeApellido}
                                           disabled={this.state.existePersonaSinIngreso}
                                    />
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Fecha de Nacimiento</label>
                                    <Datetime
                                        timeFormat={false}
                                        onChange={this.ChangeFechaNacimiento}
                                        value={this.state.fechaNacimiento}
                                        inputProps={{placeholder: 'Fecha de Nacimiento',disabled: this.state.existePersonaSinIngreso }}
                                    />
                                </div>
                            </div>
                            <div className="row" hidden={this.state.ingreso.length}>
                                <div className="col-md-6 row-secction">
                                    <label>Observacón</label>
                                    <textarea className="form-control" rows="3"
                                    value={this.state.observacion}
                                    onChange={this.ChangeObservacion}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center" hidden={!this.state.busqueda}>
                    <Button bsStyle="info" fill wd onClick={this.registrar}>
                        Registrar Egreso
                    </Button>
                </div>
            </div>
        );
    }
}

export default AltaEgreso;