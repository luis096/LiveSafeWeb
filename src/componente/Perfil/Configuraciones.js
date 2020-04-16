import React, { Component } from 'react';
import firebase from 'firebase';
import Button from 'components/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';

class Configuraciones extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pass: ''
        };
        this.ChangePass = this.ChangePass.bind(this);
    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
    }

    reestablecer(){
         let newPassword = this.state.pass;
         debugger
         firebase.auth().currentUser.updatePassword(newPassword).then(() =>{
             this.hideAlert()
         }, error=> {
            console.log(error.message);
        },)
        }

    hideAlert() {
        this.setState({
            alert: null
        });
    }
        
    confirmar(){
        this.setState({
            alert: (
                <SweetAlert
                    warning
                    style={{display: 'block', marginTop: '-100px', position: 'center'}}
                    title="¿Estas seguro?"
                    onConfirm={()=>this.reestablecer()}
                    onCancel={()=>this.hideAlert()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                    confirmBtnText="Si, estoy seguro"
                    cancelBtnText="Cancelar"
                    showCancel
                >
                    ¿Esta seguro de que desea cambiar la conytraseña?
                </SweetAlert>
            )
        });
    }
    

    render() {
        return (
            <div className="col-12">
                {this.state.alert}
                <div className="row card">
                    <div className="card-body">
                        <legend><h3 className="row"><i className="pe-7s-tools"/> Configuraciones</h3></legend>
                        <div className="row">
                        <h4><strong style={{paddingLeft: "18px"}}>Cambiar mi contraseña</strong></h4>
                            <div className="col-12 row-secction">  
                            <div className="col-md-6">
                                <input className='form-control'
                                       value={this.state.pass}
                                       onChange={this.ChangePass} placeholder="Nueva contraseña"/>
                            </div>
                            <div className="col-md-6">
                                <Button bsStyle="default"  fill wd onClick={()=> {
                                    this.confirmar();
                                }}>Reestablecer</Button>
                            </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Configuraciones;
