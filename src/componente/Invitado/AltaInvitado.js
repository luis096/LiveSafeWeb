import React, { Component } from 'react';
import Select from 'react-select';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import Datetime from "react-datetime";


class AltaInvitado extends Component {

    constructor(props) {
        super(props);
        const date = new Date();
        const startDate = date.getTime();
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
            startDate, // Today
            endDate: new Date(startDate).setDate(date.getDate() + 6), // Today + 6 days,
            tipoD: [],// Para cargar el combo
            resultado: '',
            mensaje: ''
        };
        this.esPropietario = localStorage.getItem('tipoUsuario') === 'Propietario' ? true : false;
        this.addInvitado = this.addInvitado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeDocumentoInvitado = this.ChangeDocumentoInvitado.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeGrupo = this.ChangeGrupo.bind(this);
        this.ChangeFechas = this.ChangeFechas.bind(this);
        this.ChangeFechaDesde = this.ChangeFechaDesde.bind(this);
        this.ChangeFechaHasta = this.ChangeFechaHasta.bind(this);
        this.registrar = this.registrar.bind(this);
        this.buscarPropietario = this.buscarPropietario.bind(this);
        this.registrarIngreso = this.registrarIngreso.bind(this);
        this.errorTipoDocumento = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const {tipoD} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        this.setState({tipoD});
        this.setState({idPropietario: localStorage.getItem('idPersona')});

    }


    addInvitado() {
        let fechaHtml = this.state.startDate.split('-');
        fechaHtml[1] = (parseInt(fechaHtml[1]) - 1);
        const fechaDesde = new Date(fechaHtml[0], fechaHtml[1], fechaHtml[2]);
        fechaHtml = this.state.endDate.split('-');
        fechaHtml[1] = (parseInt(fechaHtml[1]) - 1);
        const fechaHasta = new Date(fechaHtml[0], fechaHtml[1], fechaHtml[2]);
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Estado: this.state.estado,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumentoInvitado.valueOf().value),
            Documento: this.state.documentoInvitado,
            Grupo: this.state.grupo,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: new Date(),
            FechaDesde: fechaDesde,
            FechaHasta: fechaHasta,
            IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + this.state.idPropietario)
        });

    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }

    ChangeFechas = (startDate, endDate)=>this.setState({startDate, endDate});

    ChangeFechaDesde(event) {
        this.setState({startDate: event.target.value});
    }

    ChangeFechaHasta(event) {
        this.setState({endDate: event.target.value});
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeSelectInvitado(value) {
        this.setState({tipoDocumentoInvitado: value});
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);
        console.log(this.errorTipoDocumento);
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

    buscarPropietario() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (doc.data().Documento === this.state.documento &&
                    doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value) {
                    this.state.idPropietario = doc.id;
                    // this.state.idCountry = doc.data().IdCountry;
                    this.setState({
                        mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                    });
                }
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
            // IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' +
            // this.state.idPropietario),
            IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona')),
            Estado: true,
            Egreso: false
        });
    }

    registrar() {
        if (!this.esInvalido()) {
            this.addInvitado();
            if (this.esPropietario) {
                console.log('ok');
            } else {
                this.registrarIngreso();
            }
        } else {
            alert('Es invalido');
        }
    }

    esInvalido() {
        //Debe de validar que el campo no sea null. en caso de serlo cambiar el error a true para que se pinte.
        return (
            this.errorTipoDocumento.error
        );
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
                                />
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
                                <label> Fecha Desde </label>
                                <Datetime
                                    inputProps={{ placeholder: "Fecha Desde" }}
                                    defaultValue={new Date()}
                                />
                            </div>
                            <div className="col-md-3 row-secction">
                                <label> Fecha Hasta </label>
                                <Datetime
                                    className="has-error"
                                    inputProps={{ placeholder: "Fecha Hasta" }}
                                    defaultValue={new Date()}
                                />
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
                            <div className="col-md-4 row-secction">
                                <label> Numero de Documento Invitado </label>
                                <input type="document" className="form-control" placeholder="Numero de documento"
                                       value={this.state.documentoInvitado}
                                       onChange={this.ChangeDocumentoInvitado}

                                />
                            </div>
                            <div className="col-md-4 row-secction" hidden={this.esPropietario}>
                                <label> Fecha de Nacimiento </label>
                                <input type="date" className="form-control" name="FechaNacimiento"
                                       step="1" min="1920-01-01"
                                       onChange={this.ChangeFechaNacimiento}
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