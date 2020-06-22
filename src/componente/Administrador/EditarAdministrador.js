import React, { Component } from 'react';
import Select from 'react-select';
import { Database } from '../../config/config';
import { validator } from '../validator';
import Button from 'components/CustomButton/CustomButton.jsx';
import Datetime from 'react-datetime';
import { operacion } from '../Operaciones';
import { errorHTML } from '../Error';
import SweetAlert from 'react-bootstrap-sweetalert';
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";



class EditarAdministrador extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            celular: '',
            fechaNacimiento: '',
            idCountry: '',
            countryList: [],
            tipoD: [],
        };
        this.notificationSystem = React.createRef();
        this.editAdministrador = this.editAdministrador.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.registrar = this.registrar.bind(this);

        const url = this.props.location.pathname.split('/');
        this.idAdministrador = url[url.length - 1];

        this.errorNombre = {error: false, mensaje: ''};
        this.errorApellido = {error: false, mensaje: ''};
        this.errorDocumento = {error: false, mensaje: ''};
        this.errorCelular= {error:false, mensaje:''};
        this.errorTipoDocumento= {error:false, mensaje:''};
        this.errorMail= {error:false, mensaje:''}

    }

    async componentDidMount() {
        const {tipoD, countryList} = this.state;
        await Database.collection('Country').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                countryList.push(
                    {value: doc.id, label: doc.data().Nombre}
                );

            });
        });
        await Database.collection('TipoDocumento').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        });

        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Administradores').doc(this.idAdministrador).get()
            .then(doc=> {
                if (doc.exists) {
                    this.setState({
                        nombre: doc.data().Nombre,
                        apellido: doc.data().Apellido,
                        documento: doc.data().Documento,
                        tipoDocumento:  {value: doc.data().TipoDocumento.id, label:
                        operacion.obtenerDocumentoLabel(doc.data().TipoDocumento.id, tipoD)},
                        fechaNacimiento: validator.obtenerFecha(doc.data().FechaNacimiento),
                        celular: doc.data().Celular
                    })
                }
            });

        this.setState({tipoD, countryList});
    }


    editAdministrador() {
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Administradores').update({
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Documento: this.state.documento,
                Celular: this.state.celular,
                TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.value),
                FechaNacimiento: new Date(this.state.fechaNacimiento)
            })

    }

    ChangeNombre(event) {
        this.setState({nombre:event.target.value})
        if (event.target.value == "")
        {this.errorNombre= validator.requerido(event.target.value)}
        else{this.errorNombre =validator.soloLetras(event.target.value)}
    }

    ChangeApellido(event) {
        this.setState({apellido:event.target.value})
        if (event.target.value == "")
        {this.errorApellido= validator.requerido(event.target.value)}
        else{this.errorApellido =validator.soloLetras(event.target.value)}
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        if (event.target.value == "")
        {this.errorCelular= validator.requerido(event.target.value)}
        else{this.errorCelular =validator.numero(event.target.value)}
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        if (event.target.value == "")
        {this.errorDocumento= validator.requerido(event.target.value)}
        else{this.errorDocumento =validator.numero(event.target.value)}
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
        this.errorTipoDocumento = validator.requerido(value ? value.value : null);

    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event});
    }


    registrar() {
        if (this.state.nombre == "" || this.state.apellido == "" || this.state.documento =="" || this.state.tipoDocumento == "" ||
        this.state.fechaNacimiento== "" || this.state.celular == "" || this.state.mail == "") {
            operacion.sinCompletar("Debe completar todos los campos requeridos")
            return
        }
        this.editAdministrador();
    }

    render() {
        return (
            <div className="col-12 ">
                <legend><h3 className="row">Editar Administrador</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                        <div className="col-md-4 row-secction">
                                <label> Nombre </label>
                                <input type="name" className={ errorHTML.classNameError(this.errorNombre, 'form-control') }
                                       placeholder="Nombre"
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Apellido </label>
                                <input className={ errorHTML.classNameError(this.errorApellido, 'form-control') }
                                       placeholder="Apellido"
                                       value={this.state.apellido}
                                       onChange={this.ChangeApellido}/>
                                {errorHTML.errorLabel(this.errorApellido)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Fecha de Nacimiento </label>
                                <Datetime
                                    inputProps={{placeholder: 'Fecha de Nacimiento'}}
                                    timeFormat={false}
                                    value={this.state.fechaNacimiento}
                                    onChange={this.ChangeFechaNacimiento}
                                />
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-md-4 row-secction">
                                <label> Tipo de Documento </label>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    value = {this.state.tipoDocumento }
                                    onChange={this.ChangeSelect.bind(this)}
                                    styles={this.errorTipoDocumento.error ? {
                                        control: (base, state)=>({
                                            ...base,
                                            borderColor: 'red',
                                            boxShadow: 'red'
                                        })
                                    } : {}}
                                />
                                <label className='small text-danger'
                                       hidden={!this.errorTipoDocumento.error}>{this.errorTipoDocumento.mensaje}</label>
                            </div>
                        <div className="col-md-4 row-secction">
                                <label> Numero de Documento </label>
                                <input className={ errorHTML.classNameError(this.errorDocumento, 'form-control') }
                                       placeholder="Numero de Documento"
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento}/>
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Celular </label>
                                <input className={ errorHTML.classNameError(this.errorCelular, 'form-control') }
                                       placeholder="Celular"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}
                                />
                                {errorHTML.errorLabel(this.errorCelular)}
                            </div>

                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar}>
                    Guardar Cambio
                    </Button>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );


    }
}

export default EditarAdministrador;
