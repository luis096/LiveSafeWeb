import React, { Component } from 'react';
import "../Style/Alta.css";
import { Database, Firebase } from '../../config/config';
import { Link } from 'react-router-dom';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import ReactDOM from "react-dom";
import { Textbox } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./styles.css";

const Icon = () => (
	<svg
	  className="svg-icon"
	  width="20"
	  height="20"
	  viewBox="0 0 20 20"
	  style={{ verticleAlign: "middle" }}
	>
	  <path
		fill="#000"
		d="M12.443,9.672c0.203-0.496,0.329-1.052,0.329-1.652c0-1.969-1.241-3.565-2.772-3.565S7.228,6.051,7.228,8.02c0,0.599,0.126,1.156,0.33,1.652c-1.379,0.555-2.31,1.553-2.31,2.704c0,1.75,2.128,3.169,4.753,3.169c2.624,0,4.753-1.419,4.753-3.169C14.753,11.225,13.821,10.227,12.443,9.672z M10,5.247c1.094,0,1.98,1.242,1.98,2.773c0,1.531-0.887,2.772-1.98,2.772S8.02,9.551,8.02,8.02C8.02,6.489,8.906,5.247,10,5.247z M10,14.753c-2.187,0-3.96-1.063-3.96-2.377c0-0.854,0.757-1.596,1.885-2.015c0.508,0.745,1.245,1.224,2.076,1.224s1.567-0.479,2.076-1.224c1.127,0.418,1.885,1.162,1.885,2.015C13.961,13.689,12.188,14.753,10,14.753z M10,0.891c-5.031,0-9.109,4.079-9.109,9.109c0,5.031,4.079,9.109,9.109,9.109c5.031,0,9.109-4.078,9.109-9.109C19.109,4.969,15.031,0.891,10,0.891z M10,18.317c-4.593,0-8.317-3.725-8.317-8.317c0-4.593,3.724-8.317,8.317-8.317c4.593,0,8.317,3.724,8.317,8.317C18.317,14.593,14.593,18.317,10,18.317z"
	  />
	</svg>
  );

class AltaCountry extends Component{
				
		constructor(){
			super();
			this.state = {
				nombre: '',
				calle: '',
				numero: '',
				titular: '',
				celular: '',
				descripcion: '',
				resultado: '',
				picture: '',
                upLoadValue: 0,

			}
		this.addCountry = this.addCountry.bind(this);
		this.ChangeNombre = this.ChangeNombre.bind(this);
		this.ChangeCalle = this.ChangeCalle.bind(this);
		this.ChangeNumero = this.ChangeNumero.bind(this);
		this.ChangeTitular = this.ChangeTitular.bind(this);
		this.ChangeCelular = this.ChangeCelular.bind(this);
		this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
		this.handleFiles = this.handleFiles.bind(this);
		this.registrar = this.registrar.bind(this);

		}


	addCountry(){
		Database.collection('Country').add({
			Nombre: this.state.nombre,
			Calle: this.state.calle,
			Numero: this.state.numero,
			Titular: this.state.titular,
			Celular: this.state.celular,
			Descripcion: this.state.descripcion,
			Foto: this.state.picture,
		});

	}

    handleFiles(event){
       const file = event.target.files[0];
       const storageRef = Firebase.storage().ref(`/Img/Country/${file.name}`)
		const task = storageRef.put(file);
       task.on('state_changed', snapshot => {
       	let porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       	this.setState({
       		upLoadValue: porcentaje
       	})
	   }, error => {console.log(error.message)
	   }, () =>{
       	this.setState({ upLoadValue: 100,
					picture: task.snapshot.downloadURL,
       	})
		   })
 	}
	ChangeNombre(event) {
					this.setState({nombre : event.target.value});
	}
	ChangeCalle(event) {
					this.setState({calle: event.target.value});
			}
	ChangeNumero(event) {
					this.setState({numero: event.target.value});
	}

	ChangeCelular(event) {
		this.setState({celular : event.target.value});
}
ChangeTitular(event) {
	this.setState({titular : event.target.value});
}
ChangeDescripcion(event) {
	this.setState({descripcion : event.target.value});
}	

registrar(){
	//Agregar validaciones para no registrar cualquier gilada
	if(true){
		this.addCountry();
		this.setState({
			nombre: '',
			calle: '',
			numero: '',
			titular: '',
			celular: '',
			descripcion: '',
			resultado: 'Se registro con exito',
		})
	}
}


    render(){

        return(
			<ValidatorForm
			ref="form"
      		onError={errors => console.log("hola",errors)}
      		onSubmit={this.registrar}
			>
            <div className="col-12">
            <div className="col-md-12 ">
			<div className="row">
				<legend>  Registrar Alta de un Country </legend>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control "   
            label = "Nombre del Country (*)"
						value={this.state.nombre}
						validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeNombre}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Nombre del Titular (*)"
            value={this.state.titular}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeTitular}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Calle (*)"
            value={this.state.calle}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeCalle}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Celular (*)"
            value={this.state.celular}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeCelular}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Altura (*)"
            value={this.state.numero}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeNumero}/>
					</div>
					
					
					<div className = "col-md-6  flex-container form-group">
            <TextValidator className = "form-control" id = "exampleTextarea" rows = "3"  
              label = "Descripcion"
              value = {this.state.descripcion}
              onChange={this.ChangeDescripcion}> 
            </TextValidator>
          </div>
				<div>
						<span>
							<strong>{this.state.resultado}</strong>
						</span>
					</div>
          </div>

		  	<div className="col-md-6  flex-container form-group">
				<progress value={this.state.upLoadValue} max='100'>
                    {this.state.upLoadValue}%
				</progress>

                <input type="file" onChange={this.handleFiles}/>

                <img width="320" src={this.state.picture}/>

			</div>



          	<div className="form-group izquierda">
			      <button className="btn btn-primary boton" type="submit">Registrar</button> 
            <Link to="/" type="button" className="btn btn-primary boton">Volver</Link>                 
		    </div>
        </div>
		
      </div>
	  </ValidatorForm>
        
        );
    }
}

export default AltaCountry;