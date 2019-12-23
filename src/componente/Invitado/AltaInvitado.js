import React, { Component } from 'react';
import Select from 'react-select';
//import '../Style/Alta.css';
//import './Index.css';
import { Link } from 'react-router-dom';
import { Database, Firebase } from '../../config/config';
// import { DatePicker, RangeDatePicker } from '@y0c/react-datepicker';


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
        let fechaHtml =  this.state.startDate.split('-')
        fechaHtml[1] = (parseInt(fechaHtml[1]) - 1 )
        const fechaDesde = new Date(fechaHtml[0], fechaHtml[1], fechaHtml[2]);
        fechaHtml = this.state.endDate.split('-')
        fechaHtml[1] = (parseInt(fechaHtml[1]) - 1 )
        const fechaHasta = new Date(fechaHtml[0], fechaHtml[1], fechaHtml[2]);;
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
            // IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + this.state.idPropietario),
            IdEncargado: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona')),
            Estado: true,
            Egreso: false
        });
    }

    registrar() {
        //Agregar validaciones para no registrar cualquier gilada
        if (true) {
            this.addInvitado();
            if (this.esPropietario) {
                console.log('ok')
            } else {
                this.registrarIngreso();
            }
        }
    }


    render() {
        return (
            <div className="col-12 ">
                <div>
                    <div className="row">

                        <legend hidden={this.esPropietario}> Nuevo Invitado</legend>
                        <div className="col-md-6  flex-container form-group"
                             hidden={this.esPropietario}>
                            <label htmlFor="TipoDocumento"> Tipo Documento </label>
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

                        <div className="col-md-6  flex-container form-group"
                             hidden={this.esPropietario}>
                            <label htmlFor="NumeroDocumento"> Numero de Documento </label>
                            <input type="document" className="form-control" placeholder="Document number"
                                   value={this.state.documento}
                                   onChange={this.ChangeDocumento}

                            />
                            <label>{this.state.mensaje}</label>
                        </div>
                        <div className="col-md-4  flex-container form-group"
                             hidden={this.esPropietario}>
                            <button type="button" className="btn btn-danger" variant="secondary"
                                    onClick={this.buscarPropietario}

                            >Buscar Propietario
                            </button>
                        </div>
                        <div className="col-md-8  flex-container form-group"></div>

                        <div className="col-md-6  flex-container form-group">
                            <label htmlFor="Nombre"> Grupo </label>
                            <input type="name" className="form-control" placeholder="Name"
                                   value={this.state.grupo}
                                   onChange={this.ChangeGrupo}
                            />
                        </div>
                        <div className="col-md-3  flex-container form-group ">
                            <label> Fecha Desde </label>
                            <input type="date" className="form-control" name="FechaDesde"
                                   step="1" min="1920-01-01" value={this.state.startDate}
                                   onChange={this.ChangeFechaDesde}
                                   disabled={!this.esPropietario}
                            />
                        </div>
                        <div className="col-md-3  flex-container form-group ">
                            <label> Fecha Hasta </label>
                            <input type="date" className="form-control" name="FechaHasta"
                                   step="1" min="1920-01-01" value={this.state.endDate}
                                   disabled={!this.esPropietario}
                                   onChange={this.ChangeFechaHasta}
                            />
                        </div>
                        <div className="col-md-6  flex-container form-group" hidden={this.esPropietario}>
                            <label for="Nombre"> Nombre </label>
                            <input type="name" className="form-control" placeholder="Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}

                            />
                        </div>
                        <div className="col-md-6  flex-container form-group" hidden={this.esPropietario}>
                            <label for="Apellido"> Apellido </label>
                            <input type="family-name" className="form-control" placeholder="Surname"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}
                            />
                        </div>

                        <div className="col-md-6  flex-container form-group">
                            <label for="TipoDocumento"> Tipo Documento Invitado </label>
                            <Select
                                className="select-documento"
                                classNamePrefix="select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.tipoD}
                                onChange={this.ChangeSelectInvitado.bind(this)}

                            />
                        </div>
                        <div className="col-md-6  flex-container form-group">
                            <label for="NumeroDocumento"> Numero de Documento Invitado </label>
                            <input type="document" className="form-control" placeholder="Document number"
                                   value={this.state.documentoInvitado}
                                   onChange={this.ChangeDocumentoInvitado}

                            />
                        </div>
                        <div className="col-md-6  flex-container form-group" hidden={this.esPropietario}>
                            <label for="FechaNacimiento"> Fecha de Nacimiento </label>
                            <input type="date" className="form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group izquierda">
                    {/*<button type="button" className="btn btn-primary boton" variant="secondary"*/}
                            {/*onClick={this.props.cerrar}*/}
                            {/*hidden={!this.esPropietario}*/}
                    {/*>Volver*/}
                    {/*</button>*/}
                    <Link to='/' type="button" className="btn btn-primary boton" variant="secondary"
                          hidden={this.esPropietario}
                    >Volver</Link>
                    <button className="btn btn-primary boton" variant="primary" onClick={this.registrar}
                    >Registrar
                    </button>

                </div>
            </div>
        );
    }
}

export default AltaInvitado;