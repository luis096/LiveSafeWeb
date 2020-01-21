import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import Datetime from "react-datetime";



class EditarInvitado extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invitado: [],
            grupo: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            estado: '',
            descripcion: '',
            fechaNacimiento: '',
            idCountry: '',
            idPropietario: '',
            tipoD: [],
            resultado: '',
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}
        };
        this.esPropietario = localStorage.getItem('tipoUsuario') === 'Propietario';
        this.editInvitado = this.editInvitado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeGrupo = this.ChangeGrupo.bind(this);
        this.registrar = this.registrar.bind(this);

        const url = this.props.location.pathname.split('/');
        this.idInvitado = url[url.length - 1];
    }

    async componentDidMount() {
        const {tipoD, invitado} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').doc(this.idInvitado).get()
            .then(doc=> {
                invitado.push(doc.data());
            });
        this.setState({tipoD, invitado});

        let inv = this.state.invitado[0];
        this.setState({tipoDocumento: this.obtenerDocumentoLabel(inv.TipoDocumento.id)});
        this.setState({
            nombre: inv.Nombre,
            apellido: inv.Apellido,
            estado: inv.Estado,
            documento: inv.Documento,
            grupo: inv.Grupo,
            fechaNacimiento: validator.obtenerFecha(inv.FechaNacimiento),
            fechaAlta: inv.FechaAlta,
            desde: validator.obtenerFecha(inv.FechaDesde),
            hasta: validator.obtenerFecha(inv.FechaHasta),
            idPropietario: inv.IdPropietario
        });
    }

    editInvitado() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').doc(this.idInvitado).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Estado: this.state.estado,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            Grupo: this.state.grupo,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: this.state.fechaAlta,
            FechaDesde: this.state.desde,
            FechaHasta: this.state.hasta,
            IdPropietario: this.state.idPropietario
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

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: new Date(event)});
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
    }

    ChangeGrupo(event) {
        this.setState({grupo: event.target.value});
    }

    registrarIngreso(persona) {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Ingresos').add(persona);
    }

    registrarEgreso(persona) {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Egresos').add(persona);
    }

    async registrar() {
        await this.editInvitado();
        let datos = {
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.value),
            Documento: this.state.documento,
            Hora: new Date(),
            Egreso: false,
            Descripcion: '',
            IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona'))
        };
        if (localStorage.getItem('tipoUsuario') === 'Encargado' && localStorage.getItem('editarInvitado') === 'Ingreso') {
            datos.Egreso = false;
            this.registrarIngreso(datos);
        } else if (localStorage.getItem('tipoUsuario') === 'Encargado' && localStorage.getItem('editarInvitado') === 'Egreso') {
            datos.Egreso = true;
            this.registrarEgreso(datos);

        }
    }

    obtenerDocumentoLabel(id) {
        let label = null;
        this.state.tipoD.map(doc=> {
            if (doc.value === id) {
                label = doc;
            }
        });
        return label;
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Editar Invitado</h3></legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label>Grupo</label>
                                <input className="form-control" placeholder="Grupo"
                                       value={this.state.grupo}
                                       onChange={this.ChangeGrupo}
                                       disabled={!this.esPropietario}
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
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Nombre </label>
                                <input type="name" className="form-control" placeholder="Nombre"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}
                                       disabled={this.esPropietario}
                                />
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Apellido </label>
                                <input type="family-name" className="form-control" placeholder="Apellido"
                                       value={this.state.apellido}
                                       onChange={this.ChangeApellido}
                                       disabled={this.esPropietario}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Tipo Documento </label>
                                <Select
                                    className="select-documento"
                                    classNamePrefix="select"
                                    value={this.state.tipoDocumento}
                                    isDisabled={true}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    onChange={this.ChangeSelect.bind(this)}
                                />
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Número de Documento </label>
                                <input type="document" className="form-control" placeholder="Número de Documento"
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento}
                                       disabled={true}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label>Fecha de Nacimiento</label>
                                <Datetime
                                    timeFormat={false}
                                    onChange={this.ChangeFechaNacimiento}
                                    value={this.state.fechaNacimiento}
                                    inputProps={{placeholder: 'Fecha de Nacimiento'}}
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

export default EditarInvitado;