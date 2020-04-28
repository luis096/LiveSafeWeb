import React, {Component} from 'react';
import {Pie} from "react-chartjs-2";
import html2canvas from "html2canvas";
import Button from 'components/CustomButton/CustomButton.jsx';


const pdfConverter = require("jspdf");

class Graficos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null
        };

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
    }


    exportar(e, nameClass, fileName){
        const but = e.target;
        let input = window.document.getElementsByClassName(nameClass)[0];

        html2canvas(input).then(canvas => {
            const img = canvas.toDataURL("image/png");
            const pdf = new pdfConverter("l", "pt");
            pdf.addImage(
                img,
                "png",
                input.offsetLeft,
                input.offsetTop,
                input.clientWidth,
                input.clientHeight
            );
            pdf.save("chart.pdf");
            // but.style.display = "block";
        });
    }

    div2PDF = e => {

        const but = e.target;
        // but.style.display = "none";
        let input = window.document.getElementsByClassName("div2PDF")[0];

        html2canvas(input).then(canvas => {
            const img = canvas.toDataURL("image/png");
            const pdf = new pdfConverter("l", "pt");
            pdf.addImage(
                img,
                "png",
                input.offsetLeft,
                input.offsetTop,
                input.clientWidth,
                input.clientHeight
            );
            pdf.save("chart.pdf");
            // but.style.display = "block";
        });
    };


    render() {
        return (
            <div className="col-12">
                <legend><h3 className="row">Reportes</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <div className='row'>
                            <div className="pie">
                                <h2>Reservas por servicio</h2>
                                <Pie data={this.data}
                                     width={600}
                                     height={300}
                                     options={{ maintainAspectRatio: false }}></Pie>
                            </div>
                            <div className='izquierda'>
                                <Button bsStyle="success" fill wd
                                        onClick={e => this.exportar(e, 'pie', 'NameFile')}>
                                    PDF</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Graficos;
