import React, {Component} from 'react';
import Select from 'react-select';
import {Database} from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import {validator} from '../validator';
import Datetime from 'react-datetime';
import {errorHTML} from '../Error';
import {style} from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';
import {operacion} from '../Operaciones';
import "../Style/SpinnerAltas.scss"
import Spinner from "react-spinner-material";

class AltaInvitado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipoDocumentoInvitado: '',
            documentoInvitado: '',
            estado: true,
            idPropietario: '',
            desde: null,
            hasta: null,
            tipoD: [],
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''},
        };
        this.notificationSystem = React.createRef();
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeDocumentoInvitado = this.ChangeDocumentoInvitado.bind(this);
        this.registrar = this.registrar.bind(this);
        this.errorTipoDocumentoInvitado = {error: false, mensaje: ''};
        this.errorDocumentoInvitado = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const {tipoD} = this.state;
        await Database.collection('TipoDocumento')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    tipoD.push({value: doc.id, label: doc.data().Nombre});
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({tipoD});
        this.setState({idPropietario: localStorage.getItem('idPersona')});
    }

    ChangeDesde(event) {
        this.setState({desde: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(new Date(event), this.state.hasta, true),
            errorDesde: validator.fechaRango(new Date(event), this.state.hasta, false),
        });
    }

    ChangeHasta(event) {
        this.setState({hasta: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(this.state.desde, new Date(event), false),
            errorDesde: validator.fechaRango(this.state.desde, new Date(event), true),
        });
    }

    ChangeSelectInvitado(value) {
        this.setState({tipoDocumentoInvitado: value});
        this.errorTipoDocumentoInvitado = validator.requerido(value ? value.value : null);
    }

    ChangeDocumentoInvitado(event) {
        this.setState({documentoInvitado: event.target.value});
        if (event.target.value === "") {
            this.errorDocumentoInvitado = validator.requerido(event.target.value)
        } else {
            this.errorDocumentoInvitado = validator.numero(event.target.value)
        }
        if (!event.target.value) return;
        this.errorDocumentoInvitado = validator.documento(event.target.value);
    }

    async registrar() {
        this.setState({loading: true});
        let e = false;

        let result = await this.buscarInvitadoAutenticado();

        console.log(result);
        if (result.repetido) {
            this.notificationSystem.current.addNotification(
                operacion.error("El invitado ya existe."));
            this.reset();
            this.setState({loading: false});
            return;
        }

        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Invitados')
            .add(result.invitado)
            .catch((error) => {
                e = true;
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        this.reset();
        this.setState({loading: false});
        if (e) return;
        this.notificationSystem.current.addNotification(
            operacion.registroConExito("El invitado se registró con éxito."));
    }


    async buscarInvitadoAutenticado() {
        let repetido = false;
        let invitado = {
            Estado: true,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumentoInvitado.value),
            Documento: this.state.documentoInvitado,
            FechaAlta: new Date(),
            FechaDesde: this.state.desde,
            FechaHasta: this.state.hasta,
            IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + this.state.idPropietario),
        };

        let refTipoDocumento = await operacion.obtenerReferenciaDocumento(this.state.tipoDocumentoInvitado);

        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Invitados')
            .where('Documento', '==', this.state.documentoInvitado)
            .where('TipoDocumento', '==', refTipoDocumento)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists && !!doc.data().Apellido) {
                        invitado.Nombre = doc.data().Nombre;
                        invitado.Apellido = doc.data().Apellido;
                        invitado.FechaNacimiento = doc.data().FechaNacimiento;
                        if (!repetido) {
                            repetido = (doc.data().IdPropietario.id === this.state.idPropietario);
                        }
                    }
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        return {invitado: invitado, repetido: repetido};
    }

    reset() {
        this.setState({
            tipoDocumentoInvitado: '',
            documentoInvitado: '',
            estado: true,
            desde: null,
            hasta: null,
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''},
        })
    }

    FormInvalid() {

        let invalid = (this.state.errorDesde.error || this.state.errorHasta.error ||
            this.errorDocumentoInvitado.error);

        if (!invalid) {
            invalid = (!this.state.desde || !this.state.documentoInvitado ||
                !this.state.hasta || !this.state.tipoDocumentoInvitado ||
                !this.state.tipoDocumentoInvitado.value);
        }

        return invalid;
    }

    render() {
        return (
            <div className={this.state.loading ? "col-12 form" : "col-12"}>
                <legend>
                    <h3 className="row">Nuevo Invitado</h3>
                </legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 row-secction">
                                <label> Tipo de Documento (*)</label>
                                <Select
                                    classNamePrefix="select"
                                    placeholder="Seleccionar"
                                    isSearchable={true}
                                    value={this.state.tipoDocumentoInvitado}
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelectInvitado.bind(this)}
                                />
                                <label className="small text-danger" hidden={!this.errorTipoDocumentoInvitado.error}>
                                    {this.errorTipoDocumentoInvitado.mensaje}
                                </label>
                            </div>
                            <div className="col-md-3 row-secction">
                                <label> Número de Documento (*)</label>
                                <input
                                    type="number"
                                    className={errorHTML.classNameError(this.errorDocumentoInvitado, 'form-control')}
                                    placeholder="Número de documento"
                                    value={this.state.documentoInvitado}
                                    onChange={this.ChangeDocumentoInvitado}
                                />
                                {errorHTML.errorLabel(this.errorDocumentoInvitado)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Fecha Desde (*)</label>
                                <Datetime
                                    className={this.state.errorDesde.error ? 'has-error' : ''}
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    inputProps={{placeholder: 'Fecha Desde'}}
                                />
                                <label className="small text-danger" hidden={!this.state.errorDesde.error}>
                                    {this.state.errorDesde.mensaje}
                                </label>
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Fecha Hasta (*)</label>
                                <Datetime
                                    className={this.state.errorHasta.error ? 'has-error' : ''}
                                    value={this.state.hasta}
                                    onChange={this.ChangeHasta}
                                    inputProps={{placeholder: 'Fecha Hasta'}}
                                />
                                <label className="small text-danger" hidden={!this.state.errorHasta.error}>
                                    {this.state.errorHasta.mensaje}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar} disabled={this.FormInvalid()}>
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

export default AltaInvitado;
