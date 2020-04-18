import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link , Redirect} from 'react-router-dom';
import Ingreso from './Ingreso';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import SweetAlert from 'react-bootstrap-sweetalert';
import { errorHTML } from '../Error';
import { operacion } from '../Operaciones';
import { paginador } from '../Paginador';
import Datetime from "react-datetime";


class AltaIngreso extends Component {

    constructor() {
        super();
        this.state = {
            invitadoTemp: [],
            personaEncontrada: [],
            propietarios: [],
            id: -1,
            autenticar: false,
            existeInvitado: false,
            tipoDocumento: '',
            documento: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            tipoD: [],
            alert: null,
            nuevoInvitado: false,
            errorDocumento: {error: false, mensaje: ''}
        };
        this.hideAlert = this.hideAlert.bind(this);
        this.solicitarObservacion = this.solicitarObservacion.bind(this);
        this.errorIngreso = this.errorIngreso.bind(this);
        this.noEncontrado = this.noEncontrado.bind(this);
        this.reestablecer = this.reestablecer.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.setPropietario = this.setPropietario.bind(this);
        this.autenticarInvitado = this.autenticarInvitado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscar = this.buscar.bind(this);
        this.buscarPersona = this.buscarPersona.bind(this);
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
        if( this.state.documento =="" || this.state.tipoDocumento ==""){
            operacion.sinCompletar("Debe completar todos los campos requeridos")
            return
        }
        await this.buscarPersona();
        if (!this.state.invitadoTemp.length) {
            this.state.existeInvitado ? this.errorIngreso('La persona no esta invitada o vencio su plazo de invitacion al barrio') :
                this.noEncontrado('La persona no se encuentra registrada en el sistema. ¿Desea agregarla como un nuevo invitado? ');
        }
    }

    async buscarPersona() {
        const {invitadoTemp} = this.state;
        let {personaEncontrada, nombre, apellido, fechaNacimiento} = this.state;
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);

