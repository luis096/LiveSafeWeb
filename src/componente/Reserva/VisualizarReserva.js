import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';

class VisualizarReserva extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            reserva: {},
            desde: null,
            hasta: null
        };
        const url = this.props.location.pathname.split('/');
        this.idReserva = url[url.length - 1];
    }

    async componentDidMount() {
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(localStorage.getItem('idPersona'))
        .collection('Reservas').doc(this.idReserva).get().then(doc=> {
                  this.setState({ reserva: doc.data(), 
                  desde: new Date(doc.data().FechaDesde.seconds * 1000),
                  hasta: new Date(doc.data().FechaHasta.seconds * 1000)})
                });
        
        console.log(this.state.reserva)
    };
    


    render() {
        return (
            <div className="col-12">
               <legend><h3> Visualizar reserva</h3></legend>
               <div className="row">
                    <div className="col-md-4 row-secction">
                        <h4>Nombre del servicio</h4>
                        <label>{this.state.reserva.Servicio}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Nombre de la reserva</h4>
                        <label>{this.state.reserva.Nombre}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Estado de la reserva</h4>
                        <label>{this.state.reserva.Estado}</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 row-secction">
                        <h4>Fecha de la reserva:</h4>
                        <label>{this.state.desde?this.state.desde.toLocaleDateString():'-'}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Hora de inicio:</h4>
                        <label>{this.state.desde?this.state.desde.toLocaleTimeString():'-'}</label>
                    </div>
                    <div className="col-md-4 row-secction">
                        <h4>Hora de finalizacion:</h4>
                        <label>{this.state.hasta?this.state.hasta.toLocaleTimeString():'-'}</label>
                    </div>
                </div>
                <legend/>
                <h3>Invitados</h3>

            









            </div>
        );
    }
}

export default VisualizarReserva;