import React, { Component } from 'react';
import '../Style/Alta.css';
import '../Style/Estilo.css';
import { Database } from '../../config/config';
import Egresos from './Egresos';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { validator } from '../validator';
import { paginador } from '../Paginador';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Pagination } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { operacion } from '../Operaciones';
import { errorHTML } from '../Error';
import ReactExport from 'react-data-export';
import GeneradorExcel from '../Reportes/GeneradorExcel';
import { columns } from '../Reportes/Columns';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class PrincialEgreso extends Component {
    constructor() {
        super();
        this.state = {
            egresos: [],
            descargar: false,
            documento: '',
            apellido: '',
            tipoD: [],
            nombre: '',
            alert: null,
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        };
        this.notificationSystem = React.createRef();
        this.hideAlert = this.hideAlert.bind(this);
        this.descargar = this.descargar.bind(this);
        this.obtenerConsulta = this.obtenerConsulta.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorDocumento = { error: false, mensaje: '' };
    }

    async componentDidMount() {
        const { tipoD } = this.state;

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

        this.setState({ tipoD });
    }

    ChangeDocumento(event) {
        this.setState({ documento: event.target.value });
        this.errorDocumento = validator.numero(event.target.value);
    }

    ChangeNombre(event) {
        this.setState({ nombre: event.target.value });
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeApellido(event) {
        this.setState({ apellido: event.target.value });
        this.errorApellido = validator.soloLetras(event.target.value);
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

    async consultar(pagina, nueva) {
        let { egresos } = this.state;

        if (!validator.isValid([this.errorNombre, this.state.errorDesde, this.state.errorHasta])) {
            this.setState({
                alert: (
                    <SweetAlert
                        style={{ display: 'block', marginTop: '-100px', position: 'center' }}
                        title="Error"
                        onConfirm={() => this.hideAlert()}
                        onCancel={() => this.hideAlert()}
                        confirmBtnBsStyle="danger">
                        Hay errores en los filtros.
                    </SweetAlert>
                ),
            });
            return;
        }

        if (nueva) {
            this.setState({
                ultimo: [],
                primero: [],
                numPagina: -1,
            });
        }
        if (this.cantidad.length && (this.cantidad.length <= pagina || pagina < 0)) {
            return;
        }

        let con = this.obtenerConsulta(true);
        let total = this.obtenerConsulta(false);

        if (pagina > 0) {
            if (pagina > this.state.numPagina) {
                let ultimo = this.state.ultimo[this.state.numPagina];
                con = con.startAfter(ultimo);
            } else {
                let primero = this.state.primero[pagina];
                con = con.startAt(primero);
            }
        }

        if (nueva) {
            await total
                .get()
                .then((doc) => {
                    this.total = doc.docs.length;
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
        }

        egresos = [];
        let ultimo = null;
        let primero = null;
        await con
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (!primero) {
                        primero = doc;
                    }
                    ultimo = doc;
                    egresos.push([doc.data(), doc.id]);
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        if ((pagina > this.state.numPagina || this.state.numPagina < 0) && !this.state.ultimo[pagina]) {
            this.state.ultimo.push(ultimo);
            this.state.primero.push(primero);
        }
        if (nueva) {
            this.cantidad = paginador.cantidad(this.total);
        }

        this.setState({ egresos, numPagina: pagina });
    }

    descargar() {
        let columnas = columns.INGRESOS;
        let elementos = [];

        if (this.state.descargar) {
            let con = this.obtenerConsulta(false);
            let datos = {};
            con.get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        datos = doc.data();
                        datos.Hora = validator.obtenerFecha(doc.data().Hora).toLocaleString();
                        datos.TipoDocumento = operacion.obtenerDocumentoLabel(datos.TipoDocumento.id, this.state.tipoD);
                        datos.Tipo = datos.IdPropietario ? 'Invitado' : 'Propietario';
                        elementos.push(datos);
                    });
                })
                .catch((error) => {
                    this.notificationSystem.current.addNotification(operacion.error(error.message));
                });
            return (
                <GeneradorExcel
                    elementos={elementos}
                    estructura={columnas}
                    pagina={'Ingresos'}
                    ocultar={() => this.setState({ descargar: false })}
                />
            );
        }
    }

    obtenerConsulta(conLimite) {
        let con = Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Egresos');
        if (conLimite) {
            con = con.limit(paginador.getTamPagina());
        }

        if (this.state.desde) {
            con = con.where('Hora', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('Hora', '<=', this.state.hasta);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
        }
        if (this.state.apellido) {
            con = con.where('Apellido', '==', this.state.apellido);
        }
        if (this.state.documento) {
            con = con.where('Documento', '==', this.state.documento);
        }

        return con;
    }

    hideAlert() {
        this.setState({
            alert: null,
        });
    }

    reestablecer() {
        this.setState({
            egresos: [],
            documento: '',
            apellido: '',
            nombre: '',
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        });
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorDocumento = { error: false, mensaje: '' };
    }

    render() {
        return (
            <div className="col-12">
                <legend>
                    <h3 className="row">Egresos</h3>
                </legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Filtros de búsqueda </h5>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label>Nombre</label>
                                <input
                                    className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                    value={this.state.nombre}
                                    onChange={this.ChangeNombre}
                                    placeholder="Nombre"
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Apellido</label>
                                <input
                                    className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                    value={this.state.apellido}
                                    onChange={this.ChangeApellido}
                                    placeholder="Apellido"
                                />
                                {errorHTML.errorLabel(this.errorApellido)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Número de Documento</label>
                                <input
                                    className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                    value={this.state.documento}
                                    onChange={this.ChangeDocumento}
                                    placeholder="Nro. de Documento"
                                />
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
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
                            <div className="col-md-4 row-secction">
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
                    </div>
                </div>

                <div className="izquierda">
                    <Button
                        bsStyle="default"
                        style={{ marginRight: '10px' }}
                        fill
                        wd
                        onClick={() => {
                            this.reestablecer();
                        }}>
                        Restablecer
                    </Button>
                    <Button
                        bsStyle="primary"
                        fill
                        wd
                        onClick={() => {
                            this.consultar(0, true);
                        }}>
                        Consultar
                    </Button>
                </div>
                {this.descargar()}
                <div className="card row" hidden={!this.state.egresos.length}>
                    <div className="row">
                        <div className="col-md-6 title row-secction">
                            <h4 style={{ margin: '0px' }}>Egresos ({this.total})</h4>
                        </div>
                        <div className="col-md-6 row-secction btnDescarga">
                            <Button
                                bsStyle="success"
                                fill
                                onClick={() => {
                                    this.setState({ descargar: true });
                                }}>
                                Descargar
                            </Button>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Índice
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Nombre y Apellido
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Tipo Documento
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Documento
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Fecha y Hora
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Observación
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Cancelar
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.egresos.map((egr, ind) => {
                                    let hora = validator.obtenerFecha(egr[0].Hora);

                                    return (
                                        <tr className="table-light">
                                            <th style={{ textAlign: 'center' }} scope="row">
                                                {ind + 1 + paginador.getTamPagina() * this.state.numPagina}
                                            </th>
                                            <td style={{ textAlign: 'center' }} scope="row">
                                                {egr[0].Nombre} {egr[0].Apellido}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {operacion.obtenerDocumentoLabel(egr[0].TipoDocumento.id, this.state.tipoD)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{egr[0].Documento}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                {hora.toLocaleDateString() + ' - ' + hora.toLocaleTimeString()}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{egr[0].Observacion ? 'Si' : 'No'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Button
                                                    bsStyle="warning"
                                                    fill
                                                    wd
                                                    onClick={() => {
                                                        console.log('cancelar');
                                                    }}>
                                                    Cancelar
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center" hidden={!this.state.egresos.length}>
                    <Pagination className="pagination-no-border">
                        <Pagination.First onClick={() => this.consultar(this.state.numPagina - 1, false)} />

                        {this.cantidad.map((num) => {
                            return <Pagination.Item active={num == this.state.numPagina}>{num + 1}</Pagination.Item>;
                        })}

                        <Pagination.Last onClick={() => this.consultar(this.state.numPagina + 1, false)} />
                    </Pagination>
                </div>
                <div className="row card" hidden={this.state.egresos.length}>
                    <div className="card-body">
                        <h4 className="row">No se encontraron resultados.</h4>
                    </div>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
            </div>
        );
    }
}

export default PrincialEgreso;
