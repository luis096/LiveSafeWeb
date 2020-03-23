import React, { Component } from 'react';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';
import { paginador } from '../Paginador';
import { errorHTML } from '../Error';
import { validator } from '../validator';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Pagination } from 'react-bootstrap';
import Button from 'components/CustomButton/CustomButton.jsx';
import Select from 'react-select';
import Datetime from 'react-datetime';
import { operacion } from '../Operaciones';


class PrincipalAdministrador extends Component {

    constructor() {
        super();
        this.state = {
            administradores: [],
            barriosSelect: [],
            tipoD: [],
            barrio: '',
            alert: null,
            numPagina: -1,
            nombre: '',
            apellido: '',
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''},
        };

        this.hideAlert = this.hideAlert.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDesde = this.ChangeDesde.bind(this);
        this.ChangeHasta = this.ChangeHasta.bind(this);
        this.consultar = this.consultar.bind(this);
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const { tipoD, barriosSelect } = this.state;
        await Database.collection('Country').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                barriosSelect.push({value: doc.id, label: doc.data().Nombre})
            });
        });
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });
        this.setState({ tipoD, barriosSelect, barrio: barriosSelect[0]});
    }

    ChangeBarrio(value) {
        this.setState({barrio: value});
        console.log(value)
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        this.errorNombre = validator.soloLetras(event.target.value);
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        this.errorApellido = validator.soloLetras(event.target.value);
    }

    ChangeDesde(event) {
        this.setState({desde: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(new Date(event), this.state.hasta, true),
            errorDesde: validator.fechaRango(new Date(event), this.state.hasta, false)
        });
    }

    ChangeHasta(event) {
        this.setState({hasta: new Date(event)});
        this.setState({
            errorHasta: validator.fechaRango(this.state.desde, new Date(event), false),
            errorDesde: validator.fechaRango(this.state.desde, new Date(event), true)
        });
    }


    async consultar(pagina, nueva) {
        let {administradores} = this.state;

        if(!validator.isValid([this.errorNombre, this.state.errorDesde, this.state.errorHasta])){
            this.setState({
                alert: (
                    <SweetAlert
                        style={{display: 'block', marginTop: '-100px', position: 'center'}}
                        title="Error"
                        onConfirm={()=>this.hideAlert()}
                        onCancel={()=>this.hideAlert()}
                        confirmBtnBsStyle="danger"
                    >
                        Hay errores en los filtros.
                    </SweetAlert>
                )
            });
            return;
        }

        if (nueva) {
            this.setState({
                ultimo: [],
                primero: [],
                numPagina: -1
            });
        }
        if (this.cantidad.length && (this.cantidad.length <= pagina || pagina < 0)) {
            return;
        }

        let con = await Database.collection('Country').doc(this.state.barrio.value)
            .collection('Administradores');

        let total = con;

        if (pagina > 0) {
            if (pagina > this.state.numPagina) {
                let ultimo = this.state.ultimo[this.state.numPagina];
                con = con.startAfter(ultimo);
            } else {
                let primero = this.state.primero[pagina];
                con = con.startAt(primero);
            }
        }

        con = con.limit(paginador.getTamPagina());

        if (this.state.desde) {
            con = con.where('FechaAlta', '>=', this.state.desde);
            total = total.where('FechaAlta', '>=', this.state.desde);
        }
        if (this.state.hasta) {
            con = con.where('FechaAlta', '<=', this.state.hasta);
            total = total.where('FechaAlta', '<=', this.state.hasta);
        }
        if (this.state.nombre) {
            con = con.where('Nombre', '==', this.state.nombre);
            total = total.where('Nombre', '==', this.state.nombre);
        }
        if (this.state.apellido) {
            con = con.where('Apellido', '==', this.state.apellido);
            total = total.where('Apellido', '==', this.state.apellido);
        }

        if (nueva) {
            await total.get().then((doc)=> {
                this.total = doc.docs.length;
            });
        }

        administradores = [];
        let ultimo = null;
        let primero = null;
        await con.get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                if (!primero) {
                    primero = doc;
                }
                ultimo = doc;
                administradores.push(
                    [doc.data(), doc.id]
                );
            });
        });

        if ((pagina > this.state.numPagina || this.state.numPagina < 0) && !this.state.ultimo[pagina]) {
            this.state.ultimo.push(ultimo);
            this.state.primero.push(primero);
        }
        if (nueva) {
            this.cantidad = paginador.cantidad(this.total);
        }

        this.setState({administradores, numPagina: (pagina)});
    }


    reestablecer(){
        this.setState({
            administradores: [],
            numPagina: -1,
            nombre: '',
            apellido: '',
            desde: null,
            hasta: null,
            ultimo: [],
            primero: [],
            errorDesde: {error: false, mensaje: ''},
            errorHasta: {error: false, mensaje: ''},
        });
        this.cantidad = [];
        this.total = 0;
        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    render() {
        return (
            <div className="col-12 ">
                <legend><h3 className="row">Administradores</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <h5 className="row">Filtros de busqueda</h5>
                        <div className='row'>
                            <div className="col-md-4 row-secction">
                                <label>Nombre</label>
                                <input className={ errorHTML.classNameError(this.errorNombre, 'form-control') }
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre} placeholder="Nombre"/>
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Apellido</label>
                                <input className={ errorHTML.classNameError(this.errorApellido, 'form-control') }
                                       value={this.state.apellido}
                                       onChange={this.ChangeApellido} placeholder="Apellido"/>
                                {errorHTML.errorLabel(this.errorApellido)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Barrio</label>
                                <Select
                                    isSearchable={true}
                                    value={this.state.barrio}
                                    options={this.state.barriosSelect}
                                    onChange={this.ChangeBarrio.bind(this)}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-4 row-secction">
                                <label>Fecha Desde</label>
                                <Datetime
                                    className={errorHTML.classNameErrorDate(this.state.errorDesde, '') }
                                    value={this.state.desde}
                                    onChange={this.ChangeDesde}
                                    inputProps={{placeholder: 'Fecha Desde'}}
                                />
                                {errorHTML.errorLabel(this.state.errorDesde)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label>Fecha Hasta</label>
                                <Datetime
                                    className={errorHTML.classNameErrorDate(this.state.errorHasta, '')}
                                    value={this.state.hasta}
                                    onChange={this.ChangeHasta}
                                    inputProps={{placeholder: 'Fecha Hasta'}}
                                />
                                {errorHTML.errorLabel(this.state.errorHasta)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="izquierda">
                    <Button bsStyle="default" fill wd onClick={()=> {
                        this.reestablecer();
                    }}>
                        Reestablecer
                    </Button>
                    <Button bsStyle="primary" fill wd onClick={()=> {
                        this.consultar(0, true);
                    }}>
                        Consultar
                    </Button>
                </div>


                <div className="card row" hidden={!this.state.administradores.length}>
                    <h4 className="row">Administradores ({this.total})</h4>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Indice</th>
                                <th scope="col">Apellido y Nombre</th>
                                <th scope="col">Tipo Documento</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Fecha Nacimiento</th>
                                <th scope="col">Celular</th>
                                <th scope="col">Fecha Alta</th>
                                <th scope="col">Editar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.administradores.map((adm, ind)=> {
                                    let editar = '/root/editarAdministrador/' + adm[1];
                                    let nacimiento = validator.obtenerFecha(adm[0].FechaNacimiento);
                                    let alta = validator.obtenerFecha(adm[0].FechaAlta);
                                    let tipoDocLabel = operacion.obtenerDocumentoLabel(adm[0].TipoDocumento.id, this.state.tipoD);
                                    return (
                                        <tr className="table-light">
                                            <th scope="row">{ind + 1 + (paginador.getTamPagina() * this.state.numPagina)}</th>
                                            <td>{adm[0].Apellido + ', ' + adm[0].Nombre}</td>
                                            <td>{tipoDocLabel}</td>
                                            <td>{adm[0].Documento}</td>
                                            <td>{nacimiento.toLocaleDateString()}</td>
                                            <td>{adm[0].Celular}</td>
                                            <td>{alta.toLocaleString()}</td>
                                            <td><Link to={editar}><Button bsStyle="warning" fill wd>
                                                Editar
                                            </Button></Link></td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center" hidden={!this.state.administradores.length}>
                    <Pagination className="pagination-no-border">
                        <Pagination.First onClick={()=>this.consultar((this.state.numPagina - 1), false)}/>

                        {
                            this.cantidad.map(num=> {
                                return (<Pagination.Item
                                    active={(num == this.state.numPagina)}>{num + 1}</Pagination.Item>);
                            })
                        }

                        <Pagination.Last onClick={()=>this.consultar((this.state.numPagina + 1), false)}/>
                    </Pagination>
                </div>
                <div className="row card" hidden={this.state.administradores.length}>
                    <div className="card-body">
                        <h4 className="row">No se encontraron resultados.</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrincipalAdministrador;