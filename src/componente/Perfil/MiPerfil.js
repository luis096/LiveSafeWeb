import React, { Component } from 'react';
import { Database } from 'config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import {errorHTML} from "../Error";
import {validator} from "../validator";
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";
import {operacion} from "../Operaciones";
import Configuraciones from "./Configuraciones";
import Spinner from "react-spinner-material";
import "../Style/SpinnerAltas.scss";

class MiPerfil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            mail: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            telefono: '',
            celular: '',
            fechaNacimiento: '',
            tipoDocumentoNombre: '',
            loading: false,
            carga: true,
        };
        this.notificationSystem = React.createRef();
        this.actualizar = this.actualizar.bind(this);
        this.consultar = this.consultar.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.datos = {};
        this.errorCelular= {error:false, mensaje:''};
    }

    async componentDidMount() {
        const user = localStorage.getItem('tipoUsuario');
        switch (user) {
            case 'Root':
                this.datos = Database.collection('Root').doc(localStorage.getItem('idPersona'));
                break;
            case 'Administrador':
                this.datos = Database.collection('Country').doc(localStorage.getItem('idCountry'))
                    .collection('Administradores').doc(localStorage.getItem('idPersona'));
                break;
            case 'Propietario':
                this.datos = Database.collection('Country').doc(localStorage.getItem('idCountry'))
                    .collection('Propietarios').doc(localStorage.getItem('idPersona'));
                break;
            case 'Encargado':
                this.datos = Database.collection('Country').doc(localStorage.getItem('idCountry'))
                    .collection('Encargados').doc(localStorage.getItem('idPersona'));
                break;
        }
        await this.consultar();
    }

    async consultar() {
        let id = 0;
        await this.datos.get().then(doc=> {
            if (doc.exists) {
                id = doc.data().TipoDocumento.id;
                this.setState({
                    nombre: doc.data().Nombre,
                    apellido: doc.data().Apellido,
                    celular: doc.data().Celular,
                    telefono: doc.data().Telefono,
                    documento: doc.data().Documento,
                    tipoDocumento: doc.data().TipoDocumento,
                    fechaNacimiento: validator.obtenerFecha(doc.data().FechaNacimiento),
                    mail: doc.data().Usuario
                });
            }
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        this.setState({carga: false});
        if (!id) return;
        await Database.collection('TipoDocumento').doc(id).get()
            .then(doc=> {
                if (doc.exists) {
                    this.setState({tipoDocumentoNombre: doc.data().Nombre});
                }
            }).catch((error) => {
                this.notificationSystem.current.addNotification(operacion.error(error.message));
            });
    }

    async actualizar() {
        this.setState({loading: true});
        let e = false;
        await this.datos.update({
            Celular: this.state.celular,
        }).catch((error) => {
            e = true;
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        this.setState({loading: false});
        if (e) return;
        this.notificationSystem.current.addNotification(
            operacion.registroConExito("Los cambios se guardaron con exito"));
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

    FormInvalid() {

        let invalid = (this.errorCelular.error);

        if (!invalid) {
            invalid = (!this.state.celular);
        }

        return invalid;
    }

    render() {
        return (
            <div className={this.state.carga ? "col-12 form" : "col-12"}>
                <legend><h3 className="row">Mi Perfil</h3></legend>
                <div className="row card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Nombre </label>
                                <input type="name"
                                       className="form-control" readOnly
                                       placeholder="Nombre"
                                       value={this.state.nombre}
                                />
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Apellido </label>
                                <input className="form-control" readOnly
                                       placeholder="Apellido"
                                       value={this.state.apellido}/>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Fecha de Nacimiento </label>
                                <input className="form-control" readOnly
                                       placeholder="Fecha de Nacimiento"
                                       value={this.state.fechaNacimiento}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Número de Documento </label>
                                <input className="form-control" readOnly
                                       placeholder="Número de Documento"
                                       value={this.state.documento}/>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Tipo de Documento </label>
                                <input className="form-control" readOnly
                                    placeholder="Número de Documento"
                                    value={this.state.tipoDocumentoNombre}/>

                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Dirección de correo electrónico </label>
                                <input type="email" className="form-control" readOnly
                                       placeholder="ingrese el mail"
                                       value={this.state.mail}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Celular (*)</label>
                                <input className={ errorHTML.classNameError(this.errorCelular, 'form-control') }
                                       placeholder="Celular"
                                       type="number"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}
                                />
                                {errorHTML.errorLabel(this.errorCelular)}
                            </div>
                            <div style={{marginTop:'5px'}} className="col-md-4 row-secction">
                                <br/>
                                <Button bsStyle="primary" fill onClick={this.actualizar} disabled={this.FormInvalid()}>
                                    { this.state.loading ? (
                                            <Spinner radius={20} color={'black'} stroke={2} />
                                        ) : "Guardar"
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Configuraciones></Configuraciones>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
                <div className="spinnerAlta" hidden={!this.state.carga}>
                    <Spinner radius={80} color={'black'}
                             stroke={5}/>
                </div>
            </div>
        );
    }
}

export default MiPerfil;
