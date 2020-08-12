import React, { Component } from 'react';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import Datetime from 'react-datetime';
import Switch from 'react-bootstrap-switch';
import { validator } from '../validator';
import { errorHTML } from '../Error';
import Select from "react-select";
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";
import { operacion } from "../Operaciones";
import { Col, Grid, Row } from "react-bootstrap";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Card from 'components/Card/Card.jsx';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');
const localizer = momentLocalizer(moment);


class EditarServicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            servicio: [],
            events: [],
            nombre: '',
            estado: true,
            descripcion: '',
            horaDesde: new Date(2020, 0, 1, 8, 0),
            horaHasta: new Date(2020, 0, 1, 18, 0),
            min: new Date(2019, 0, 1, 0, 0),
            max: new Date(2019, 0, 1, 23, 0),
            dias: null,
            turnosMax: null,
            turnoSelect: [],
            turnosMaxSelect: [],
            duracionTurno: null,
        };
        this.notificationSystem = React.createRef();
        this.editServicio = this.editServicio.bind(this);
        this.registrar = this.registrar.bind(this);
        const url = this.props.location.pathname.split('/');
        this.idServicio = url[url.length - 1];

        this.errorNombre = { error: false, mensaje: '' };
    }

    async componentDidMount() {
        let turnos = [];
        await Database.collection('Turnos').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                turnos.push(
                    { value: doc.data().Duracion, label: doc.data().DuracionString }
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });

        turnos = turnos.sort(function (a, b) {
            if (a.value > b.value) return 1;
            if (a.value < b.value) return -1;
            return 0;
        });

        this.setState({ turnoSelect: turnos })

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.idServicio).get().then(doc => {
                if (doc.exists) {
                    this.setState({
                        nombre: doc.data().Nombre,
                        estado: doc.data().Estado,
                        dias: doc.data().Disponibilidad,
                        horaDesde: validator.obtenerFecha(doc.data().HoraInicio),
                        horaHasta: validator.obtenerFecha(doc.data().HoraFin),
                        duracionTurno: doc.data().DuracionTurno,
                        turnosMax: doc.data().TurnosMax
                    });
                }
            });

        let newEvents = [];

        let diaNumber = new Date().getDay();
        if (diaNumber === 0) diaNumber = 7;
        let fecha = new Date().getDate();
        let mes = new Date().getMonth();
        let anio = new Date().getFullYear();

        this.state.dias.forEach(dia => {
            let horario = dia.horarios;
            horario.forEach(value => {

                let diaOficial = 0;
                let start = validator.obtenerFecha(value.desde);
                let end = validator.obtenerFecha(value.hasta);
                start.getDay() === 0 ? diaOficial = 7 : diaOficial = start.getDay();
                let nuevoHorario = {
                    title: "Reserva",
                    color: "blue",
                    start: new Date(anio, mes, (fecha + (diaOficial - diaNumber)), start.getHours(), start.getMinutes()),
                    end: new Date(anio, mes, (fecha + (diaOficial - diaNumber)), end.getHours(), end.getMinutes()),
                };
                newEvents.push(nuevoHorario);
            });
        });

        this.setState({ events: newEvents });

        let hasta = 0;
        let desde = 24;

        let horarios = this.state.dias;

        this.state.events.forEach(event => {
            let dia = event.start.getDay();
            if (dia === 0) dia = 7;
            let id = horarios[dia - 1].horarios.length + 1;
            horarios[dia - 1].horarios.push({ desde: event.start, hasta: event.end, id: id });

            if (event.start.getHours() < desde) desde = event.start.getHours();
            if (event.end.getHours() > hasta) hasta = event.end.getHours();
        });

        this.setState({
            min: new Date(2020, 0, 1, desde, 0),
            max: new Date(2020, 0, 1, hasta, 0),
        });

        await this.actualizarHorasMax();
    }

    async actualizarHorasMax() {
        await this.setState({ turnosMaxSelect: [] });
        if (!this.state.duracionTurno) return;
        let cantidad = 24 / (this.state.duracionTurno / 60);
        for (var i = 1; i <= cantidad; i++) {
            this.state.turnosMaxSelect.push({ value: i, label: i.toString() });
            if (i === this.state.turnosMax) {
                this.setState({ turnosMax: { value: i, label: i.toString() } })
            }
        }
    }

    async editServicio() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.idServicio).update({
                Estado: this.state.estado,
                TurnosMax: this.state.turnosMax.value
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

    }

    ChangeEstado() {
        let { estado } = this.state;
        estado = !estado;
        this.setState({ estado });
    }

    ChangeSelectTurnosMax(value) {
        this.setState({ turnosMax: value });
    }

    registrar() {
        this.editServicio();
    }

    render() {

        return (
            <div className="col-12">
                <legend><h3 className="row">Editar Servicio</h3></legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="row-secction col-md-3">
                                <label> Nombre </label>
                                <input type="name" className={errorHTML.classNameError(this.errorNombre, 'form-control')} placeholder="Nombre"
                                    value={this.state.nombre} readOnly
                                />
                            </div>
                            <div className="row-secction col-md-2">
                                <label>Disponibilidad del servicio</label>
                                <div>
                                    <Switch onText="Si" offText="No"
                                        value={this.state.estado}
                                        onChange={() => {
                                            this.ChangeEstado();
                                        }} />
                                </div>
                            </div>
                            <div className="row-secction col-md-3">
                                <label>Duración del turno</label>
                                <input className='form-control' readOnly
                                    value={(this.state.duracionTurno / 60) >= 1 ? (this.state.duracionTurno / 60) + ' Hs.' :
                                        (this.state.duracionTurno) + ' Min.'}
                                />
                            </div>
                            <div className="row-secction col-md-3">
                                <label>Cantidad máxima de turnos</label>
                                <Select
                                    isClearable={true}
                                    value={this.state.turnosMax}
                                    options={this.state.turnosMaxSelect}
                                    onChange={this.ChangeSelectTurnosMax.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Grid fluid>
                            <Row>
                                <Col md={12}>
                                    <Calendar
                                        selectable
                                        step={this.state.duracionTurno ? this.state.duracionTurno : 60}
                                        min={this.state.min}
                                        max={this.state.max}
                                        localizer={localizer}
                                        events={this.state.events}
                                        defaultDate={new Date()}
                                        defaultView="week"
                                        views={['week']}
                                        popup={true}
                                        toolbar={false}
                                    />
                                </Col>
                            </Row>
                        </Grid>
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
                {this.state.alert}
            </div>
        );
    }
}

export default EditarServicio;
