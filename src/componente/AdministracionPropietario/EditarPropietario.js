import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import {Database} from "../../config/config";
import {Link} from "react-router-dom"

class EditarPropietario extends Component{

    constructor(props){
        super(props);
        this.state = {
            propietario: [], 
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            titular: '',
            telefonoFijo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            usuario: '',
            idTipoPersona: '',
            idCountry: '',

            tipoD: [],// Para cargar el combo
            temp: '', 
            resultado: ''
        }
        this.editPropietario = this.editPropietario.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeRadio  = this.ChangeRadio.bind(this);
        this.ChangeTelefonoFijo = this.ChangeTelefonoFijo.bind(this);
        this.registrar = this.registrar.bind(this);

        this.idTD = '';
        const url = this.props.location.pathname.split('/');
        this.idPropietario  = url[url.length - 1];
    }

    async componentDidMount(){
        const { tipoD, propietario} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, name: doc.data().Nombre}
                )
            });
        });
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(this.idPropietario).get()
            .then(doc => {
                if (doc.exists) {
                    this.state.propietario.push(doc.data());
                }
            })
            .catch(err => {
                //En caso de error, hacer esto...
            })
        this.setState({tipoD});
        this.setState({propietario});
        const estrella = this.state.propietario[0];

        await Database.collection('TipoDocumento').doc(estrella.TipoDocumento.id).get()
            .then(doc => {
                if (doc.exists) {
                    
                    this.state.tipoDocumento = {value : doc.id, name : doc.data().Nombre}
                
                 }
            })
        this.setState({
            nombre: estrella.Nombre,
            apellido: estrella.Apellido,
            titular: estrella.Titular?'Si':'No',
            documento: estrella.Documento,
            fechaNacimiento: estrella.FechaNacimiento,
            fechaAlta: estrella.FechaAlta,
            telefonoFijo: estrella.TelefonoFijo,
            celular : estrella.Celular,
            descripcion: estrella.Descripcion,
            usuario: estrella.Usuario,
        })
    }
 

    editPropietario(){
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(this.idPropietario).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Titular: this.state.titular=== 'Si'?true:false,
            Celular: this.state.celular,
            TelefonoFijo: this.state.telefonoFijo,
            Descripcion: this.state.descripcion,
            TipoDocumento: this.state.tipoDocumento,
            Documento: this.state.documento,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: this.state.fechaAlta,
            Usuario: this.state.usuario,
        });

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }
    ChangeNumero(event) {
        this.setState({numero: event.target.value});
    }
    ChangeTelefonoFijo(event) {
        this.setState({telefonoFijo: event.target.value});
    }
    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
    }
    ChangeCelular(event) {
        this.setState({celular : event.target.value});
    }
    ChangeDescripcion(event) {
        this.setState({descripcion : event.target.value});
    }

    ChangeSelect(event){
        this.setState({tipoDocumento : event.target.value});
    }
    ChangeFechaNacimiento(event){
        this.setState({fechaNacimiento : event.target.value});
    }

    ChangeRadio(event){
        this.setState({titular: event.currentTarget.value})
    }

    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.editPropietario();
        }
    }

    render(){
        return(
            <div className="col-12 ">
                <div>
                    <div className="row">
                        <legend> Editar Propietario </legend>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "Nombre">  Nombre  </label>
                            <input type = "name" className = "form-control"   placeholder = "Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "Apellido">  Apellido  </label>
                            <input type = "family-name" className = "form-control"   placeholder = "Surname"
                                   value={this.state.apellido}
                                   onChange= {this.ChangeApellido} />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                        <label for = "TipoDocumento">  Tipo de Documento  </label>
                            <Select
                                className="select-documento"
                                value={this.state.tipoDocumento}
                                classNamePrefix="Select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.tipoD}
                                onChange={this.ChangeSelect.bind(this)}
                            />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "NumeroDocumento">  Numero de Documento  </label>
                            <input type = "document" className = "form-control"   placeholder = "Document number"
                            value={this.state.documento}
                            onChange= {this.ChangeDocumento}/>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "FechaNacimiento">  Fecha de Nacimiento  </label>
                            <input type="date"className = "form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   value={this.state.fechaNacimiento}
                                   onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                        <fieldset className = "col-md-6  flex-container form-group">
                            <legend>  Titular  </legend>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input"  
                                    value = 'Si' checked={this.state.titular === 'Si'}
                                    onChange={this.ChangeRadio} />
                                    Si
                                </label>
                            </div>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input" value = 'No'
                                    onChange={this.ChangeRadio} checked={this.state.titular === 'No'} />
                                    No
                                </label>
                            </div>
                        </fieldset>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "NumeroCelular">  Celular  </label>
                            <input type = "tel" className = "form-control"   placeholder = "Mobile number"
                                   value={this.state.celular}
                                   onChange= {this.ChangeCelular} />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "NumeroTelefono">  Telefono Fijo  </label>
                            <input type = "tel" className = "form-control"   placeholder = "Landline number"
                            value={this.state.telefonoFijo}
                            onChange= {this.ChangeTelefonoFijo} />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "exampleTextarea"> Descripcion  </ label >
                            <textarea className = "form-control" id = "exampleTextarea" rows = "3"
                            value={this.state.descripcion}
                            onChange= {this.ChangeDescripcion} > </textarea>
                        </div>
                    </div>
                    <div className="form-group izquierda">
                        <Link to="/" type="button" className="btn btn-primary"
                        >Volver</Link> 
                            <button className="btn btn-primary" onClick={this.registrar} >Registrar</button>
                    </div>
                </div>
            </div>
        )


    }
}
export default EditarPropietario;