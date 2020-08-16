import React, { Component } from 'react';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { paginador } from '../Paginador';
import { Pagination } from 'react-bootstrap';
import { validator } from '../validator';
import Select from 'react-select';
import Datetime from 'react-datetime';
import { errorHTML } from '../Error';
import { style } from '../../variables/Variables';
import NotificationSystem from 'react-notification-system';
import { operacion } from '../Operaciones';
import CircularProgress from '@material-ui/core/CircularProgress';

class PrincipalReserva extends Component {
    constructor() {
        super();
        this.state = {
            reservas: [],
            reservasFiltradas: [],
            reservasPaginados: [],
            alert: null,
            numPagina: -1,
            reservaCancelar: [],
            nombre: '',
            servicio: '',
            serviciosLista: [],
            estado: null,
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            loading: false,
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        };
        this.notificationSystem = React.createRef();
        this.hideAlert = this.hideAlert.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = { error: false, mensaje: '' };
    }

    ChangeSelectEstado(value) {
        this.setState({ estado: value });
    }

    ChangeServicio(event) {
        this.setState({ servicio: event });
    }

    ChangeNombre(event) {
        this.setState({ nombre: event.target.value });
        this.errorNombre = validator.soloLetras(event.target.value);
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

    async componentDidMount() {
        const { serviciosLista } = this.state;
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Servicios')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    serviciosLista.push({ value: doc.id, label: doc.data().Nombre });
                });
            })
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({ serviciosLista });
    }

    async consultar(pagina, nueva) {
        let { reservas } = this.state;

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
                loading: true,
                primero: [],
                numPagina: -1,
            });
        }
        if (this.cantidad.length && (this.cantidad.length <= pagina || pagina < 0)) {
            return;
        }

        let con = await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Propietarios')
            .doc(localStorage.getItem('idPersona'))
            .collection('Reservas')
            .orderBy('FechaDesde', 'desc');

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
            con = con.where('FechaDesde', '>=', this.state.desde);
            total = total.where('FechaDesde', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('FechaDesde', '<=', this.state.hasta);
            total = total.where('FechaDesde', '<=', this.state.hasta);
        }
        if (this.state.servicio && this.state.servicio.label) {
            con = con.where('Servicio', '==', this.state.servicio.label);
            total = total.where('Servicio', '==', this.state.servicio.label);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
            total = total.where('Nombre', '==', this.state.nombre);
        }
        // if (this.state.estado && this.state.estado.value) {
        //     con = con.where('Estado', '==', this.state.estado.value);
        //     total = total.where('Estado', '==', this.state.estado.value);
        // }

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

        reservas = [];
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
                    reservas.push([doc.data(), doc.id]);
                });
            })
            .catch((error) => {
                console.log(error.message);
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        if ((pagina > this.state.numPagina || this.state.numPagina < 0) && !this.state.ultimo[pagina]) {
            this.state.ultimo.push(ultimo);
            this.state.primero.push(primero);
        }
        if (nueva) {
            this.cantidad = paginador.cantidad(this.total);
        }

        this.setState({ reservas, numPagina: pagina, loading: false });
    }

    reestablecer() {
        this.setState({
            reservas: [],
            alert: null,
            numPagina: -1,
            reservaCancelar: [],
            nombre: '',
            servicio: '',
            estado: null,
            desde: null,
            hasta: null,
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        });
        this.errorNombre = { error: false, mensaje: '' };
    }

    cancelar(res) {
        res[0].Cancelado = true;
        this.setState({
            reservaCancelar: res,
            alert: (
                <SweetAlert
                    warning
                    style={{ display: 'block', marginTop: '-100px', position: 'center' }}
                    title="¿Estás seguro?"
                    onConfirm={() => this.successDelete()}
                    onCancel={() => this.cancelDetele()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                    confirmBtnText="Sí, estoy seguro"
                    cancelBtnText="No, deseo volver atrás"
                    showCancel>
                    ¿Está seguro de que desea cancelar la reserva?
                </SweetAlert>
            ),
        });
    }

    async successDelete() {
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Servicios')
            .doc(this.state.reservaCancelar[0].IdServicio.id)
            .collection('Reservas')
            .doc(this.state.reservaCancelar[0].IdReservaServicio.id)
            .set(this.state.reservaCancelar[0])
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        await Database.collection('Country')
            .doc(localStorage.getItem('idCountry'))
            .collection('Propietarios')
            .doc(localStorage.getItem('idPersona'))
            .collection('Reservas')
            .doc(this.state.reservaCancelar[1])
            .set(this.state.reservaCancelar[0])
            .catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{ display: 'block', marginTop: '-100px', position: 'center' }}
                    title="Reserva cancelada"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info">
                    La reserva se canceló correctamente.
                </SweetAlert>
            ),
        });
    }

    cancelDetele() {
        this.setState({
            alert: (
                <SweetAlert
                    danger
                    style={{ display: 'block', marginTop: '-100px', position: 'center' }}
                    title="Operación cancelada"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info">
                    La reserva sigue vigente.
                </SweetAlert>
            ),
        });
    }

    hideAlert() {
        this.setState({
            alert: null,
        });
    }

    render() {
        return (
            <div className="col-12">
                <legend>
                    <h3 className="row">Mis Reservas</h3>
                </legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Filtros de búsqueda </h5>
                        <div className="row">
                            <div className="col-md-3 row-secction">
                                <label>Nombre</label>
                                <input
                                    className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                    value={this.state.nombre}
                                    onChange={this.ChangeNombre}
                                    placeholder="Nombre"
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-3 row-secction">
                                <label>Servicio</label>
                                <Select
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.serviciosLista}
                                    value={this.state.servicio}
                                    onChange={this.ChangeServicio.bind(this)}
                                />
                            </div>
                            {/*<div className="col-md-4 row-secction">*/}
                            {/*    <label>Estado</label>*/}
                            {/*    <Select*/}
                            {/*        isDisabled={false}*/}
                            {/*        isLoading={false}*/}
                            {/*        isClearable={true}*/}
                            {/*        isSearchable={true}*/}
                            {/*        value={this.state.estado}*/}
                            {/*        options={[{value: 1, label: 'Pendiente'}, {value: 0, label: 'En curso'},*/}
                            {/*            {value: 2, label: 'Realizado'}, {value: 3, label: 'Cancelado'}]}*/}
                            {/*        onChange={this.ChangeSelectEstado.bind(this)}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="col-md-3 row-secction">
                                <label>Fecha Desde</label>
                                <Datetime
                                    className={errorHTML.classNameErrorDate(this.state.errorDesde, '')}
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    inputProps={{ placeholder: 'Fecha Desde' }}
                                />
                                {errorHTML.errorLabel(this.state.errorDesde)}
                            </div>
                            <div className="col-md-3 row-secction">
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
                        wd
                        onClick={() => {
                            this.consultar(0, true);
                        }}>
                        Consultar
                    </Button>
                </div>
                {this.state.loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} >
                        <CircularProgress thickness="2" color={'white'} style={{ width: '120px', height: '120px' }} />
                    </div>) : (
                        <div>
                            <div className="card row" hidden={!this.state.reservas.length}>
                                <h4 className="row">Reservas ({this.total})</h4>
                                <div className="card-body">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Índice
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Nombre
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Servicio
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Estado
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Día
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Hora desde
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Hora hasta
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Visualizar
                                    </th>
                                                <th style={{ textAlign: 'center' }} scope="col">
                                                    Cancelar
                                    </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.reservas.map((res, ind) => {
                                                let desde = new Date(res[0].FechaDesde.seconds * 1000);
                                                let hasta = new Date(res[0].FechaHasta.seconds * 1000);
                                                let editar = '/propietario/visualizarReserva/' + res[1];
                                                let estado = validator.estadoReserva(desde, hasta, res[0].Cancelado);
                                                return (
                                                    <tr className="table-light">
                                                        <th style={{ textAlign: 'center' }} scope="row">
                                                            {ind + 1 + paginador.getTamPagina() * this.state.numPagina}
                                                        </th>
                                                        <th style={{ textAlign: 'center' }} scope="row">
                                                            {res[0].Nombre}
                                                        </th>
                                                        <th style={{ textAlign: 'center' }} scope="row">
                                                            {res[0].Servicio}
                                                        </th>
                                                        <td style={{ textAlign: 'center' }}>{estado.Nombre}</td>
                                                        <td style={{ textAlign: 'center' }}>{desde.toLocaleDateString()}</td>
                                                        <td style={{ textAlign: 'center' }}>{desde.toLocaleTimeString()}</td>
                                                        <td style={{ textAlign: 'center' }}>{hasta.toLocaleTimeString()}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <Link to={editar}>
                                                                <Button bsStyle="info" fill wd>
                                                                    Visualizar
                                                    </Button>
                                                            </Link>
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <Button
                                                                bsStyle="warning"
                                                                fill
                                                                wd
                                                                disabled={estado.Id != 0}
                                                                onClick={() => {
                                                                    this.cancelar(res);
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
                            <div className="text-center" hidden={!this.state.reservas.length}>
                                <Pagination className="pagination-no-border">
                                    <Pagination.First onClick={() => this.consultar(this.state.numPagina - 1, false)} />

                                    {this.cantidad.map((num) => {
                                        return <Pagination.Item active={num == this.state.numPagina}>{num + 1}</Pagination.Item>;
                                    })}

                                    <Pagination.Last onClick={() => this.consultar(this.state.numPagina + 1, false)} />
                                </Pagination>
                            </div>
                            <div className="row card" hidden={this.state.reservas.length}>
                                <div className="card-body">
                                    <h4 className="row">No se encontraron resultados.</h4>
                                </div>
                            </div>
                        </div>)}
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
            </div>
        );
    }
}

export default PrincipalReserva;
