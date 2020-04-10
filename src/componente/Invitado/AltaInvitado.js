import React, { Component } from 'react';
import Select from 'react-select';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import Datetime from "react-datetime";


class AltaInvitado extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grupo: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            tipoDocumentoInvitado: '',
            documentoInvitado: '',
            estado: true,
            descripcion: '',
            fechaNacimiento: '',
            idCountry: '',
            idPropietario: '',
            desde: null,
            hasta: null,
            tipoD: [],
            resultado: '',
            mensaje: '',
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}
        };
        this.esPropietario = localStorage.getItem('tipoUsuario') === 'Propietario';
        this.addInvitado = this.addInvitado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeDocumentoInvitado = this.ChangeDocumentoInvitado.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeGrupo = this.ChangeGrupo.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscarPropietario = this.buscarPropietario.bind(this);
        this.registrarIngreso = this.registrarIngreso.bind(this);
        this.errorTipoDocumentoInvitado = {error: false, mensaje: ''};
        this.errorTipoDocumento = {error: false, mensaje: ''};

    }

    async componentDidMount() {
        const {tipoD} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        this.setState({tipoD});
        this.setState({idPropietario: localStorage.getItem('idPersona')});

    }

    ChangeDesde(event) {
        this.setState({desde: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(new Date(event), this.state.hasta, true),
            errorDesde: validator.fechaRango(new Date(event), this.state.hasta, false)
        });
    }

    ChangeHasta(event) {
        this.setState({hasta: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(this.state.desde, new Date(event), false),
            errorDesde: validator.fechaRango(this.state.desde, new Date(event), true)
        });
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);

    }

    ChangeSelectInvitado(value) {
        this.setState({tipoDocumentoInvitado: value});
        this.errorTipoDocumentoInvitado = validator.requerido(value ? value.value : null);
    }

    ChangeDocumentoInvitado(event) {
        this.setState({documentoInvitado: event.target.value});
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    ChangeGrupo(event) {
        this.setState({grupo: event.target.value});
    }

    addInvitado() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Estado: this.state.estado,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumentoInvitado.value),
            Documento: this.state.documentoInvitado,
            Grupo: this.state.grupo,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: new Date(),
            FechaDesde: this.state.desde,
            FechaHasta: this.state.hasta,
            IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + this.state.idPropietario)
        });
    }

    buscarPropietario() {
        let refTipoDocumento = Database.doc('TipoDocumento/' + this.state.tipoDocumento.value);
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').where('Documento', '==', this.state.documento)
            .where('TipoDocumento', '==', refTipoDocumento).get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                    this.state.idPropietario = doc.id;
                    this.setState({ mensaje: doc.data().Apellido + ', ' + doc.data().Nombre });

            });
        });
    }

    registrarIngreso() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumentoInvitado.valueOf().value),
            Documento: this.state.documentoInvitado,
            Hora: new Date(),
            IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona')),
            Estado: true,
            Egreso: false
        });
    }

    registrar() {
        if (validator.isValid([this.errorTipoDocumento])) {
            this.addInvitado();
            if (!this.esPropietario) {
                this.registrarIngreso();
            }
        } else {
            console.log('Es Invalido')
        }
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Nuevo Invitado</h3></legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row" hidden={this.esPropietario}>
                            <div className="col-md-3 row-secction">
                                <label>Tipo Documento</label>
                                <Select
                                    className="select-documento"
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelect.bind(this)}
                                    styles={this.errorTipoDocumento.error ? {
                                        control: (base, state)=>({
                                            ...base,
                                            borderColor: 'red',
                                            boxShadow: 'red'
                                        })
                                    } : {}}
                                />
                                <label className='small text-danger'
                                       hidden={!this.errorTipoDocumento.error}>{this.errorTipoDocumento.mensaje}</label>
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Número de Documento</label>
                                <input className="form-control" placeholder="Número de Documento"
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento}
                                />
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Propietario encontrado</label>
                                <input className="form-control" placeholder="Realize la busqueda"
                                       value={this.state.mensaje}
                                       disabled={true}
                                />
                            </div>
                            <div className="col-md-2 row-secction">
                                <Button bsStyle="info" fill wd onClick={this.buscarPropietario}>
                                    Buscar Propietario
                                </Button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Grupo </label>
                                <input type="name" className="form-control" placeholder="Name"
                                       value={this.state.grupo}
                                       onChange={this.ChangeGrupo}
                                />
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Fecha Desde</label>
                                <Datetime
                                    className={this.state.errorDesde.error ? 'has-error' : ''}
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    inputProps={{placeholder: 'Fecha Desde'}}
                                />
                                <label className='small text-danger'
                                       hidden={!this.state.errorDesde.error}>{this.state.errorDesde.mensaje}</label>
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Fecha Hasta</label>
                                <Datetime
                                    className={this.state.errorHasta.error ? 'has-error' : ''}
                                    value={this.state.hasta}
                                    onChange={this.ChangeHasta}
                                    inputProps={{placeholder: 'Fecha Hasta'}}
                                />
                                <label className='small text-danger'
                                       hidden={!this.state.errorHasta.error}>{this.state.errorHasta.mensaje}</label>
                            </div>
                        </div>

                        <div className="row" hidden={this.esPropietario}>
                            <div className="col-md-6 row-secction">
                                <label> Nombre </label>
                                <input type="name" className="form-control" placeholder="Nombre"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}

                                />
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Apellido </label>
                                <input type="family-name" className="form-control" placeholder="Apellido"
                                       value={this.state.apellido}
                                       onChange={this.ChangeApellido}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Tipo Documento Invitado </label>
                                <Select
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelectInvitado.bind(this)}
                                    styles={this.errorTipoDocumentoInvitado.error ? {
                                        control: (base, state)=>({
                                            ...base,
                                            borderColor: 'red',
                                            boxShadow: 'red'
                                        })
                                    } : {}}
                                />
                                <label className='small text-danger'
                                       hidden={!this.errorTipoDocumentoInvitado.error}>{this.errorTipoDocumentoInvitado.mensaje}</label>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Numero de Documento Invitado </label>
                                <input type="document" className="form-control" placeholder="Numero de documento"
                                       value={this.state.documentoInvitado}
                                       onChange={this.ChangeDocumentoInvitado}

                                />
                            </div>
                            <div className="col-md-4 row-secction" hidden={this.esPropietario}>
                                <label>Fecha de Nacimiento</label>
                                <Datetime
                                    inputProps={{placeholder: 'Fecha de nacimiento'}}
                                />
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

export default AltaInvitado;