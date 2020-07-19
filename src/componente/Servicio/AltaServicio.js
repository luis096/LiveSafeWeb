import React, { Component } from 'react';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import Datetime from 'react-datetime';
import Switch from 'react-bootstrap-switch';
import { errorHTML } from '../Error';
import { validator } from '../validator';
import Select from "react-select";
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";
import {operacion} from "../Operaciones";
import {Col, Grid, Row} from "react-bootstrap";
import Disponibilidad from "../Reserva/Disponibilidad";
import {Calendar, momentLocalizer} from "react-big-calendar";
import Card from 'components/Card/Card.jsx';
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";

import {  Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

const DragAndDropCalendar = withDragAndDrop(Calendar)

moment.locale('es');
const localizer = momentLocalizer(moment);


class AltaServicio extends Component {

    constructor() {
        super();
        this.state = {
            nombre: '',
            estado: true,
            descripcion: '',
            horaDesde: new Date(2020, 0, 1, 8, 0),
            horaHasta: new Date(2020, 0, 1, 18, 0),
            dias: [false, false, false, false, false, false, false],
            turnosMax: null,
            turnoSelect:[],
            turnosMaxSelect:[],
            verCalendar: false,
            min: new Date(2019, 0, 1, 8, 0),
            max: new Date(2019, 0, 1, 18, 0),
            alert: null,
            events: [],
            duracionTurno: null,
            displayDragItemInCell: true,
            newIdEvent: 1
        };
        this.notificationSystem = React.createRef();
        this.addServicio = this.addServicio.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeSelectTurnosMax = this.ChangeSelectTurnosMax.bind(this);
        this.ChangeSelectTurno = this.ChangeSelectTurno.bind(this);
        this.registrar = this.registrar.bind(this);
        this.reestaurar = this.reestaurar.bind(this);

        this.moveEvent = this.moveEvent.bind(this);
        this.newEvent = this.newEvent.bind(this);
        this.delete = this.delete.bind(this);
        this.errorNombre = {error: false, mensaje: ''};
        this.errorHoraDesde = {error: false, mensaje: ''};
        this.errorHoraHasta = {error: false, mensaje: ''};

    }

    async componentDidMount() {
        this.actualizarHorasMax()
        await Database.collection('Turnos').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.turnoSelect.push(
                    {value: doc.data().Duracion, label: doc.data().DuracionString}
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
    }

    async actualizarHorasMax() {
        // let cantidadHs = new Date(this.state.horaHasta).getHours() - new Date(this.state.horaDesde).getHours();
        // let cantidadMin = new Date(this.state.horaHasta).getMinutes() - new Date(this.state.horaDesde).getMinutes();
        //
        // if (cantidadHs < 1 || !this.state.duracionTurno) return;
        //
        // let max = (cantidadHs / this.state.duracionTurno.value);
        // if (cantidadMin >= (this.state.duracionTurno.value * 60)) { max++ }
        await this.setState({turnosMaxSelect: []});
         for(var i = 1; i <= 24; i++) {
            this.state.turnosMaxSelect.push({value: i, label:i.toString()});
        }
    }

    async addServicio() {
        let horarios = [];
        for(var i = 0; i < 7; i++) {
            horarios.push({horarios: []});
        }

        this.state.events.sort(function (a, b) {
            if (a.start > b.start) {
                return 1;
            }
            if (a.start < b.start) {
                return -1;
            }

            return 0;
        })

        this.state.events.forEach(event => {
            let dia = event.start.getDay();
            let id = horarios[dia - 1].horarios.length + 1;
            if (dia == 0) dia = 7;
            horarios[dia - 1].horarios.push({desde: event.start, hasta: event.end, id: id})
        })

        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Servicios').add({
            Nombre: this.state.nombre,
            Estado: this.state.estado,
            Disponibilidad: horarios,
            // HoraInicio: this.redondear(new Date(this.state.horaDesde)),
            // HoraFin: this.redondear(new Date(this.state.horaHasta)),
            // Descripcion: this.state.descripcion,
            TurnosMax: this.state.turnosMax.value,
            DuracionTurno: (this.state.duracionTurno.value * 60)
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        if (event.target.value == "")
        {this.errorNombre= validator.requerido(event.target.value)}
        else{this.errorNombre =validator.soloLetras(event.target.value)}
    }

    async ChangeDesde(event) {
        await this.setState({horaDesde: event});
        await this.setState({duracionTurno: null, turnosMax: null});
        await this.actualizarHorasMax();
    }

    async ChangeHasta(event) {
        await this.setState({horaHasta: event});
        await this.setState({duracionTurno: null, turnosMax: null});
        await this.actualizarHorasMax();
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    ChangeEstado() {
        let {estado} = this.state;
        estado = !estado;
        this.setState({estado});
    }

    ChangeSelectTurnosMax(value) {
        this.setState({turnosMax: value});
    }

    async ChangeSelectTurno(value) {
        await this.setState({events: [], verCalendar: false});
        await this.setState({duracionTurno: value});
    }

    registrar() {
        this.addServicio();
        // this.reestaurar();
    }

    redondear(date) {
        let minutos = date.getMinutes();
        let hora = date.getHours();
        if (minutos != 0 || minutos != 30) {
            if (minutos > 30) {
                date.setHours((hora + 1), 0);
            } else {
                date.setMinutes(0);
            }
        }
        return date;
    }

    ChangeDia(num) {
        let {dias} = this.state;
        dias[num] = !dias[num];
        this.setState(dias);
    }

    reestaurar() {
        this.setState({
            nombre: '',
            estado: true,
            descripcion: '',
            horasMax: null,
            minMax: null
        });
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
        const { events } = this.state;
        const slotInfo = { start: start, end: end, id: event.id };
        if (!this.validarHorario(slotInfo)) return;

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id == event.id
                ? { ...existingEvent, start, end }
                : existingEvent
        });

        this.setState({
            events: nextEvents
        })
    };

    resizeEvent = ({ event, start, end }) => {
        const { events } = this.state;
        const slotInfo = { start: start, end: end, id: event.id };
        if (!this.validarHorario(slotInfo)) return;

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent
        });

        this.setState({
            events: nextEvents,
        })
    };

    newEvent(slotInfo) {
        let newEvents = this.state.events;

        if (slotInfo.start.getHours() == slotInfo.end.getHours() &&
            slotInfo.start.getMinutes() == slotInfo.end.getMinutes()) {
            return;
        }

        if (!this.validarHorario(slotInfo)) return;

        let newId = this.state.newIdEvent;
        let nuevoHorario = {
          id: newId,
          title: 'Reserva',
          start: slotInfo.start,
          end: slotInfo.end,
        };
        newEvents.push(nuevoHorario);
        this.setState({
            events: newEvents,
            newIdEvent: this.state.newIdEvent + 1
        });
    }

    validarHorario(slotInfo){
        let isValid = true;
        this.state.events.map((evento)=> {
            if (evento.start.getDay() == slotInfo.start.getDay() && evento.id != slotInfo.id) {
                if ((evento.start <= slotInfo.start && evento.end > slotInfo.start) ||
                    (evento.start < slotInfo.end && evento.end >= slotInfo.end) ||
                    (evento.start > slotInfo.start && evento.end < slotInfo.end)) {
                    this.notificationSystem.current.addNotification(operacion.error("Rango horario inválido"));
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    delete(slotInfo) {
        let newEvents = this.state.events;
        let deleted = newEvents.filter(x => x.id !== slotInfo.id);
        this.setState({
            events: deleted
        });
    }


    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Nuevo Servicio</h3></legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="row-secction col-md-3">
                                    <label> Nombre </label>
                                    <input type="name" className={ errorHTML.classNameError(this.errorNombre, 'form-control') } placeholder="Nombre"
                                        value={this.state.nombre}
                                        onChange={this.ChangeNombre}
                                    />
                                    {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="row-secction col-md-2">
                                <label>Disponibilidad del servicio</label>
                                <div>
                                    <Switch onText="Si" offText="No"
                                            value={this.state.estado}
                                            onChange={()=> {
                                                this.ChangeEstado();
                                            }}/>
                                </div>
                            </div>
                            <div className="row-secction col-md-3">
                                <label>Duración de turno</label>
                                <Select
                                    isClearable={true}
                                    value={this.state.duracionTurno}
                                    options={this.state.turnoSelect}
                                    onChange={this.ChangeSelectTurno.bind(this)}
                                />
                            </div>
                            <div className="row-secction col-md-3">
                                <label>Turnos Maximos de Reserva</label>
                                <Select
                                    isClearable={true}
                                    value={this.state.turnosMax}
                                    options={this.state.turnosMaxSelect}
                                    onChange={this.ChangeSelectTurnosMax.bind(this)}
                                />
                            </div>
                            <div className="row-secction col-md-1">
                                <br/>
                                <Button bsStyle="warning" fill
                                        disabled={!this.state.duracionTurno}
                                        onClick={() => this.setState({verCalendar: true})}>
                                    Ver
                                </Button>
                            </div>
                        </div>
                        {/*<div className="row">*/}
                        {/*    <label> Descripcion </ label>*/}
                        {/*    <textarea className="form-control" rows="3" placeholder="Descripcion del servicio"*/}
                        {/*              value={this.state.descripcion}*/}
                        {/*              onChange={this.ChangeDescripcion}> </textarea>*/}
                        {/*</div>*/}
                    </div>
                    <div hidden={!this.state.verCalendar}>
                        <Grid fluid>
                            <Row>
                                <Col md={12}>
                                    <Card
                                        calendar
                                        content={
                                            <DragAndDropCalendar
                                                selectable
                                                step={this.state.duracionTurno?this.state.duracionTurno.value * 60:30}
                                                localizer={localizer}
                                                events={this.state.events}
                                                onEventDrop={this.moveEvent}
                                                resizable
                                                onEventResize={this.resizeEvent}
                                                onSelectSlot={this.newEvent} // Agrego evento
                                                onDoubleClickEvent={this.delete}
                                                // onDragStart={console.log}
                                                defaultView={Views.WEEK}
                                                defaultDate={new Date()}
                                                popup={true}
                                                toolbar={false}
                                                // dragFromOutsideItem={
                                                //     this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
                                                // }
                                                // onDropFromOutside={this.onDropFromOutside}
                                                // handleDragStart={this.handleDragStart}

                                                views={['week']}
                                            />
                                        }
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
                <div hidden={!this.state.verCalendar} className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>
                        Registrar
                    </Button>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
                {this.state.alert}
            </div>
        );
    }
}

export default AltaServicio;
