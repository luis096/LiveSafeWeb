import React, { Component } from 'react';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Calendar from 'react-calendar'
import moment from 'moment'
import Calendario from '../../views/Calendar.jsx'


class AltaReserva extends Component {

    constructor() {
        super();
        this.state = {
            nombre: '',
            estado: 'Si',
            disponibilidad: '',
            descripcion: '',
            reservaLista: [],
            servicioSeleccionado: {},
            dateSelected: '',
            locale: 'es',
            minTime: '07:00:00',
            maxTime: '23:00:00',
            data: [],
            rescheduling: false
        };
        this.addReserva = this.addReserva.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.registrar = this.registrar.bind(this);

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
        let evs = [];
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc('1LZCKpaErJlZx8LDdnCs').collection('Reservas').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    let date = new Date(doc.data().FechaDesde.seconds * 1000);
                    evs.push(
                        {
                            fechaHora: date,
                            fechaHsHasta: null,
                            tipo:  (localStorage.getItem('idPersona') === doc.data().IdPropietario.id)?1 :2
                        }
                    );

                });
            });
        // this.setEventsCalendar(evs);
    }

    addReserva() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Reserva').add({
            Nombre: this.state.nombre,
            Estado: this.state.estado,
            Hora: this.state.dias,
            Descripcion: this.state.descripcion
        });

    }

    ChangeSelect(event) {
        this.setState({servicioSeleccionado: event});
    }

    registrar() {
        console.log("Registrando....");
    }

    render() {
        const {
            dateSelected,
        } = this.state;
        return (
            <div className="col-12 ">
                <div className="row">
                    <legend><h1> Registrar una reserva</h1></legend>
                    <div className="col-md-6  flex-container form-group">
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

                    <div className="form-group izquierda">
                        <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                        <Link to="/" type="button" className="btn btn-primary boton"
                        >Volver</Link>
                    </div>
                </div>
                {/*<div className='row row-section'>*/}
                    {/*<div className='col-3'>*/}
                        {/*<Calendar*/}
                            {/*value={dateSelected ? dateSelected : new Date()}*/}
                            {/*locale={'es'}*/}
                            {/*onChange={value=> {*/}
                                {/*this.setState({dateSelected: value});*/}
                            {/*}}*/}
                            {/*formatMonthYear={(locale, date)=>moment(date).locale('es').format('MMMM YYYY')}*/}
                            {/*minDate={new Date()}*/}
                        {/*/>*/}
                    {/*</div>*/}

                {/*</div>*/}
                <div>
                    <Calendario>

                    </Calendario>
                </div>
            </div>
        );
    }
}

export default AltaReserva;