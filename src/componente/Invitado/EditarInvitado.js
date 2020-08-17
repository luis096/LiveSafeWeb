import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import Datetime from 'react-datetime';
import { operacion } from '../Operaciones';
import { errorHTML } from '../Error';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';

class EditarInvitado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grupo: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            invitado: [],
            tipoD: [],
            desde: '',
            hasta: '',
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        };
        this.notificationSystem = React.createRef();

        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeDocumentoInvitado = this.ChangeDocumentoInvitado.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeGrupo = this.ChangeGrupo.bind(this);
        this.registrar = this.registrar.bind(this);

        const url = this.props.location.pathname.split('/');
        this.idInvitado = url[url.length - 1];

        this.errorTipoDocumentoInvitado = { error: false, mensaje: '' };
        this.errorTipoDocumento = { error: false, mensaje: '' };
        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorGrupo = { error: false, mensaje: '' };
        this.errorDocumento = { error: false, mensaje: '' };
        this.errorDocumentoInvitado = { error: false, mensaje: '' };
    }

    async componentDidMount() {
        const { tipoD, invitado } = this.state;
        await Database.collection('TipoDocumento')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    tipoD.push({ value: doc.id, label: doc.data().Nombre });
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Invitados')
            .doc(this.idInvitado)
            .get()
            .then((doc) => {
                invitado.push(doc.data(), doc.id);
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        this.setState({
            grupo: invitado[0].Grupo,
            desde: validator.obtenerFecha(invitado[0].FechaDesde),
            hasta: validator.obtenerFecha(invitado[0].FechaHasta),
            tipoDocumento: operacion.obtenerDocumentoLabel(invitado[0].TipoDocumento.id, this.state.tipoD),
        });

        this.setState({ tipoD, invitado });
    }

    ChangeDesde(event) {
        this.setState({ desde: new Date(event) });
        this.setState({
            errorHasta: validator.fechaRango(new Date(event), this.state.hasta, true),
            errorDesde: validator.fechaRango(new Date(event), this.state.hasta, false),
        });
    }

    ChangeHasta(event) {
        this.setState({ hasta: new Date(event) });
        this.setState({
            errorHasta: validator.fechaRango(this.state.desde, new Date(event), false),
            errorDesde: validator.fechaRango(this.state.desde, new Date(event), true),
        });
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

    ChangeSelect(value) {
        this.setState({ tipoDocumento: value });
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);
    }

    ChangeSelectInvitado(value) {
        this.setState({ tipoDocumentoInvitado: value });
        this.errorTipoDocumentoInvitado = validator.requerido(value ? value.value : null);
    }

    ChangeDocumentoInvitado(event) {
        this.setState({ documentoInvitado: event.target.value });
        if (event.target.value === '') {
            this.errorDocumentoInvitado = validator.requerido(event.target.value);
        } else {
            this.errorDocumentoInvitado = validator.numero(event.target.value);
        }
    }

    ChangeFechaNacimiento(event) {
        this.setState({ fechaNacimiento: event.target.value });
    }

    ChangeDocumento(event) {
        this.setState({ documento: event.target.value });
        if (event.target.value === '') {
            this.errorDocumento = validator.requerido(event.target.value);
        } else {
            this.errorDocumento = validator.numero(event.target.value);
        }
    }

    ChangeGrupo(event) {
        this.setState({ grupo: event.target.value });
        {
            this.errorGrupo = validator.requerido(event.target.value);
        }
    }

    async registrar() {
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Invitados')
            .doc(this.idInvitado)
            .update({
                Grupo: this.state.grupo,
                FechaDesde: this.state.desde,
                FechaHasta: this.state.hasta,
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
    }

    render() {
        return (
            <div className="col-12">
                <legend>
                    <h3 className="row">Editar Invitado</h3>
                </legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 row-secction">
                                <label> Nombre </label>
                                <input
                                    type="name"
                                    className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                    placeholder="Nombre"
                                    value={this.state.invitado[0] ? this.state.invitado[0].Nombre : '-'}
                                    disabled={true}
                                    onChange={this.ChangeNombre}
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label> Apellido </label>
                                <input
                                    type="family-name"
                                    className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                    placeholder="Apellido"
                                    value={this.state.invitado[0] ? this.state.invitado[0].Apellido : '-'}
                                    disabled={true}
                                    onChange={this.ChangeApellido}
                                />
                                {errorHTML.errorLabel(this.errorApellido)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Fecha Desde</label>
                                <Datetime
                                    className={this.state.errorDesde.error ? 'has-error' : ''}
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    inputProps={{ placeholder: 'Fecha Desde' }}
                                />
                                <label className="small text-danger" hidden={!this.state.errorDesde.error}>
                                    {this.state.errorDesde.mensaje}
                                </label>
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Fecha Hasta</label>
                                <Datetime
                                    className={this.state.errorHasta.error ? 'has-error' : ''}
                                    value={this.state.hasta}
                                    onChange={this.ChangeHasta}
                                    inputProps={{ placeholder: 'Fecha Hasta' }}
                                />
                                <label className="small text-danger" hidden={!this.state.errorHasta.error}>
                                    {this.state.errorHasta.mensaje}
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Tipo de Documento </label>
                                <input className="form-control" placeholder="Tipo de Documento"
                                       value={this.state.tipoDocumento} disabled={true}/>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Número de Documento </label>
                                <input
                                    type="document"
                                    className={errorHTML.classNameError(this.errorDocumentoInvitado, 'form-control')}
                                    placeholder="Número de Documento"
                                    value={this.state.invitado[0] ? this.state.invitado[0].Documento : '-'}
                                    disabled={true}
                                />
                                {errorHTML.errorLabel(this.errorDocumentoInvitado)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Fecha de Nacimiento</label>
                                <Datetime
                                    timeFormat={false}
                                    value={validator.obtenerFecha(
                                        this.state.invitado[0] ? this.state.invitado[0].FechaNacimiento : new Date()
                                    )}
                                    inputProps={{ placeholder: 'Fecha de Nacimiento', disabled: true }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>
                        Guardar cambios
                    </Button>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
            </div>
        );
    }
}

export default EditarInvitado;
