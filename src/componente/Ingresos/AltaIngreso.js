import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link, Redirect } from 'react-router-dom';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import SweetAlert from 'react-bootstrap-sweetalert';
import { errorHTML } from '../Error';
import { operacion } from '../Operaciones';
import Datetime from 'react-datetime';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';
import Spinner from "react-spinner-material";

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
            esInvitadoEvento: false,
            idsInvitadoAutenticar: [],
            loading: false,
            errorDocumento: { error: false, mensaje: '' },
        };
        this.notificationSystem = React.createRef();
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
        this.errorTipoDocumento = { error: false, mensaje: '' };
        this.errorDocumento = { error: false, mensaje: '' };
        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorObservacion = { error: false, mensaje: '' };
    }

    async componentDidMount() {
        let tiposDocumento = await operacion.obtenerTiposDocumento();
        this.setState({ tipoD: tiposDocumento });
    }

    ChangeSelect(value) {
        this.setState({ tipoDocumento: value });
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        if (event.target.value === "") {
            this.errorDocumento = validator.requerido(event.target.value)
        } else {
            this.errorDocumento = validator.numero(event.target.value)
        }
        if (!event.target.value) return;
        this.errorDocumento = validator.documento(event.target.value);
    }


    ChangeNombre(event) {
        this.setState({ nombre: event.target.value });
        if (event.target.value === '') {
            this.errorNombre = validator.requerido(event.target.value);
        } else {
            this.errorNombre = validator.soloLetras(event.target.value);
        }
    }

    ChangeApellido(event) {
        this.setState({ apellido: event.target.value });
        if (event.target.value === '') {
            this.errorApellido = validator.requerido(event.target.value);
        } else {
            this.errorApellido = validator.soloLetras(event.target.value);
        }
    }

    ChangeFechaNacimiento(event) {
        this.setState({ fechaNacimiento: new Date(event) });
    }

    // Agregar bandera para optimizar
    async buscar() {
        this.setState({loading: true});

        // Busco primero entre los invitados par autenticarlo en caso de que sea necesario.
        // NO valida invitacion solo AUTENTICA!.
        let ids = await this.buscarAutenticar();
        console.log(ids);
        // Si hay que autenticar, que lo haga y luego seguimos el camino normal.
        if (!ids.length) {
            await this.buscarPersona();
            if (!this.state.invitadoTemp.length) {
                this.state.existeInvitado
                    ? this.errorIngreso('La persona no está invitada o venció su plazo de invitación al country.')
                    : this.noEncontrado('La persona no se encuentra registrada en el sistema. ¿Desea agregarla como un nuevo invitado?');
            }
        }

        this.setState({loading: false});
    }


    // Busco para autenticar entre toda la coleccion de invitados. En caso de necesitarlo
    // retorno un array con todos los ids. ademas se pone en true la bandera y guardo los ids.
    async buscarAutenticar() {
        let ids = [];
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Invitados')
            .where('Documento', '==', this.state.documento)
            .where('TipoDocumento', '==', refTipoDocumento)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists && !doc.data().Apellido) {
                       ids.push(doc.id)
                    }
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        this.setState({autenticar: !!ids.length, idsInvitadoAutenticar: ids});
        return ids;
    }

    async buscarPersona() {
        const { invitadoTemp } = this.state;
        let { personaEncontrada, nombre, apellido, fechaNacimiento } = this.state;
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);

        //Busco entre los propietarios...
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Propietarios')
            .where('Documento', '==', this.state.documento)
            .where('TipoDocumento', '==', refTipoDocumento)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        invitadoTemp.push([doc.data(), doc.id]);
                    }
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });


        let temporalEvento = {};

        //Si no se encontro la persona entre ellos, busco entre los invitados registrados en el barrio
        if (!invitadoTemp.length) {
            await Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('Invitados')
                .where('Documento', '==', this.state.documento)
                .where('TipoDocumento', '==', refTipoDocumento)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.exists) {
                            this.setState({ existeInvitado: true });
                            temporalEvento = doc.data();
                            if (doc.data().Estado && validator.validarInvitado(doc.data().FechaDesde, doc.data().FechaHasta)) {
                                invitadoTemp.push([doc.data(), doc.id]);
                            }
                        }
                    });
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
        }

        // Si el invitado existe pero no tiene invitacion valida, busco entre las invitaciones
        // a eventos, si al menos una es valida, se le permite ingresar al country.
        if (!invitadoTemp.length) {
            await Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('InvitacionesEventos')
                .orderBy('FechaHasta', 'desc')
                .where('Documento', '==', this.state.documento)
                .where('TipoDocumento', '==', refTipoDocumento)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.exists) {
                            this.setState({ existeInvitado: true });
                            if (validator.validarInvitado(doc.data().FechaDesde, doc.data().FechaHasta)) {
                                invitadoTemp.push([doc.data(), doc.id]);
                            }
                        }
                    });
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
        }

        if (invitadoTemp.length > 1) {
            let { propietarios } = this.state;
            let ids = [];
            invitadoTemp.forEach((inv) => {
                ids.push(inv[0].IdPropietario.id);
            });
            await Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('Propietarios')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (ids.some((id) => doc.id === id)) {
                            propietarios.push([doc.data(), doc.id]);
                        }
                    });
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
            this.setState({ propietarios });
        }

        personaEncontrada = invitadoTemp[0] || [];
        if (!!personaEncontrada[0]) {
            nombre = personaEncontrada[0].Nombre;
            apellido = personaEncontrada[0].Apellido;
            fechaNacimiento = validator.obtenerFecha(personaEncontrada[0].FechaNacimiento);
        }

        this.setState({ personaEncontrada, fechaNacimiento, nombre, apellido, invitadoTemp });
    }

    async registrar() {
        this.setState({loading: true});
        let invalido = await this.buscarEnIngresos();
        if (invalido) {
            this.setState({loading: false});
            this.solicitarObservacion('La persona ya registra un ingreso el country.' + ' Para continuar indique una observación: ');
        } else {
            this.agregarIngreso('');
        }
    }

    async agregarIngreso(observacion) {
        this.setState({ alert: null, loading: true });
        let datosPersonas = this.state.personaEncontrada[0];

        if (this.state.invitadoTemp.length > 1) {
            datosPersonas.IdPropietario = operacion.obtenerReferenciaConId(3, this.state.id);
        }

        let ingreso = {
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: datosPersonas.TipoDocumento,
            Documento: datosPersonas.Documento,
            Fecha: new Date(),
            Egreso: false,
            Observacion: observacion,
            IdEncargado: operacion.obtenerMiReferencia(2),
            IdPropietario: datosPersonas.IdPropietario ? datosPersonas.IdPropietario : '',
        };

        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Ingresos')
            .add(ingreso)
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        if (!!datosPersonas.IdPropietario) {
            await Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('Notificaciones')
                .add({
                    Fecha: new Date(),
                    IdPropietario: datosPersonas.IdPropietario,
                    Tipo: 'Ingreso',
                    Texto: this.state.nombre + ' ' + this.state.apellido + ' ha ingresado al Country.',
                    Visto: false
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
        }
        this.notificationSystem.current.addNotification(
            operacion.registroConExito("El ingreso se registró con éxito"));
        this.reestablecer();
        this.setState({loading: false});
    }

    errorIngreso(msg) {
        this.setState({
            alert: (
                <SweetAlert
                    style={{ display: 'block', marginTop: '-100px', position: 'center' }}
                    title="Upss!!"
                    onConfirm={() => this.hideAlert()}
                    confirmBtnBsStyle="info">
                    {msg}
                </SweetAlert>
            ),
        });
    }

    noEncontrado(msg) {
        this.setState({
            alert: (
                <SweetAlert
                    style={{ display: 'block', marginTop: '-100px', position: 'center' }}
                    title="Alerta"
                    showCancel
                    onConfirm={() => this.setState({ nuevoInvitado: true })}
                    onCancel={() => this.hideAlert()}
                    confirmBtnText="Nuevo Invitado"
                    cancelBtnText="Cancelar"
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger">
                    {msg}
                </SweetAlert>
            ),
        });
    }

    setPropietario(ind) {
        this.setState({ id: ind });
    }

    hideAlert() {
        this.setState({ alert: null });
    }

    async buscarEnIngresos() {
        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);
        let ingresoInvalido = false;

        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Ingresos')
            .orderBy('Fecha', 'desc')
            .where('Documento', '==', this.state.documento)
            .where('TipoDocumento', '==', refTipoDocumento)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (!doc.data().Egreso) {
                        ingresoInvalido = true;
                    }
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
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
                    validationMsg={'La observación es requerida para registrar el ingreso'}
                    showCancel
                    style={{ display: 'block', marginTop: '-100px', position: 'center', left: '50%' }}
                    title="Advertencia"
                    onConfirm={(e) => this.agregarIngreso(e)}
                    onCancel={() => this.hideAlert()}
                    btnSize={'lg'}
                    cancelBtnText={'Cancelar'}
                    confirmBtnText={'Confirmar'}
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger">
                    {msg}
                </SweetAlert>
            ),
        });
    }

    redirectNuevoInvitado() {
        if (this.state.nuevoInvitado) {
            this.state.nuevoInvitado = false;
            return <Redirect to="altaInvitado"/>;
        }
    }

    async autenticarInvitado() {
        let { idsInvitadoAutenticar } = this.state;
        this.setState({ loading: true });

        // Autenticar todos a la vez.
        // Get a new write batch
        let batch = Database.batch();

        idsInvitadoAutenticar.forEach((idInvitado) => {
            let sfRef = Database.collection('Country')
                .doc(localStorage.getItem('idCountry'))
                .collection('Invitados').doc(idInvitado.toString());
            batch.update(sfRef, "Nombre", this.state.nombre);
            batch.update(sfRef, "Apellido", this.state.apellido);
            batch.update(sfRef, "FechaNacimiento", this.state.fechaNacimiento);
        });

        // Commit the batch
        await batch.commit().then(() => {
            this.setState({ autenticar: false, loading: false });
            this.notificationSystem.current.addNotification(
                operacion.registroConExito("El invitado se autenticó con éxito"));
            this.buscar();
        });
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
            descripcion: '',
            esInvitadoEvento: false,
            idsInvitadoAutenticar: [],
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
        });
    }

    FormInvalid() {

        let invalid = (this.errorDocumento.error );

        if (!invalid) {
            invalid = (!this.state.documento || !this.state.tipoDocumento);
        }

        if (!invalid) {
            invalid = (!this.state.tipoDocumento.value);
        }

        return invalid;
    }


    render() {
        return (
            <div className={this.state.loading ? "col-12 form" : "col-12"}>
                <legend>
                    <h3 className="row">Nuevo Ingreso</h3>
                </legend>
                {this.state.alert}
                {this.redirectNuevoInvitado()}

                {/*Region de la consulta.*/}
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Buscar persona</h5>
                        <div className="row col-md-12">
                            <div className="col-md-3 row-secction">
                                <label>Tipo de Documento</label>
                                <Select
                                    value={this.state.tipoDocumento}
                                    isDisabled={this.state.invitadoTemp.length}
                                    isSearchable={true}
                                    placeholder="Seleccionar"
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelect.bind(this)}
                                />
                                <label className="small text-danger" hidden={!this.errorTipoDocumento.error}>
                                    {this.errorTipoDocumento.mensaje}
                                </label>
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Número de Documento</label>
                                <input
                                    className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                    placeholder="Número de Documento"
                                    type="number"
                                    disabled={this.state.invitadoTemp.length}
                                    value={this.state.documento}
                                    onChange={this.ChangeDocumento}
                                />
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-2 row-secction" style={{ marginTop: '25px', marginRight: '20px' }}>
                                <Button bsStyle="default" style={{ marginRight: '10px' }} fill wd onClick={this.reestablecer}>
                                    Restablecer
                                </Button>
                            </div>
                            <div className="col-md-2 row-secction" style={{ marginTop: '25px' }}>
                                <Button bsStyle="primary" fill wd
                                        onClick={this.buscar}
                                        disabled={this.FormInvalid() ||
                                        this.state.personaEncontrada.length ||
                                        this.state.autenticar}>
                                    Buscar
                                </Button>
                            </div>
                        </div>

                        {/*Mensajes de distintos caminos. (1-Mas de un propietario 2-No esta autenticado)*/}
                        <div hidden={this.state.invitadoTemp.length <= 1}>
                            <h5 className="row text-danger" hidden={this.state.autenticar}>
                                La persona ha sido invitada por más de un propietario. Debe seleccionar el propietario al
                                cual se realiza la visita para registrar el ingreso
                            </h5>
                        </div>
                        <h5 className="row text-danger" hidden={!this.state.autenticar}>
                            El invitado no está autenticado
                        </h5>
                    </div>
                </div>


                {/*Region de resultado. Se muestra la perona encontrada,
                se habilitan los campos par escribir en caso de autenticar sea necesario*/}
                <div className="col-md-12" hidden={!this.state.personaEncontrada.length && !this.state.autenticar}>
                    <div className="row card">
                        <div className="card-body">
                            <h5 className="row">Resultado de la búsqueda</h5>
                            <div className="row">
                                <div className="col-md-3 row-secction">
                                    <label>Nombre</label>
                                    <input
                                        className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                        placeholder="Nombre"
                                        value={this.state.nombre}
                                        onChange={this.ChangeNombre}
                                        disabled={!this.state.autenticar}
                                    />
                                    {errorHTML.errorLabel(this.errorNombre)}
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Apellido</label>
                                    <input
                                        className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                        placeholder="Apellido"
                                        value={this.state.apellido}
                                        onChange={this.ChangeApellido}
                                        disabled={!this.state.autenticar}
                                    />
                                    {errorHTML.errorLabel(this.errorApellido)}
                                </div>
                                <div className="col-md-3 row-secction">
                                    <label>Fecha de Nacimiento</label>
                                    <Datetime
                                        timeFormat={false}
                                        onChange={this.ChangeFechaNacimiento}
                                        value={this.state.fechaNacimiento}
                                        inputProps={{
                                            placeholder: 'Fecha de Nacimiento',
                                            disabled: !this.state.autenticar
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/*Boton de autenticar al Invitado*/}
                <div className="text-center" hidden={!this.state.autenticar}>
                    <Button bsStyle="warning" fill wd onClick={this.autenticarInvitado}>
                        Autenticar
                    </Button>
                </div>


                {/*Region Tabla de Propietarios
                  se muestra en caso de que NO REQUIERA AUTENTICAR, y TENGA MAS DE 1 PROPIETARIO*/}
                <div className="col-md-12" hidden={this.state.autenticar || this.state.invitadoTemp.length <= 1}>
                    <div className="card row">
                        <h4 className="row">Propietarios</h4>
                        <div className="card-body row">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Índice</th>
                                        <th scope="col">Tipo Documento</th>
                                        <th scope="col">Documento</th>
                                        <th scope="col">Nombre y Apellido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.propietarios.map((prop, ind) => {
                                        let color = prop[1] === this.state.id ? '#afe47f' : '';
                                        return (
                                            <tr
                                                style={{ backgroundColor: color }}
                                                onClick={() => {
                                                    this.setPropietario(prop[1]);
                                                }}>
                                                <th>{ind + 1}</th>
                                                <td>{operacion.obtenerDocumentoLabel(prop[0].TipoDocumento.id, this.state.tipoD)}</td>
                                                <td>{prop[0].Documento}</td>
                                                <td>
                                                    {prop[0].Nombre} {prop[0].Apellido}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/*Registrar ingreso.
                Se muestra si:
                    - Encontro al menos una persona.
                    - No requiera autenticar.
                Se deshabilita si:
                    - Esta cargando o si tiene mas de un propietario y no lo eligio aun

                */}
                <div className="text-center" hidden={!this.state.invitadoTemp.length}>
                    <div hidden={this.state.autenticar} style={{ marginBottom: '10px' }}>
                        <Button bsStyle="info" fill wd onClick={this.registrar}
                                disabled={this.state.loading || (this.state.propietarios.length > 1 && this.state.id === -1)}>
                            Registrar Ingreso
                        </Button>
                    </div>
                </div>



                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
                <div className="spinnerAlta" hidden={!this.state.loading}>
                    <Spinner radius={80} color={'black'}
                             stroke={5}/>
                </div>
            </div>
        );
    }
}

export default AltaIngreso;
