import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Link } from 'react-router-dom';
import { Database, Firebase } from '../../config/config';
import { DatePicker, RangeDatePicker } from '@y0c/react-datepicker';
import { validator } from '../validator';


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
        
        this.errorGrupo = {error: false, mensaje: ''};
        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorDocumentoInvitado = {error: false, mensaje: ''};
        this.errorDescripcion = {error: false, mensaje: ''};
        this.errorNacimiento = {error: false, mensaje: ''};
        this.errorSelect = {error: false, mensaje: ''};
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
            FechaDesde: this.state.startDate,
            FechaHasta: this.state.endDate,
            IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + this.state.idPropietario)
        });

    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.requerido(event.target.value);
        if (!this.errorNombre.error) {
            this.errorNombre = validator.soloLetras(event.target.value);
        }
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        this.errorApellido = validator.requerido(event.target.value);
        if (!this.errorApellido.error) {
            this.errorApellido = validator.soloLetras(event.target.value);
        }
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
        this.errorDocumentoInvitado = validator.requerido(event.target.value);
        if (!this.errorDocumentoInvitado.error) {
            this.errorDocumentoInvitado = validator.numero(event.target.value);
        }
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event.target.value});
        this.errorNacimiento = validator.requerido(event.target.value);
        if (!this.errorNacimiento.error) {
            this.errorNacimiento = validator.numero(event.target.value);
        }
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        this.errorDocumento = validator.requerido(event.target.value);
        if (!this.errorDocumento.error) {
            this.errorDocumento = validator.numero(event.target.value);
        }
    }

    ChangeGrupo(event) {
        this.setState({grupo: event.target.value});
        this.errorGrupo = validator.soloLetras(event.target.value);
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

    /*registrar() {
        //Agregar validaciones para no registrar cualquier gilada
        if (true) {
            this.addInvitado();
            if (this.esPropietario) {
                this.props.cerrar();
            } else {
                this.registrarIngreso();
            }
        }
    }*/

    registrar() {
        if (!(this.esValido())) {
            this.addInvitado();
            this.setState({
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
                tipoD: [],// Para cargar el combo   
                resultado: 1
            });
        } else {
            this.setState({resultado: 2});
        }
    }

    esValido() {
        return (
            this.errorGrupo||
            this.errorNombre ||
            this.errorApellido ||
            this.errorDocumento ||
            this.errorDocumentoInvitado||
            this.errorDescripcion||
            this.errorNacimiento||
            this.errorSelect
        );
    }

    render() {
        return (
            <div className="col-12 ">
                <div>
                    <div className="row">

                        <legend hidden={this.esPropietario}> Nuevo Invitado</legend>
                        <div className={this.errorSelect.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}
                             hidden={this.esPropietario}>
                            <label for="TipoDocumento"> Tipo Documento </label>
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

                        <div className={this.errorDocumento.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}
                             hidden={this.esPropietario}>
                            <label for="NumeroDocumento"> Numero de Documento </label>
                            <input type="document" className={this.errorDocumento.error ? 'form-control is-invalid ' : 'form-control'}
                                     placeholder="Document number"
                                   value={this.state.documento}
                                   onChange={this.ChangeDocumento}
                            />
                            <div className="invalid-feedback">{this.errorDocumento.mensaje}</div>
                            <label>{this.state.mensaje}</label>
                            
                        </div>
                        <div className='col-md-6 form-group has-feedback'  hidden={this.esPropietario}>
                            <button type="button" className="btn btn-danger" variant="secondary"
                                    onClick={this.buscarPropietario}

                            >Buscar Propietario
                            </button>
                        </div>
                        <div className="col-md-8  flex-container form-group"></div>

                        <div className={this.errorGrupo.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="Nombre"> Grupo </label>
                            <input type="name" className={this.errorGrupo.error ? 'form-control is-invalid ' : 'form-control'}
                                     placeholder="Name"
                                   value={this.state.grupo}
                                   onChange={this.ChangeGrupo}
                            />
                            <div className="invalid-feedback">{this.errorGrupo.mensaje}</div>
                        </div>
                        <div className={this.errorSelect.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label> Fecha Desde </label>
                            <input type="date" className={this.errorSelect.error ? 'form-control is-invalid ' : 'form-control'} 
                                    name="FechaDesde"
                                   step="1" min="1920-01-01" value={this.state.startDate}
                                   onChange={this.ChangeFechaDesde}
                                   disabled={!this.esPropietario}
                            />
                            <div className="invalid-feedback">{this.errorSelect.mensaje}</div>
                        </div>
                        <div className={this.errorNombre.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label> Fecha Hasta </label>
                            <input type="date" className={this.errorNombre.error ? 'form-control is-invalid ' : 'form-control'}
                                     name="FechaHasta"
                                   step="1" min="1920-01-01" value={this.state.endDate}
                                   disabled={!this.esPropietario}
                                   onChange={this.ChangeFechaHasta}
                            />
                        </div>
                        <div className={this.errorNombre.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'} hidden={this.esPropietario}>
                            <label for="Nombre"> Nombre </label>
                            <input type="name" className={this.errorNombre.error ? 'form-control is-invalid ' : 'form-control'}
                                     placeholder="Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                            <div className="invalid-feedback">{this.errorNombre.mensaje}</div>
                        </div>
                        <div className={this.errorApellido.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'} hidden={this.esPropietario}>
                            <label for="Apellido"> Apellido </label>
                            <input type="family-name" className={this.errorApellido.error ? 'form-control is-invalid ' : 'form-control'} 
                                    placeholder="Surname"
                                   value={this.state.apellido}
                                   onChange={this.ChangeApellido}
                            />
                            <div className="invalid-feedback">{this.errorApellido.mensaje}</div>
                        </div>

                        <div className={this.errorSelect.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
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
                        <div className={this.errorDocumentoInvitado.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'}>
                            <label for="NumeroDocumento"> Numero de Documento Invitado </label>
                            <input type="document" className={this.errorDocumentoInvitado.error ? 'form-control is-invalid ' : 'form-control'}
                                     placeholder="Document number"
                                   value={this.state.documentoInvitado}
                                   onChange={this.ChangeDocumentoInvitado}
                            />
                            <div className="invalid-feedback">{this.errorDocumentoInvitado.mensaje}</div>
                        </div>
                        <div className={this.errorNacimiento.error ? 'col-md-6 form-group has-feedback has-danger' : 'col-md-6 form-group has-feedback'} hidden={this.esPropietario}>
                            <label for="FechaNacimiento"> Fecha de Nacimiento </label>
                            <input type="date" className={this.errorNacimiento.error ? 'form-control is-invalid ' : 'form-control'}
                                     name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                            <div className="invalid-feedback">{this.errorNacimiento.mensaje}</div>
                        </div>
                    </div>
                </div>
                <div hidden={!(this.state.resultado == 1)} className="alert alert-success" role="alert">
                    <strong>Se ha creado con exito</strong>
                </div>
                <div hidden={!(this.state.resultado == 2)} className="alert alert-danger" role="alert">
                    <strong>Hay errores en el formulario!</strong>
                </div>

                <div className="form-group izquierda">
                    <button type="button" className="btn btn-primary boton" variant="secondary"
                            onClick={this.props.cerrar}
                            hidden={!this.esPropietario}
                    >Volver
                    </button>
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