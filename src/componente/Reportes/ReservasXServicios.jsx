import React, { Component } from 'react';
import { Pie, Line } from "react-chartjs-2";
import { Database } from "../../config/config";
import { validator } from "../validator";
import { Pagination } from "react-bootstrap";
import Button from 'components/CustomButton/CustomButton.jsx';
import { Collapse } from 'reactstrap';
import Card from 'components/Card/Card.jsx';
import "./Graficos.css"
import Select from "react-select";
import { operacion } from "../Operaciones";
import { detachMarkedSpans } from "codemirror/src/line/spans";
import { errorHTML } from "../Error";
import Datetime from "react-datetime";
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

class ReservasXServicios extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            loaing: false,
            dataServicios: {},
            reservas: [],
            servicio: null,
            collapsed: false,
            sinDatos: true,
            desde: null,
            hasta: null,
            errorDesde: { error: false, mensaje: '' },
            errorHasta: { error: false, mensaje: '' },
        };
        this.notificationSystem = React.createRef();
        this.consultar = this.consultar.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.pdf = this.pdf.bind(this);
    }

    componentDidMount() {
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

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    isValidRangeDate() {
        if (!this.state.desde || !this.state.hasta) return false;
        if (this.state.desde >= this.state.hasta) return false;
        return true;
    }

    async consultar() {
        let servicios = [];
        let reservas = [];
        let dataService = [];
        let color = [];
        let porcentajes = [];
        let idCountryStorage = localStorage.getItem('idCountry');

        if (!this.isValidRangeDate()) {
            this.notificationSystem.current.addNotification(operacion.error("Error en rango de fechas ingresados."));
            return;
        }

        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Servicios')
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    servicios.push(doc.data().Nombre);
                    dataService.push(0);
                    color.push(this.getRandomColor());
                });
            });


        await Database.collectionGroup('Reservas').where('IdReservaServicio', '==', null)
            .where('Cancelado', '==', false)
            .where('FechaDesde', '>=', this.state.desde)
            .where('FechaDesde', '<=', this.state.hasta)
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    let id = doc.data().IdServicio.path.toString().split('/');
                    let idCountry = id[1];

                    if (idCountry === idCountryStorage) reservas.push(doc.data());
                });
            });

        if (!reservas.length) {
            this.setState({ sinDatos: true });
            this.notificationSystem.current.addNotification(operacion.sinResultados());
            return;
        }

        reservas.forEach(value => {
            let index = servicios.indexOf(value.Servicio.toString());
            dataService[index] = dataService[index] + 1;
        });

        let total = 0;
        dataService.forEach(x => {
            total += x
        });
        dataService.forEach((x, i) => {
            porcentajes[i] = ((x * 100) / total)
        });

        this.setState({
            dataService: {
                labels: servicios,
                datasets: [{
                    data: dataService,
                    backgroundColor: color
                }]
            }, servicio: {
                labels: servicios,
                porcentajes: porcentajes,
                color: color
            }, sinDatos: false
        });
    }

    pdf() {
        let titulo = "LiveSafe - Reporte de reservas por servicio - " +
            this.state.desde.toLocaleDateString()
            + " - " + this.state.hasta.toLocaleDateString();

        let porcentajes = "Porcentajes: ";
        this.state.servicio.labels.map((value, i) => {
            porcentajes += value + ": " + this.state.servicio.porcentajes[i].toFixed(2) + "%   "
        });

        const pdf = new jsPDF('L', 'px');

        html2canvas(document.querySelector("#reporte")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            pdf.text(titulo, 10, 20);
            pdf.text(porcentajes, 10, 40, { maxWidth: 600 });
            pdf.addImage(imgData, 'PNG', -100, 100, 800, 300);
            pdf.save("Reservas-por-servicio.pdf");
        });
    }

    render() {
        return (
            <div className="col-12">
                <legend>
                    <h3 className="row">Reservas por servicio</h3>
                </legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label>Fecha Desde</label>
                                <Datetime
                                    className={this.state.errorDesde.error ? 'has-error' : ''}
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    timeFormat={false}
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
                                    timeFormat={false}
                                    inputProps={{ placeholder: 'Fecha Hasta' }}
                                />
                                <label className="small text-danger" hidden={!this.state.errorHasta.error}>
                                    {this.state.errorHasta.mensaje}
                                </label>
                            </div>
                            <div className="col-md-2 row-secction">
                                <br />
                                <Button bsStyle="primary" fill wd
                                    disabled={this.state.errorHasta.error || this.state.errorDesde.error}
                                    onClick={() => {
                                        this.consultar()
                                    }}>
                                    Consultar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row card" hidden={this.state.sinDatos}>
                    <div className="card-body">
                        <div className='row'>
                            <div className="col-12">
                                <Button bsStyle="warning" fill wd
                                    disabled={!this.state.dataService}
                                    onClick={() => {
                                        this.setState({ collapsed: !this.state.collapsed })
                                    }}>
                                    Ver porcentajes
                                </Button>
                                <div hidden={this.state.dataService}>
                                    <h5>No existen reservas realizadas en los servicios del country.</h5>
                                </div>
                                <div className="conteiner-porcentajes" id="porcentajes">
                                    <Collapse isOpen={this.state.collapsed}>
                                        <Card title={"Porcentajes:"} content={
                                            <div className="row">
                                                {
                                                    this.state.servicio && this.state.servicio.labels.map((value, i) => {
                                                        return (<div className="row-secction col-md-3 porcentajes">
                                                            <div className="colorReference"
                                                                style={{ background: this.state.servicio.color[i] }}>
                                                            </div>
                                                            <span className="servicioText">{value + ": " +
                                                                this.state.servicio.porcentajes[i].toFixed(2)
                                                                + "%"}</span>
                                                        </div>
                                                        );
                                                    })}
                                            </div>
                                        }>
                                        </Card>
                                    </Collapse>
                                </div>
                            </div>
                            <div id="reporte">
                                <Pie data={this.state.dataService}
                                    width={400} height={160} />
                            </div>
                            <div style={{ margin:'12px 0 8px 0'}} className="text-center">
                                <Button bsStyle="success" fill
                                    onClick={() => { this.pdf() }}>
                                    Descargar Grafico
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row card" hidden={!this.state.sinDatos}>
                    <div className="card-body">
                        <div className='row'>
                            <h3>No hay datos disponibles aún</h3>
                        </div>
                    </div>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style} />
                </div>
            </div>
        );
    }

}

export default ReservasXServicios;
