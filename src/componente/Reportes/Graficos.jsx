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
import NotificationSystem from "react-notification-system";
import { style } from "../../variables/Variables";
import icono from "../../Icono2.ico";
import logo from "../../Icono2.ico"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class Graficos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            nombreReporte: "",
            loaing: false,
            dataLineIngresos: {},
            sinDatos: true,
            anioDesde: null,
            anioHasta: null,
            aniosDesde: null,
            aniosHasta: null,
            mesDesde: null,
            mesHasta: null,
            mesesDesde: null,
            mesesHasta: null,
        };
        this.notificationSystem = React.createRef();
        this.consultar = this.consultar.bind(this);
        this.isValidRangeDate = this.isValidRangeDate.bind(this);

    }

    componentDidMount() {
        const url = this.props.location.pathname.split('/');

        if (url[url.length - 1] === '1') {
            this.setState({ nombreReporte: "Ingresos" })
        } else { this.setState({ nombreReporte: "Egresos" }) }

        this.setState({
            mesesDesde: operacion.obtenerMeses(1),
            mesesHasta: operacion.obtenerMeses(2),
            aniosHasta: operacion.obtenerAnios(),
            aniosDesde: operacion.obtenerAnios()
        });


    }

    ChangeSelectMesDesde(value) {
        this.setState({ mesDesde: value });
    }

    ChangeSelectMesHasta(value) {
        this.setState({ mesHasta: value });
    }

    ChangeSelectAnioDesde(value) {
        this.setState({ anioDesde: value });
    }

    ChangeSelectAnioHasta(value) {
        this.setState({ anioHasta: value });
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
        console.log("Pasi 0");
        if (!this.state.mesHasta || !this.state.mesDesde ||
            !this.state.anioDesde || !this.state.anioHasta) return false;
        console.log("Pasi 1");
        if (((this.state.mesHasta.value - this.state.mesDesde.value) > 24 &&
            this.state.anioDesde.value !== this.state.anioHasta.value) ||
            (this.state.anioDesde.value > this.state.anioHasta.value)) return false;
        console.log("Pasi 2");
        if (this.state.anioDesde.value === this.state.anioHasta.value &&
            (this.state.mesDesde.value >= (this.state.mesHasta.value - 12))) return false;
        console.log("Pasi 3");
        return true;
    }

    async consultar(tipo) {
        let ingresos = [];
        if (!this.isValidRangeDate()) {
            this.notificationSystem.current.addNotification(operacion.error("Error en rango de fechas ingresados."));
            return;
        }

        let mismoAnio = (this.state.anioDesde.value === this.state.anioHasta.value);

        let cantidad = mismoAnio ? (this.state.mesHasta.value - this.state.mesDesde.value - 12)
            : (this.state.mesHasta.value - this.state.mesDesde.value);

        for (var i = 0; i <= cantidad; i++) {
            ingresos.push(0);
        }

        await Database.collection('Country').doc(localStorage.getItem('idCountry')).collection(tipo)
            .where('Fecha', '>=', new Date(this.state.anioDesde.value, this.state.mesDesde.value - 1))
            .where('Fecha', '<=', new Date(this.state.anioHasta.value, this.state.mesHasta.value - 12))
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    let mes = validator.obtenerFecha(doc.data().Fecha).getMonth();
                    let anio = validator.obtenerFecha(doc.data().Fecha).getFullYear();
                    let desplazamiento = (this.state.mesDesde.value - 1);
                    if (!mismoAnio) {
                        mes = anio === 2020 ? mes + 12 : mes;
                    }
                    ingresos[mes - desplazamiento] = ingresos[mes - desplazamiento] + 1;
                });
            });

        this.setState({
            dataLineIngresos:
            {
                labels: operacion.obtenerMesesLabels(this.state.mesDesde.value, this.state.mesHasta.value, mismoAnio),
                datasets: [
                    {
                        label: tipo,
                        fill: true,
                        lineTension: 0.2,
                        backgroundColor: (tipo === "Ingresos") ? 'rgba(75,192,192,0.4)' : 'rgba(192,1,6,0.4)',
                        borderColor: (tipo === "Ingresos") ? 'rgba(75,192,192,1)' : 'rgb(192,103,96)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: (tipo === "Ingresos") ? 'rgba(75,192,192,1)' : 'rgb(192,103,96)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: (tipo === "Ingresos") ? 'rgba(75,192,192,1)' : 'rgb(192,103,96)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: ingresos
                    }
                ]
            },
            sinDatos: false
        });
    }


    pdf() {
        let titulo = "LiveSafe - Reporte de " + this.state.nombreReporte.toLowerCase() + " por mes desde " +
            this.state.mesDesde.label + " " + this.state.anioDesde.label
            + " a " + this.state.mesHasta.label + " " + this.state.anioHasta.label;
        const pdf = new jsPDF('L', 'px');
        html2canvas(document.querySelector("#reporte")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            pdf.text(titulo, 10, 20);
            pdf.addImage(imgData, 'PNG', 10, 30, 570, 320);
            pdf.save(this.state.nombreReporte + "-por-mes.pdf");
        });
    }

    async pdfMejorado() {
        const pdf = new jsPDF('L', 'px');
        await html2canvas(document.querySelector("#descarga")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 650, 300);
            pdf.save(this.state.nombreReporte + "-por-mes.pdf");
        });
    }


    reset() {
        this.setState({
            alert: null,
            loaing: false,
            dataLineIngresos: {},
            sinDatos: true,
            anioDesde: null,
            anioHasta: null,
            mesDesde: null,
            mesHasta: null
        });
    }

    render() {
        return (
            <div className="col-12">
                 <legend>
                 <h3 style={{margin:'30px 40px 15px'}}>Cantidad de {this.state.nombreReporte.toLowerCase()} por mes</h3>
                </legend>
                
                <div className="row card">
                    <div className='row body'>
                        
                    </div>
                    <div style={{ width:'93%'}} className='row header'>
                        <div style={{marginLeft:'3px', padding:'0', width:'36%'}} className="row-secction col-md-6">
                            <h6>Desde</h6>
                        </div>
                        <div style={{padding:'0', width:'54%'}} className="row-secction col-md-6">
                            <h6>Hasta</h6>
                        </div>
                    </div>
                    <div style={{marginTop:'5px', display:'flex', flexDirection:'row', width:'100%'}} className='row'>
                        <div style={{width:'17%', marginRight:'6px'}} className="row-secction ">
                            <label>Mes</label>
                            <Select
                                placeholder="Seleccionar"
                                isDisabled={!this.state.sinDatos}
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.mesDesde}
                                options={this.state.mesesDesde}
                                onChange={this.ChangeSelectMesDesde.bind(this)}
                            />
                        </div>
                        <div style={{width:'14%', margin:'0 6px'}} className="row-secction ">
                            <label>Año</label>
                            <Select
                                placeholder="Seleccionar"
                                isDisabled={!this.state.sinDatos}
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.anioDesde}
                                options={this.state.aniosDesde}
                                onChange={this.ChangeSelectAnioDesde.bind(this)}
                            />
                        </div>
                        <div style={{width:'17%', margin:'0 6px'}} className="row-secction ">
                            <label>Mes</label>
                            <Select
                                placeholder="Seleccionar"
                                isDisabled={!this.state.sinDatos}
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.mesHasta}
                                options={this.state.mesesHasta}
                                onChange={this.ChangeSelectMesHasta.bind(this)}
                            />
                        </div>
                        <div style={{width:'14%', margin:'0 6px'}} className="row-secction ">
                            <label>Año</label>
                            <Select
                                placeholder="Seleccionar"
                                isDisabled={!this.state.sinDatos}
                                isClearable={true}
                                isSearchable={true}
                                value={this.state.anioHasta}
                                options={this.state.aniosHasta}
                                onChange={this.ChangeSelectAnioHasta.bind(this)}
                            />
                        </div>
                        <div style={{marginTop:'5px', width:'16%', marginLeft:'6px'}} className="row-secction ">
                            <br />
                            <Button bsStyle="primary" fill
                                    disabled={!this.isValidRangeDate() || !this.state.sinDatos}
                                onClick={() => { this.consultar(this.state.nombreReporte) }}>
                                Generar Reporte
                            </Button>
                        </div>
                        <div style={{marginTop:'5px', width:'16%', marginLeft:'6px'}} className="row-secction ">
                            <br />
                            <Button bsStyle="default" fill
                                    disabled={this.state.sinDatos}
                                    onClick={() => { this.reset()}}>
                                Reestablecer
                            </Button>
                        </div>
                    </div>
                </div>


                <div hidden={this.state.sinDatos}>
                    <div id="descarga">
                        <div className="card row">
                            <div className="cabecera">
                            <div style={{display:"flex", alignItems:"center"}}>
                                <img  src={logo} width={"40px"} height={"40px"} alt="logo"/>
                                     <h2 style={{marginLeft:'6px'}}> LiveSafe</h2>
                                </div>
                                <h4 className="tituloReporte">Reporte de {this.state.nombreReporte.toLowerCase()} por mes</h4>
                                <div className="fecha">
                                    <label>Fecha de emición: {new Date().toLocaleDateString()}</label>
                                    <label>Fecha desde: {this.state.mesDesde ? this.state.mesDesde.label+" " : ""}
                                        {this.state.anioDesde ? this.state.anioDesde.label+" " : ""} </label>
                                        <label>
                                        Fecha hasta: {this.state.mesHasta ? this.state.mesHasta.label+" " : ""}
                                        {this.state.anioHasta ? this.state.anioHasta.label+" " : ""}
                                    </label>
                                </div>
                            </div>
                            <legend/>
                            <Line data={this.state.dataLineIngresos} width={100} height={40} />
                        </div>
                    </div>
                    <div style={{ margin:'12px 0 8px 0'}} className="text-center">
                        <Button bsStyle="success" fill
                                onClick={() => { this.pdfMejorado() }}>
                            Descargar Reporte
                        </Button>
                    </div>
                </div>

                <div className="row card" hidden={!this.state.sinDatos}>
                    <div className="card-body">
                        <div className='row'>
                            <h3>Aún no hay datos disponibles.</h3>
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

export default Graficos;
