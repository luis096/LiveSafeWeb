import React, { Component } from 'react';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import { paginador } from '../Paginador';
import { errorHTML } from '../Error';
import { validator } from '../validator';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Pagination } from 'react-bootstrap';
import Button from 'components/CustomButton/CustomButton.jsx';
import Select from 'react-select';
import Datetime from 'react-datetime';
import { operacion } from '../Operaciones';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';
import CircularProgress from '@material-ui/core/CircularProgress';

class PrincipalAdministrador extends Component {
    constructor() {
        super();
        this.state = {
            administradores: [],
            barriosSelect: [],
            tipoD: [],
            barrio: '',
            alert: null,
            numPagina: -1,
            nombre: '',
            apellido: '',
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            loading: false,
            administradoresTodos: [],
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        };
        this.notificationSystem = React.createRef();
        this.hideAlert = this.hideAlert.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.consultar = this.consultar.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
        this.errorNumero = { error: false, mensaje: '' };
        this.errorCelular = { error: false, mensaje: '' };
    }

    async componentDidMount() {
        const { tipoD, barriosSelect, administradoresTodos } = this.state;
        await Database.collectionGroup('Administradores')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let id = doc.ref.path.toString().split('/');
                    let idCountry = id[1];
                    administradoresTodos.push([doc.data(), doc.id, idCountry]);
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
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
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    barriosSelect.push({ value: doc.id, label: doc.data().Nombre });
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({ tipoD, barriosSelect, administradoresTodos});
    }

