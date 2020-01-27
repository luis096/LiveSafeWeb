import React, { Component } from 'react';
import Select from 'react-select';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import Datetime from "react-datetime";
import { operacion } from '../Operaciones';


class EditarInvitado extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invitado: [],
            grupo: '',
            tipoDocumento: '',
            tipoD: [],
            desde: '',
            hasta: '',
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''}
        };
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
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
                invitado.push(doc.data(), doc.id);
            });

        this.setState({
            grupo: invitado[0].Grupo,
            desde: validator.obtenerFecha(invitado[0].FechaDesde),
            hasta: validator.obtenerFecha(invitado[0].FechaHasta),
            tipoDocumento: operacion.obtenerDocumentoLabel(invitado[0].TipoDocumento.id, this.state.tipoD)
        });

        this.setState({tipoD, invitado});
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

    ChangeGrupo(event) {
        this.setState({grupo: event.target.value});
    }

    async registrar() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Invitados').doc(this.idInvitado).update({
            Grupo: this.state.grupo,
            FechaDesde: this.state.desde,
            FechaHasta: this.state.hasta,
        });
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
                                <input className="form-control" placeholder="Nombre"
                                       value={this.state.invitado[0]?this.state.invitado[0].Nombre:'-'}
                                       disabled={true}
                                />
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Apellido </label>
                                <input className="form-control" placeholder="Apellido"
                                       value={this.state.invitado[0]?this.state.invitado[0].Apellido:'-'}
                                       disabled={true}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Tipo Documento </label>
                                <input className="form-control" placeholder="Apellido"
                                       value={this.state.tipoDocumento}
                                       disabled={true}/>
                            </div>
                            <div className="col-md-6 row-secction">
                                <label> Número de Documento </label>
                                <input type="document" className="form-control" placeholder="Número de Documento"
                                       value={this.state.invitado[0]?this.state.invitado[0].Documento:'-'}
                                       disabled={true}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label>Fecha de Nacimiento</label>
                                <Datetime
                                    timeFormat={false}
                                    value={validator.obtenerFecha(this.state.invitado[0]?this.state.invitado[0].FechaNacimiento:new Date())}
                                    inputProps={{placeholder: 'Fecha de Nacimiento', disabled: true}}
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