        //Busco entre los propietarios...
        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Propietarios')
            .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
            .get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (doc.exists) {
                        invitadoTemp.push([doc.data(), doc.id]);
                    }
                });
            });

        //Si no se encontro la persona entre ellos, busco entre los invitados registrados en el barrio 65498789
        if (!invitadoTemp.length) {
            await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Invitados')
                .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
                .get().then(querySnapshot=> {
                    querySnapshot.forEach(doc=> {
                        if (doc.exists) {
                            this.setState({existeInvitado: true});
                            if (doc.data().Estado && validator.validarInvitado(doc.data().FechaDesde, doc.data().FechaHasta)) {
                                invitadoTemp.push([doc.data(), doc.id]);
                                if (!doc.data().Nombre) {
                                    this.setState({autenticar: true});
                                }
                            }
                        }
                    });
                });
        }

        if (invitadoTemp.length > 1) {
            let {propietarios} = this.state;
            let ids = [];
            invitadoTemp.forEach((inv)=> {
                ids.push(inv[0].IdPropietario.id);
            });
            await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Propietarios')
                .get().then(querySnapshot=> {
                    querySnapshot.forEach(doc=> {
                        if (ids.some((id)=>doc.id == id)) {
                            propietarios.push([doc.data(), doc.id]);
                        }
                    });
                });
            this.setState({propietarios});
        }

        personaEncontrada = (invitadoTemp[0] || []);
        if ( personaEncontrada[0] ) {
            nombre = personaEncontrada[0].Nombre;
            apellido = personaEncontrada[0].Apellido;
            fechaNacimiento = validator.obtenerFecha(personaEncontrada[0].FechaNacimiento);
        }

        this.setState({personaEncontrada, fechaNacimiento, nombre, apellido, invitadoTemp});
    }

    async registrar() {
        let invalido = await this.buscarEnIngresos();
        if (invalido) {
            this.solicitarObservacion('La persona ya registra un ingreso el barrio.' +
                ' Para continuear indique una observacion: ');
        } else {
            this.agregarIngreso('');
        }
    }

    agregarIngreso(observacion) {
        this.setState({alert: null});
        let datosPersonas = this.state.personaEncontrada[0];

        if (this.state.invitadoTemp.length > 1){
            datosPersonas.IdPropietario = operacion.obtenerReferenciaConId(3, this.state.id);
        }

        let ingreso = {
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: datosPersonas.TipoDocumento,
            Documento: datosPersonas.Documento,
            Hora: new Date(),
            Egreso: false,
            Estado: true,
            Observacion: observacion,
            IdEncargado: operacion.obtenerMiReferencia(2),
            IdPropietario: datosPersonas.IdPropietario
        };

        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').add(ingreso).then(this.reestablecer);

    }

    errorIngreso(msg) {
        this.setState({
            alert: (
                <SweetAlert
                    style={{display: 'block', marginTop: '-100px', position: 'center'}}
                    title="Error"
                    onConfirm={()=>this.hideAlert()}
                    onCancel={()=>this.hideAlert()}
                    confirmBtnBsStyle="info">
                    {msg}
                </SweetAlert>
            )
        });
    }

    noEncontrado(msg) {
        this.setState({
            alert: (
                <SweetAlert
                    style={{display: 'block', marginTop: '-100px', position: 'center'}}
                    title="Error"
                    showCancel
                    onConfirm={()=>this.setState({nuevoInvitado: true})}
                    onCancel={()=>this.hideAlert()}
                    confirmBtnText={'Nuevo Invitado'}
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger">
                    {msg}
                </SweetAlert>
            )
        });
    }

    setPropietario(ind) {
        this.setState({id: ind});
    }

    hideAlert() {
        this.setState({alert: null});
    }

    async buscarEnIngresos() {
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);
        let ingresoInvalido = false;

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').orderBy('Hora', 'desc')
            .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
            .limit(1).get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (!doc.data().Egreso) {
                        ingresoInvalido = true;
                    }
                });
            });

        return ingresoInvalido;
    }

    solicitarObservacion(msg) {
        this.setState({
            alert: (
                <SweetAlert
                    input
                    required
                    inputType={'textarea'}
                    validationMsg={'La observacion es requerida para registrar el ingreso'}
                    showCancel
                    style={{display: 'block', marginTop: '-100px', position: 'center', left: '50%'}}
                    title="Advertencia"
                    onConfirm={e=>this.agregarIngreso(e)}
                    onCancel={()=>this.hideAlert()}
                    btnSize={'lg'}
                    confirmBtnText={'Confirmar'}
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger"
                >{msg}</SweetAlert>
            )
        });
    }

    redirectNuevoInvitado(){
        if (this.state.nuevoInvitado) {
            this.state.nuevoInvitado = false;
            return <Redirect to='altaInvitado'/>;
        }
    }


    async autenticarInvitado(){
        let { invitadoTemp } = this.state;
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);
        invitadoTemp.forEach(async (inv)=> {
            await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Invitados')
                .doc(inv[1]).set({
                    Nombre: this.state.nombre,
                    Apellido: this.state.apellido,
                    Estado: inv[0].Estado,
                    TipoDocumento: operacion.obtenerReferenciaDocumento(this.state.tipoDocumento),
                    Documento: this.state.documento,
                    Grupo: inv[0].Grupo,
                    FechaNacimiento: this.state.fechaNacimiento,
                    FechaAlta: inv[0].FechaAlta,
                    FechaDesde: inv[0].FechaDesde,
                    FechaHasta: inv[0].FechaHasta,
                    IdPropietario: inv[0].IdPropietario
                });
        });

        this.setState({autenticar: false})
    }

    reestablecer() {
        this.setState({
            invitadoTemp: [],
            personaEncontrada: [],
            propietarios: [],
            id: -1,
            autenticar: false,
            existeInvitado: false,
            tipoDocumento: '',
            documento: '',
            descripcion: ''
        });
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Nuevo Ingreso</h3></legend>
                {this.state.alert}
                {this.redirectNuevoInvitado()}
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Buscar persona</h5>
                        <div className='row'>
                            <div className="col-md-4 row-secction">
                                <label>Tipo Documento</label>
                                <Select
                                    value={this.state.tipoDocumento}
                                    isDisabled={this.state.invitadoTemp.length}
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
                                       disabled={this.state.invitadoTemp.length}
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
                        <div hidden={this.state.invitadoTemp.length <= 1}>
                            <h5 className="row" hidden={this.state.autenticar}>
                                La persona se encuentra actualmente invitada por mas de un propietario.
                                Debe seleccionar el propietario al cual se realiza la visita para registrar el
                                ingreso</h5>
                        </div>
                        <h5 className="row text-danger" hidden={!this.state.autenticar}>
                            El invitado no esta autenticado
                        </h5>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row card" hidden={!this.state.invitadoTemp.length}>
                        <div className="card-body">
                            <h5 className="row">Resultado de la busqueda</h5>
                            <div className="row">
                                <div className="col-md-3 row-secction">
                                    <label>Tipo de Ingreso</label>
                                    <input className="form-control"
                                           disabled={true}
                                           value={this.state.personaEncontrada[0] ?
                                               (this.state.personaEncontrada[0].IdPropietario ?
                                               'Invitado' : 'Propietario') : '-'}
                                    />
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Nombre</label>
                                    <input className="form-control" placeholder="Nombre"
                                           value={this.state.nombre}
                                           onChange={this.ChangeNombre}
                                           disabled={!this.state.autenticar}
                                    />
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Apellido</label>
                                    <input className="form-control" placeholder="Apellido"
                                           value={this.state.apellido}
                                           onChange={this.ChangeApellido}
                                           disabled={!this.state.autenticar}
                                    />
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Fecha de Nacimiento</label>
                                    <Datetime
                                        timeFormat={false}
                                        onChange={this.ChangeFechaNacimiento}
                                        value={this.state.fechaNacimiento}
                                        inputProps={{placeholder: 'Fecha de Nacimiento', disabled: !this.state.autenticar }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center" hidden={!this.state.autenticar}>
                    <Button bsStyle="warning" fill wd onClick={this.autenticarInvitado}>
                        Autenticar
                    </Button>
                </div>

                <div className="col-md-12" hidden={this.state.autenticar}>
                    <div className="card row" hidden={this.state.invitadoTemp.length <= 1}>
                        <h4 className="row">Propietarios</h4>
                        <div className="card-body row">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">Indice</th>
                                    <th scope="col">Tipo Documento</th>
                                    <th scope="col">Documento</th>
                                    <th scope="col">Apellido y Nombre</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.propietarios.map((prop, ind)=> {
                                            let color = prop[1] === this.state.id ? '#afe47f': '';
                                            return (
                                                <tr style={{backgroundColor: color}}
                                                    onClick={()=> {
                                                        this.setPropietario(prop[1]);
                                                    }}>
                                                    <th>{ind + 1}</th>
                                                    <td>{operacion.obtenerDocumentoLabel(prop[0].TipoDocumento.id, this.state.tipoD)}</td>
                                                    <td>{prop[0].Documento}</td>
                                                    <td>{prop[0].Nombre}, {prop[0].Apellido}</td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="text-center" hidden={!this.state.invitadoTemp.length}>
                    <div hidden={this.state.autenticar}>
                        <Button bsStyle="info" fill wd onClick={this.registrar}>
                            Registrar Ingreso
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AltaIngreso;