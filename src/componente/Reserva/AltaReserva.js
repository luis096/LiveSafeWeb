import React, { Component } from 'react';
import { Database } from '../../config/config';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Grid, Row, Col } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import SweetAlert from 'react-bootstrap-sweetalert';
import Card from 'components/Card/Card.jsx';
import { validator } from '../validator';
import Disponibilidad from "./Disponibilidad";
import {operacion} from "../Operaciones";

moment.locale('es');
const localizer = momentLocalizer(moment);

class AltaReserva extends Component {

    constructor() {
        super();
        this.state = {
            reservaLista: [],
            servicioSeleccionado: {},
            events: [],
            consulta: false,
            alert: null,
            min: new Date(2019, 0, 1, 8, 0),
            max: new Date(2019, 0, 1, 18, 0),
            dias: []
        };
        this.addReserva = this.addReserva.bind(this);
        this.consultar = this.consultar.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.hideAlert = this.hideAlert.bind(this);

    }


    async componentDidMount() {
        const {reservaLista} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    reservaLista.push(
                        {value: doc.id, label: doc.data().Nombre}
                    );
                });
            });
        this.setState({reservaLista});
    }

    async addReserva(datos) {
        //Se guarda en coleccion Servicios y en el Propietario que hace la reserva.
        let id = 0;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.state.servicioSeleccionado.value)
            .collection('Reservas').add(datos).then(doc=> {
                id = doc.id;
            });
        datos.IdReservaServicio = Database.doc('Country/' + localStorage.getItem('idCountry') +
            '/Servicios/' + this.state.servicioSeleccionado.value + '/Reservas/' + id);
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(localStorage.getItem('idPersona'))
            .collection('Reservas').add(datos);
    }

    async consultar() {
        if (!(this.state.servicioSeleccionado && this.state.servicioSeleccionado.value)) {
            this.setState({
                alert: (
                    <SweetAlert
                        style={{display: 'block', marginTop: '-100px', position: 'center'}}
                        title="No se puede realizar la consulta"
                        onConfirm={()=>this.hideAlert()}
                        onCancel={()=>this.hideAlert()}
                        confirmBtnBsStyle="info"
                    >
                        Debe seleccionar un servicio para realizar la consulta.
                    </SweetAlert>
                )
            });
            return;
        }
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.state.servicioSeleccionado.value).get().then(
                doc=> {
                    this.setState({
                        min: validator.obtenerFecha(doc.data().HoraDesde),
                        max: validator.obtenerFecha(doc.data().HoraHasta),
                        dias: doc.data().Disponibilidad
                    });
                }
            );
        this.navigate(new Date());
        this.setState({consulta: true});
    }

    ChangeSelect(event) {
        this.setState({servicioSeleccionado: event, events: [], consulta: false});
    }

    selectedEvent(event) {
        console.log('algo');
    }

    addNewEventAlert(slotInfo) {
        if (slotInfo.start === slotInfo.end) {
            return;
        }
        if (slotInfo.start < new Date()) {
            this.setState({
                alert: (
                    <SweetAlert
                        style={{display: 'block', marginTop: '-100px', position: 'center'}}
                        title="No se puede realizar la reserva"
                        onConfirm={()=>this.hideAlert()}
                        onCancel={()=>this.hideAlert()}
                        confirmBtnBsStyle="info"
                    >
                        La reserva debe ser posterior a la hora o fecha actual.
                    </SweetAlert>
                )
            });
            return;
        }

        this.state.events.map((evento)=> {
            if (evento.start.getDay() == slotInfo.start.getDay()) {
                if ((evento.start <= slotInfo.start && evento.end > slotInfo.start) ||
                    (evento.start < slotInfo.end && evento.end >= slotInfo.end) ||
                    (evento.start > slotInfo.start && evento.end < slotInfo.end)) {
                    this.setState({
                        alert: (
                            <SweetAlert
                                style={{display: 'block', marginTop: '-100px', position: 'center'}}
                                title="No se puede realizar la reserva"
                                onConfirm={()=>this.hideAlert()}
                                onCancel={()=>this.hideAlert()}
                                confirmBtnBsStyle="info"
                            >
                                No se puede resevar porque ya hay una reserva vigente en este horario.
                            </SweetAlert>
                        )
                    });
                }
            }
        });
        if (this.state.alert) return;
        if (slotInfo.slots.length > 9) {
            this.setState({
                alert: (
                    <SweetAlert
                        style={{display: 'block', marginTop: '-100px', position: 'center'}}
                        title="No se puede realizar la reserva"
                        onConfirm={()=>this.hideAlert()}
                        onCancel={()=>this.hideAlert()}
                        confirmBtnBsStyle="info"
                    >
                        La reserva no debe durar mas de 4hs.
                    </SweetAlert>
                )
            });
            return;
        }
        this.setState({
            alert: (
                <SweetAlert
                    input
                    validationMsg={'El nombre es requerido para realizar la reserva.'}
                    showCancel
                    style={{display: 'block', marginTop: '-100px', position: 'center', left: '50%'}}
                    title="Ingrese nombre del evento"
                    onConfirm={e=>this.addNewEvent(e, slotInfo)}
                    onCancel={()=>this.hideAlert()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                />
            )
        });
    }

    addNewEvent(e, slotInfo) {
        let newEvents = this.state.events;
        let datos = {
            Nombre: e,
            Servicio: this.state.servicioSeleccionado.label,
            Cancelado: false,
            FechaAlta: new Date(),
            FechaHasta: slotInfo.end,
            FechaDesde: slotInfo.start,
            IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + localStorage.getItem('idPersona')),
            IdServicio: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Servicios/' + this.state.servicioSeleccionado.value),
            IdReservaServicio: null
        };
        newEvents.push({
            title: e,
            start: slotInfo.start,
            end: slotInfo.end,
            color: 'green'
        });
        this.setState({
            alert: null,
            events: newEvents
        });
        this.addReserva(datos);
    }

    eventColors(event, start, end, isSelected) {
        let backgroundColor = 'rbc-event-';
        event.color
            ? (backgroundColor = backgroundColor + event.color)
            : (backgroundColor = backgroundColor + 'default');
        return {
            className: backgroundColor
        };
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    async navigate(time) {
        let anio = time.getFullYear();
        let mes = time.getMonth();
        let dia = time.getDate();
        dia = dia - time.getDay();
        let hasta = new Date(anio, mes, (dia + 8));
        let desde = new Date(anio, mes, dia);
        let idPersona = localStorage.getItem('idPersona');
        let newEvents = [];
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.state.servicioSeleccionado.value).collection('Reservas')
            .where('FechaDesde', '>=', desde).where('FechaDesde', '<=', hasta).get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    if (doc.exists && !doc.data().Cancelado) {
                        newEvents.push({
                            title: (idPersona === doc.data().IdPropietario.id) ? doc.data().Nombre : 'Reservado',
                            start: validator.obtenerFecha(doc.data().FechaDesde),
                            end: validator.obtenerFecha(doc.data().FechaHasta),
                            color: (idPersona === doc.data().IdPropietario.id) ? 'green' : 'blue'
                        });
                    }
                });
            });
        this.setState({events: newEvents});
    }

    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Nueva Reserva</h3></legend>
                <div className="row card col-md-6">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-10 row-secction">
                                <label> Servicios del Country </label>
                                <Select
                                    className="col-6"
                                    classNamePrefix="select"
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.reservaLista}
                                    onChange={this.ChangeSelect.bind(this)}
                                />
                            </div>
                            <div className="col-md-2 row-secction" style={{paddingTop: '25px'}}>
                                <Button bsStyle="primary" fill wd onClick={this.consultar}>
                                    Consultar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.alert}
                <div hidden={!(this.state.consulta)}>
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                <h3>Servicio: {this.state.servicioSeleccionado ? this.state.servicioSeleccionado.label : 'Sin servicio seleccionado'}</h3>
                                <Card
                                    calendar
                                    content={
                                        <Calendar
                                            selectable
                                            step={30}
                                            min={this.state.min}
                                            max={this.state.max}
                                            localizer={localizer}
                                            events={this.state.events}
                                            defaultView="week"
                                            views={['week']}
                                            onNavigate={(nav)=>this.navigate(nav)}
                                            scrollToTime={new Date(2019, 11, 21, 6)}
                                            defaultDate={new Date()}
                                            // onSelectEvent={event=>this.selectedEvent(event)}
                                            onSelectSlot={slotInfo=>this.addNewEventAlert(slotInfo)}
                                            // eventPropGetter={this.eventColors} //quitar
                                        />
                                    }
                                />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default AltaReserva;
