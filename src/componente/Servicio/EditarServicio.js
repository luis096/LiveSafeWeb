import React, { Component } from 'react';
import { Database } from '../../config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import Datetime from 'react-datetime';
import Switch from 'react-bootstrap-switch';
import { validator } from '../validator';
import { errorHTML } from '../Error';
import Select from "react-select";

class EditarServicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            servicio: [],
            nombre: '',
            estado: true,
            descripcion: '',
            horaDesde: new Date(2020, 0, 1, 8, 0),
            horaHasta: new Date(2020, 0, 1, 18, 0),
            dias: [false, false, false, false, false, false, false],
            turnosMax: null,
            turnoSelect:[],
            turnosMaxSelect:[],
            duracionTurno: null,
        };
        this.editServicio = this.editServicio.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeSelectTurnosMax = this.ChangeSelectTurnosMax.bind(this);
        this.ChangeSelectTurno = this.ChangeSelectTurno.bind(this);
        this.registrar = this.registrar.bind(this);
        const url = this.props.location.pathname.split('/');
        this.idServicio = url[url.length - 1];

        this.errorNombre = {error: false, mensaje: ''};
        

    }

    async componentDidMount() {
        await Database.collection('Turnos').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                this.state.turnoSelect.push(
                    {value: doc.data().Duracion, label: doc.data().DuracionString}
                );
            });
        });
        let max = 0;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.idServicio).get().then(doc=> {
                if (doc.exists) {
                    this.setState({
                        nombre: doc.data().Nombre,
                        estado: doc.data().Estado,
                        idCountry: doc.data().IdCountry,
                        descripcion: doc.data().Descripcion,
                        dias: doc.data().Disponibilidad,
                        horaDesde: validator.obtenerFecha(doc.data().HoraDesde),
                        horaHasta: validator.obtenerFecha(doc.data().HoraHasta),
                        duracionTurno: this.state.turnoSelect.find(x => x.value == (doc.data().DuracionTurno/60))
                    });
                    max = doc.data().TurnosMax;
                }
            });
        await this.actualizarHorasMax();
        await this.setState({turnosMax: this.state.turnosMaxSelect.find(x => x.value == max)});
    }

    async actualizarHorasMax() {
        let cantidadHs = new Date(this.state.horaHasta).getHours() - new Date(this.state.horaDesde).getHours();
        let cantidadMin = new Date(this.state.horaHasta).getMinutes() - new Date(this.state.horaDesde).getMinutes();

        if (cantidadHs < 1 || !this.state.duracionTurno) return;

        let max = (cantidadHs / this.state.duracionTurno.value);
        if (cantidadMin >= (this.state.duracionTurno.value * 60)) { max++ }
        await this.setState({turnosMaxSelect: []});
        for(var i = 1; i <= max; i++) {
            this.state.turnosMaxSelect.push({value: i, label:i.toString()});
        }
    }

    editServicio() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.idServicio).update({
            Nombre: this.state.nombre,
            Estado: this.state.estado,
            Disponibilidad: this.state.dias,
            HoraDesde: this.redondear(new Date(this.state.horaDesde)),
            HoraHasta: this.redondear(new Date(this.state.horaHasta)),
            Descripcion: this.state.descripcion,
            TurnosMax: this.state.turnosMax.value,
            DuracionTurno: (this.state.duracionTurno.value * 60)
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
        await this.setState({duracionTurno: value});
        await this.setState({turnosMax: null});
        await this.actualizarHorasMax();
    }

    registrar() {
        this.editServicio();
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

    render() {

        return (
            <div className="col-12">
                <legend><h3 className="row">Editar Servicio</h3></legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="row-secction col-md-6">
                                <label> Nombre del Servicio </label>
                                <input className={ errorHTML.classNameError(this.errorNombre, 'form-control') }
                                       placeholder="Nombre del Servicio"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}/>
                                 {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="row-secction col-md-3">
                                <label>Disponibilidad del servicio</label>
                                <div>
                                    <Switch onText="Si" offText="No"
                                            value={this.state.estado}
                                            onChange={()=> {
                                                this.ChangeEstado();
                                            }}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <label>Días disponibles del servicio:</label>
                            <div className="row">
                                <div className="row-secction col-md-1">
                                    <p className="category">Lunes</p>
                                    <Switch
                                        onText="✔"
                                        offText="✘"
                                        value={this.state.dias[0]}
                                        onChange={()=> {
                                            this.ChangeDia(0);
                                        }}
                                    />
                                </div>
                                <div className="row-secction col-md-1">
                                    <p className="category">Martes</p>
                                    <Switch
                                        onText="✔"
                                        offText="✘"
                                        value={this.state.dias[1]}
                                        onChange={()=> {
                                            this.ChangeDia(1);
                                        }}
                                    />
                                </div>
                                <div className="row-secction col-md-1">
                                    <p className="category">Miercoles</p>
                                    <Switch
                                        onText="✔"
                                        offText="✘"
                                        value={this.state.dias[2]}
                                        onChange={()=> {
                                            this.ChangeDia(2);
                                        }}
                                    />
                                </div>
                                <div className="row-secction col-md-1">
                                    <p className="category">Jueves</p>
                                    <Switch
                                        onText="✔"
                                        offText="✘"
                                        value={this.state.dias[3]}
                                        onChange={()=> {
                                            this.ChangeDia(3);
                                        }}
                                    />
                                </div>
                                <div className="row-secction col-md-1">
                                    <p className="category">Viernes</p>
                                    <Switch
                                        onText="✔"
                                        offText="✘"
                                        value={this.state.dias[4]}
                                        onChange={()=> {
                                            this.ChangeDia(4);
                                        }}
                                    />
                                </div>
                                <div className="row-secction col-md-1">
                                    <p className="category">Sabado</p>
                                    <Switch
                                        onText="✔"
                                        offText="✘"
                                        value={this.state.dias[5]}
                                        onChange={()=> {
                                            this.ChangeDia(5);
                                        }}
                                    />
                                </div>
                                <div className="row-secction col-md-1">
                                    <p className="category">Domingo</p>
                                    <Switch
                                        onText="✔"
                                        offText="✘"
                                        value={this.state.dias[6]}
                                        onChange={()=> {
                                            this.ChangeDia(6);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row-secction col-md-2">
                                <label>Hora Desde</label>
                                <Datetime
                                    dateFormat={false}
                                    inputProps={{placeholder: 'Hora desde'}}
                                    value={this.state.horaDesde}
                                    onChange={this.ChangeDesde}
                                />

                            </div>
                            <div className="row-secction col-md-2">
                                <label>Hora Hasta</label>
                                <Datetime
                                    dateFormat={false}
                                    inputProps={{placeholder: 'Hora hasta'}}
                                    value={this.state.horaHasta}
                                    onChange={this.ChangeHasta}
                                />
                            </div>
                            <div className="row-secction col-md-2">
                                <label>Duración de turno</label>
                                <Select
                                    isClearable={true}
                                    value={this.state.duracionTurno}
                                    options={this.state.turnoSelect}
                                    onChange={this.ChangeSelectTurno.bind(this)}
                                />
                            </div>
                            <div className="row-secction col-md-2">
                                <label>Turnos Maximos de Reserva</label>
                                <Select
                                    isClearable={true}
                                    value={this.state.turnosMax}
                                    options={this.state.turnosMaxSelect}
                                    onChange={this.ChangeSelectTurnosMax.bind(this)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <label> Descripcion </ label>
                            <textarea className="form-control" rows="3" placeholder="Descripcion del servicio"
                                      value={this.state.descripcion}
                                      onChange={this.ChangeDescripcion}> </textarea>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>
                        Registrar
                    </Button>
                </div>
            </div>
        );
    }
}

export default EditarServicio;
