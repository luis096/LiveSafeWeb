import React, {Component} from 'react';
import Select from 'react-select';
import {Database} from '../../config/config';
import {validator} from '../validator';
import Button from 'components/CustomButton/CustomButton.jsx';
import Datetime from 'react-datetime';
import {operacion} from '../Operaciones';
import {errorHTML} from '../Error';
import SweetAlert from 'react-bootstrap-sweetalert';
import {style} from "../../variables/Variables";
import NotificationSystem from "react-notification-system";
import Spinner from "react-spinner-material";
import "../Style/SpinnerAltas.scss"


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
            referenciaBaseDatos: '',
            loading: true
        };
        this.notificationSystem = React.createRef();
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
        this.errorCelular = {error: false, mensaje: ''};
        this.errorTipoDocumento = {error: false, mensaje: ''};
        this.errorFechaNacimiento = {error: false, mensaje: ''};
    }

    async componentDidMount() {
        const {tipoD, countryList} = this.state;
        await Database.collection('Country').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                countryList.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                );
            });
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });

        await Database.collectionGroup('Administradores')
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc.exists && doc.id === this.idAdministrador) {
                        this.setState({
                            referenciaBaseDatos: doc.ref.path,
                            nombre: doc.data().Nombre,
                            apellido: doc.data().Apellido,
                            documento: doc.data().Documento,
                            tipoDocumento: {
                                value: doc.data().TipoDocumento.id, label:
                                    operacion.obtenerDocumentoLabel(doc.data().TipoDocumento.id, tipoD)
                            },
                            fechaNacimiento: validator.obtenerFecha(doc.data().FechaNacimiento),
                            celular: doc.data().Celular
                        })
                    }
                });
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });

        this.setState({tipoD, countryList, loading: false});
    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
        if (event.target.value === "") {
            this.errorNombre = validator.requerido(event.target.value)
        } else {
            this.errorNombre = validator.soloLetrasNumeros(event.target.value)
        }
    }

    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
        if (event.target.value === "") {
            this.errorApellido = validator.requerido(event.target.value)
        } else {
            this.errorApellido = validator.soloLetrasNumeros(event.target.value)
        }
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        if (event.target.value === "") {
            this.errorCelular = validator.requerido(event.target.value)
        } else {
            this.errorCelular = validator.numero(event.target.value)
        }
        if (!event.target.value) return;
        this.errorCelular = validator.longitud(event.target.value, 10);
    }

    ChangeDocumento(event) {
        this.setState({documento: event.target.value});
        if (event.target.value === "") {
            this.errorDocumento = validator.requerido(event.target.value)
        } else {
            this.errorDocumento = validator.numero(event.target.value)
        }
        if (!event.target.value) return;
        this.errorDocumento = validator.documento(event.target.value);
    }

    ChangeSelect(value) {
        this.setState({tipoDocumento: value});
    }

    ChangeFechaNacimiento(event) {
        this.setState({fechaNacimiento: event});
        this.errorFechaNacimiento = validator.fecha(event);
    }


    async registrar() {
        this.setState({loading: true});
        let e = false;

        await Database.doc(this.state.referenciaBaseDatos).update({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Documento: this.state.documento,
            Celular: this.state.celular,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.value),
            FechaNacimiento: new Date(this.state.fechaNacimiento)
        }).catch((error) => {
            e = true;
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        this.setState({loading: false});
        if (e) return;
        this.notificationSystem.current.addNotification(
            operacion.registroConExito("Los cambios se guardaron con exito"));
    }

    FormInvalid() {

        let invalid = (this.errorNombre.error || this.errorApellido.error ||
            this.errorDocumento.error || this.errorCelular.error || this.errorFechaNacimiento.error);

        if (!invalid) {
            invalid = (!this.state.nombre || !this.state.apellido ||
                !this.state.fechaNacimiento || !this.state.documento ||
                !this.state.celular || !this.state.tipoDocumento);
        }

        if (!invalid) {
            invalid = (!this.state.tipoDocumento.value);
        }

        return invalid;
    }

    render() {
        return (
            <div className={this.state.loading ? "col-12 form" : "col-12"}>
                <legend><h3 className="row">Editar Administrador</h3></legend>
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Nombre (*)</label>
                                <input className={errorHTML.classNameError(this.errorNombre, 'form-control')}
                                       placeholder="Nombre"
                                       type="text"
                                       maxLength={50}
                                       value={this.state.nombre}
                                       onChange={this.ChangeNombre}
                                />
                                {errorHTML.errorLabel(this.errorNombre)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Apellido (*)</label>
                                <input className={errorHTML.classNameError(this.errorApellido, 'form-control')}
                                       placeholder="Apellido"
                                       type="text"
                                       maxLength={50}
                                       value={this.state.apellido}
                                       onChange={this.ChangeApellido}/>
                                {errorHTML.errorLabel(this.errorApellido)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Fecha de Nacimiento (*)</label>
                                <Datetime className={errorHTML.classNameErrorDate(this.errorFechaNacimiento)}
                                    inputProps={{placeholder: 'Fecha de Nacimiento'}}
                                    timeFormat={false}
                                    value={this.state.fechaNacimiento}
                                    onChange={this.ChangeFechaNacimiento}
                                />
                                {errorHTML.errorLabel(this.errorFechaNacimiento)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Tipo de Documento (*)</label>
                                <Select
                                    isSearchable={true}
                                    options={this.state.tipoD}
                                    value={this.state.tipoDocumento}
                                    onChange={this.ChangeSelect.bind(this)}
                                    styles={this.errorTipoDocumento.error ? {
                                        control: (base, state) => ({
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
                                <label> Número de Documento (*)</label>
                                <input className={errorHTML.classNameError(this.errorDocumento, 'form-control')}
                                       placeholder="Número de Documento"
                                       type="number"
                                       value={this.state.documento}
                                       onChange={this.ChangeDocumento}/>
                                {errorHTML.errorLabel(this.errorDocumento)}
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Celular (*)</label>
                                <input className={errorHTML.classNameError(this.errorCelular, 'form-control')}
                                       placeholder="Celular"
                                       type="number"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}
                                />
                                {errorHTML.errorLabel(this.errorCelular)}
                            </div>

                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Button bsStyle="primary" fill wd onClick={this.registrar} disabled={this.FormInvalid()}>
                        Guardar cambios
                    </Button>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
                <div className="spinnerAlta" hidden={!this.state.loading}>
                    <Spinner radius={80} color={'black'}
                             stroke={5}/>
                </div>
            </div>
        );


    }
}

export default EditarAdministrador;
