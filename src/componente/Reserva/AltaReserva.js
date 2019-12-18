import React, { Component } from 'react';
import { Database } from '../../config/config';
import Select from 'react-select';
import Calendario from '../../views/Calendar.jsx';
import { events } from 'variables/Variables.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';

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
            consulta: false,
            rescheduling: false
        };
        this.addReserva = this.addReserva.bind(this);
        this.consultar = this.consultar.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.registrar = this.registrar.bind(this);
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth();
        var d = today.getDate();
        events.push({
            title: 'Prueba de carga',
            start: new Date(y, m, d - 2, 10, 30),
            end: new Date(y, m, d - 2, 11, 30),
            allDay: false,
            color: 'green'
        });

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
                            tipo: (localStorage.getItem('idPersona') === doc.data().IdPropietario.id) ? 1 : 2
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

    consultar(){
        this.state.consulta = true;
    }

    ChangeSelect(event) {
        this.setState({servicioSeleccionado: event});
    }

    registrar() {
        console.log('Registrando....');
    }

    render() {
        return (
            <div className="col-12 ">
                <div className="row">
                    <legend><h1> Registrar una reserva</h1></legend>
                    <div className="col-md-6  flex-container form-group row-secction">
                        <label> Servicios del Country </label>
                        <Select
                            className="col-6"
                            classNamePrefix="select"
                            isDisabled={this.state.consulta}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            options={this.state.reservaLista}
                            onChange={this.ChangeSelect.bind(this)}
                        />
                    </div>
                    <div className="row-secction">
                        <Button bsStyle="primary" fill wd onClick={this.consultar} disabled={this.state.consulta}>
                            Consultar
                        </Button>
                        <Button bsStyle="primary" fill wd onClick={this.reestablecerBusqueda}
                                disabled={!this.state.consulta}>
                            Reestablecer
                        </Button>
                    </div>
                </div>
                <div hidden={!this.state.consulta}>
                    <h3>{this.state.servicioSeleccionado.label || ''}</h3>
                    <Calendario/>
                </div>
            </div>
        );
    }
}

export default AltaReserva;