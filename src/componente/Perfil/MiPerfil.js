import React, { Component } from 'react';
import { Database } from 'config/config';
import Button from 'components/CustomButton/CustomButton.jsx';
import {errorHTML} from "../Error";
import {validator} from "../validator";
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";
import {operacion} from "../Operaciones";
import Configuraciones from "./Configuraciones";

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
            tipoDocumentoNombre: ''
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
                    fechaNacimiento: doc.data().FechaNacimiento,
                    mail: doc.data().Usuario
                });
            }
        }).catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
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

    actualizar() {
        this.datos.update({
            Celular: this.state.celular,
        });
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
        this.errorCelular = validator.numero(event.target.value);
    }

    render() {
        return (
            <div className="col-12">
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
                                       value={validator.obtenerFecha(this.state.fechaNacimiento).toLocaleDateString()}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 row-secction">
                                <label> Numero de Documento </label>
                                <input className="form-control" readOnly
                                       placeholder="Numero de Documento"
                                       value={this.state.documento}/>
                            </div>
                            <div className="col-md-4 row-secction">
                                <label> Tipo de Documento </label>
                                <input className="form-control" readOnly
                                    placeholder="Numero de Documento"
                                    value={this.state.tipoDocumentoNombre}/>

                            </div>
                            <div className="col-md-3 row-secction">
                                <label> Celular </label>
                                <input className={ errorHTML.classNameError(this.errorCelular, 'form-control') }
                                       placeholder="Celular"
                                       value={this.state.celular}
                                       onChange={this.ChangeCelular}
                                />
                                {errorHTML.errorLabel(this.errorCelular)}
                            </div>
                            <div className="col-md-1 row-secction">
                                <br/>
                                <Button bsStyle="primary" fill onClick={this.actualizar}>
                                    Guardar
                                </Button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <label> Dirección de correo electrónico </label>
                                <input type="email" className="form-control" readOnly
                                       placeholder="ingrese el mail"
                                       value={this.state.mail}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Configuraciones></Configuraciones>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}

export default MiPerfil;