    ChangeBarrio(value) {
        this.setState({ barrio: value });
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
        let { administradores } = this.state;

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
                loading: true,
            });
        }
        if (this.cantidad.length && (this.cantidad.length <= pagina || pagina < 0)) {
            return;
        }

        let con = await Database.collectionGroup('Administradores');

        let total = con;

        if (pagina > 0) {
            if (pagina > this.state.numPagina) {
                let ultimo = this.state.ultimo[this.state.numPagina];
                con = con.startAfter(ultimo);
            } else {
                let primero = this.state.primero[pagina];
                con = con.startAt(primero);
            }
        }

        con = con.limit(paginador.getTamPagina());

        if (this.state.desde) {
            con = con.where('FechaAlta', '>=', this.state.desde);
            total = total.where('FechaAlta', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('FechaAlta', '<=', this.state.hasta);
            total = total.where('FechaAlta', '<=', this.state.hasta);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
            total = total.where('Nombre', '==', this.state.nombre);
        }
        if (this.state.apellido) {
            con = con.where('Apellido', '==', this.state.apellido);
            total = total.where('Apellido', '==', this.state.apellido);
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

        administradores = [];
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
                    administradores.push([doc.data(), doc.id]);
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

        this.setState({ administradores, numPagina: pagina,  loading: false });
    }

    async consultarNoPaginado(pagina) {
        const {administradoresTodos, numPagina} = this.state;
        if ((administradoresTodos.length / 10) < pagina || pagina < 0) return;

        this.setState({loading: true});
        let result = administradoresTodos.slice(pagina*10, (pagina*10 + 10));

        if (this.state.desde) {
            result = result.filter(x => { return (validator.obtenerFecha(x[0].FechaAlta) >= new Date(this.state.desde)) });
        }
        if (this.state.hasta) {
            result = result.filter(x => { return validator.obtenerFecha(x[0].FechaAlta) <= new Date(this.state.hasta) });
        }
        if (this.state.nombre) {
            result = result.filter(x => { return x[0].Nombre.toUpperCase() === this.state.nombre.toUpperCase() });
        }
        if (this.state.apellido) {
            result = result.filter(x => { return x[0].Apellido.toUpperCase() === this.state.apellido.toUpperCase() });
        }
        if (this.state.tipoDocumento && this.state.tipoDocumento.value) {
            let tipoDocumentoRef = operacion.obtenerReferenciaDocumento(this.state.tipoDocumento);
            result = result.filter(x => { return x[0].TipoDocumento === tipoDocumentoRef });
        }
        if (this.state.barrio && this.state.barrio.value) {
            result = result.filter(x => { return x[2] === this.state.barrio.value.toString() });
        }

        result = result.sort(function (a, b) {
            if (validator.obtenerFecha(a[0].FechaAlta) < validator.obtenerFecha(b[0].FechaAlta)) {
                return 1;
            }
            if (validator.obtenerFecha(a[0].FechaAlta) > validator.obtenerFecha(b[0].FechaAlta)) {
                return -1;
            }
            return 0;
        });

        this.total = result.length;
        this.cantidad = paginador.cantidad(this.total);

        await setTimeout(() => {
            this.setState({administradores: result, numPagina: pagina, loading: false})
        }, 1000);

    }

    reestablecer() {
        this.setState({
            administradores: [],
            numPagina: -1,
            nombre: '',
            apellido: '',
            desde: null,
            hasta: null,
            barrio: null,
            ultimo: [],
            primero: [],
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        });
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = { error: false, mensaje: '' };
        this.errorApellido = { error: false, mensaje: '' };
    }

    hideAlert() {
        this.setState({
            alert: null,
        });
    }

    render() {
        return (
            <div className="col-12 ">
                <legend>
                    <h3 className="row">Administradores</h3>
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
                                <label>Country</label>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    value={this.state.barrio}
                                    options={this.state.barriosSelect}
                                    onChange={this.ChangeBarrio.bind(this)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label>Fecha Desde</label>
                                <Datetime
                                    className={errorHTML.classNameErrorDate(this.state.errorDesde, '')}
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    inputProps={{ placeholder: 'Fecha Desde' }}
                                />
                                {errorHTML.errorLabel(this.state.errorDesde)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Fecha Hasta</label>
                                <Datetime
                                    className={errorHTML.classNameErrorDate(this.state.errorHasta, '')}
                                    value={this.state.hasta}
                                    onChange={this.ChangeHasta}
                                    inputProps={{ placeholder: 'Fecha Hasta' }}
                                />
                                {errorHTML.errorLabel(this.state.errorHasta)}
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
                        w
                        onClick={() => {
                            this.consultarNoPaginado(0);
                        }}>
                        Consultar
                    </Button>
                </div>

                { this.state.loading ? (
                    <div style={{display:'flex', justifyContent:'center', marginTop:'100px'}} >
                            <CircularProgress thickness="2" color={'white'} style={{width:'120px', height:'120px'}} />
                    </div> ) : (
                <div>
                <div className="card row" hidden={!this.state.administradores.length}>
                    <h4 className="row ">Administradores ({this.total})</h4>
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
                                        Country
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Celular
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Fecha Alta
                                    </th>
                                    <th style={{ textAlign: 'center' }} scope="col">
                                        Editar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.administradores.map((adm, ind) => {
                                    let editar = '/root/editarAdministrador/' + adm[1];
                                    let countryName = this.state.barriosSelect.find(x => { return adm[2].toString() === x.value.toString()});
                                    let alta = validator.obtenerFecha(adm[0].FechaAlta);
                                    let tipoDocLabel = operacion.obtenerDocumentoLabel(adm[0].TipoDocumento.id, this.state.tipoD);
                                    return (
                                        <tr className="table-light">
                                            <th style={{ textAlign: 'center' }} scope="row">
                                                {ind + 1 + paginador.getTamPagina() * this.state.numPagina}
                                            </th>
                                            <td style={{ textAlign: 'center' }}>
                                                {adm[0].Nombre} {adm[0].Apellido}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{tipoDocLabel}</td>
                                            <td style={{ textAlign: 'center' }}>{adm[0].Documento}</td>
                                            <td style={{ textAlign: 'center' }}>{countryName.label}</td>
                                            <td style={{ textAlign: 'center' }}>{adm[0].Celular}</td>
                                            <td style={{ textAlign: 'center' }}>{alta.toLocaleString()}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Link to={editar}>
                                                    <Button bsStyle="warning" fill wd>
                                                        Editar
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div> )}
                <div className="text-center" hidden={!this.state.administradores.length || this.state.loading}>
                    <Pagination className="pagination-no-border">
                        <Pagination.First onClick={() => this.consultarNoPaginado(this.state.numPagina - 1)} />

                        {this.cantidad.map((num) => {
                            return <Pagination.Item active={num === this.state.numPagina}>{num + 1}</Pagination.Item>;
                        })}

                        <Pagination.Last onClick={() => this.consultarNoPaginado(this.state.numPagina + 1)} />
                    </Pagination>
                </div>
                <div className="row card" hidden={this.state.administradores.length || this.state.loading}>
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

export default PrincipalAdministrador;
