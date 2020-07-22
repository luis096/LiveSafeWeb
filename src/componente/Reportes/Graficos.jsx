import React, {Component} from 'react';
import {Pie, Line} from "react-chartjs-2";
import {Database} from "../../config/config";
import {validator} from "../validator";
import {Pagination} from "react-bootstrap";
import Button from 'components/CustomButton/CustomButton.jsx';
import { Collapse } from 'reactstrap';
import Card from 'components/Card/Card.jsx';
import "./Graficos.css"

class Graficos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            loaing: false,
            pagina: true,
            dataLineIngresos: {},
            dataServicios: {},
            reservas: [],
            numPagina: 1,
            servicio: null,
            collapsed: false
        };

        this.consultar = this.consultar.bind(this);
        this.consultarServicios = this.consultarServicios.bind(this);
        this.consultarServicios();
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    async consultarServicios() {
        let servicios = [];
        let reservas = [];
        let dataService = [];
        let color = [];
        let porcentajes = [];

        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Servicios')
            .get().then(querySnapshot=> {
                querySnapshot.forEach(doc => {
                    servicios.push(doc.data().Nombre);
                    dataService.push(0);
                    color.push(this.getRandomColor());
                });
            });

        await Database.collectionGroup('Reservas').where('IdReservaServicio', '==', null)
            .get().then(querySnapshot=> {
            querySnapshot.forEach(doc => {
                reservas.push(doc.data());
            });
        });

        reservas.forEach( value => {
            let index = servicios.indexOf(value.Servicio.toString());
            dataService[index] = dataService[index] + 1;
        });

        let total = 0;
        dataService.forEach(x => { total += x});
        dataService.forEach((x, i) => { porcentajes[i] = ((x * 100) / total) });

        this.setState({dataService: {
                labels: servicios,
                datasets: [{
                    data: dataService,
                    backgroundColor: color
                }]
            }, servicio: {
                labels: servicios,
                porcentajes: porcentajes,
                color: color
            }
        })

    }

    async consultar(tipo) {
        let ingresos = [];
        for(var i = 0; i < 12; i++) {
            ingresos.push(0);
        }
        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection(tipo)
            .where('Hora', '>', new Date(2020, 0)).get().then(querySnapshot=> {
                querySnapshot.forEach(doc => {
                    let mes = validator.obtenerFecha(doc.data().Hora).getMonth();
                    ingresos[mes] = ingresos[mes] + 1;
                });
            });

        this.setState({dataLineIngresos:
                {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
                        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [
                        {
                            label: tipo,
                            fill: true,
                            lineTension: 0.2,
                            backgroundColor: (tipo === "Ingresos")?'rgba(75,192,192,0.4)':'rgba(192,1,6,0.4)',
                            borderColor: (tipo === "Ingresos")?'rgba(75,192,192,1)':'rgb(192,103,96)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: (tipo === "Ingresos")?'rgba(75,192,192,1)':'rgb(192,103,96)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: (tipo === "Ingresos")?'rgba(75,192,192,1)':'rgb(192,103,96)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: ingresos
                        }
                    ]
                }
        });
    }


    render() {
        return (
            <div className="col-12">
                <div className="row card" hidden={1 !== this.state.numPagina}>
                    <div className="card-body">
                        <div className='row'>
                            <div className="col-12">
                                <h3>Reservas por servicio</h3>
                                <Button bsStyle="warning" fill wd onClick={() => { this.setState({collapsed: !this.state.collapsed})}}>
                                    Ver porcentajes
                                </Button>
                                <div className="conteiner-porcentajes">
                                    <Collapse isOpen={this.state.collapsed}>
                                        <Card title={"Porcentajes:"} content={
                                            <div className="row">
                                                {
                                                    this.state.servicio && this.state.servicio.labels.map((value, i) => {
                                                    return ( <div className="row-secction col-md-3 porcentajes">
                                                            <div className="colorReference"
                                                                 style={{background : this.state.servicio.color[i]}}>
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
                            <Pie data={this.state.dataService}
                                 width={100} height={40}
                                 options={{ maintainAspectRatio: false }}/>
                        </div>
                    </div>
                </div>
                <div className="row card" hidden={2 !== this.state.numPagina}>
                    <div className='row'>
                        <div className="row-secction col-md-6">
                            <h3>Cantidad de ingresos por mes</h3>
                        </div>
                        {/*<div className="row-secction col-md-2">*/}
                        {/*    <label>Mes</label>*/}
                        {/*</div>*/}
                        {/*<div className="row-secction col-md-2">*/}
                        {/*    <label>Mes</label>*/}
                        {/*</div>*/}

                    </div>
                    <div className="card-body">
                        <div className='row'>
                            <Line data={this.state.dataLineIngresos} width={100} height={40}/>
                        </div>
                    </div>
                </div>

                <div className="row card" hidden={3 !== this.state.numPagina}>
                    <div className='row'>
                        <div className="row-secction col-md-6">
                            <h3>Cantidad de egresos por mes</h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className='row'>
                            <Line data={this.state.dataLineIngresos} width={100} height={40}/>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Pagination className="pagination-no-border">
                        <Pagination.Item active={(1 === this.state.numPagina)}
                                         onClick={()=> {this.consultarServicios(); this.setState({ numPagina: 1})}}>1
                        </Pagination.Item>
                        <Pagination.Item active={(2 === this.state.numPagina)}
                                         onClick={()=> {this.consultar("Ingresos"); this.setState({ numPagina: 2})}}>2
                        </Pagination.Item>
                        <Pagination.Item active={(3 === this.state.numPagina)}
                                         onClick={()=> {this.consultar("Egresos"); this.setState({ numPagina: 3})}}>3
                        </Pagination.Item>
                    </Pagination>
                </div>

            </div>
        );
    }

}

export default Graficos;
