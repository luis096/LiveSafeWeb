import React, {Component} from 'react';
import {Pie, Line} from "react-chartjs-2";
import Button from 'components/CustomButton/CustomButton.jsx';
import {Database} from "../../config/config";
import {operacion} from "../Operaciones";
import {validator} from "../validator";

class Graficos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            loaing: false,
            pagina: true,
            dataLineIngresos: {},
            dataServicios: {},
            reservas: []
        };

        this.consultar = this.consultar.bind(this);
        this.consultarServicios = this.consultarServicios.bind(this);

        this.data = {
            labels: [
                'Red',
                'Blue',
                'Yellow'
            ],

            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],

            }]
        };

        this.consultar("Ingresos");
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
        let ids = [];
        let dataService = [];

        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Servicios')
            .get().then(querySnapshot=> {
                querySnapshot.forEach(doc => {
                    servicios.push(doc.data().Nombre);
                    dataService.push(0);
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

        this.setState({dataService: {
                labels: servicios,

                datasets: [{
                    data: dataService,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#fff20B',
                        '#00ff0B',
                        '#0fffff',
                        '#FFCE56'
                    ],

                }]
            }
        })

    }

    async consultar(tipo) {
        let ingresos = [];
        for(var i = 0; i < 12; i++) {
            ingresos.push(0);
        }
        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection(tipo)
            .where('Hora', '>', new Date(2020, 1)).get().then(querySnapshot=> {
                querySnapshot.forEach(doc => {
                    let mes = validator.obtenerFecha(doc.data().Hora).getMonth();
                    ingresos[mes - 1] = ingresos[mes - 1] + 1;
                });
            });
        this.state.dataLineIngresos = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
                'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: 'Ingresos',
                    fill: true,
                    lineTension: 0.2,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                }
            ]
        };

        this.setState({dataLineIngresos:
                {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
                        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [
                        {
                            label: 'Ingresos',
                            fill: true,
                            lineTension: 0.2,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
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
                {/*<legend><h3 className="row">Reportes</h3></legend>*/}
                <div className="row card" hidden={!this.state.pagina}>
                    <div className="card-body">
                        <div className='row'>
                            <div className="pie">
                                <h2>Reservas por servicio</h2>
                                <Pie data={this.state.dataService}></Pie>
                            </div>
                        </div>
                    </div>
                    <div className="izquierda">
                        <Button bsStyle="success" fill
                                hidden={!this.state.pagina}
                                onClick={() => this.setState({pagina: false})}>
                            {"Siguiente"}
                        </Button>
                    </div>
                </div>
                <div className="row card" hidden={this.state.pagina}>
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
                            <Line data={this.state.dataLineIngresos}></Line>
                        </div>
                    </div>
                    <Button bsStyle="success" fill
                            hidden={this.state.pagina}
                            onClick={() => this.setState({pagina: true})}>
                        {"Anterior"}
                    </Button>
                </div>
            </div>
        );
    }
}

export default Graficos;
