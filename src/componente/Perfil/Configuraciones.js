import React, { Component } from 'react';
import firebase from 'firebase';
import Button from 'components/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Redirect } from 'react-router-dom';
import Firebase from 'firebase';
import { style } from "../../variables/Variables";
import NotificationSystem from "react-notification-system";
import {operacion} from "../Operaciones";


class Configuraciones extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pass: '',
            redirect: false
        };
        this.notificationSystem = React.createRef();
        this.ChangePass = this.ChangePass.bind(this);
    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
    }

    async reestablecer(){
         let newPassword = this.state.pass;
         await firebase.auth().currentUser.updatePassword(newPassword).then(() =>{
             this.setRedirect()
         }, error=> {
                 this.notificationSystem.current.addNotification(operacion.error(error.message));
        },)
        }

    setRedirect = async ()=> {
        await Firebase.auth().signOut().catch((error) => {
            this.notificationSystem.current.addNotification(operacion.error(error.message));
        });
        localStorage.clear();
        this.setState({
            redirect: true
        });
        
    };

    renderRedirect = ()=> {
        if (this.state.redirect) {
            this.setState({
                redirect: false
            });
            return <Redirect to='/'/>;
        }
    };

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
                            {this.renderRedirect()}
                                <Button bsStyle="default"  fill wd onClick={()=> {
                                    this.confirmar();
                                }}>Reestablecer</Button>
                            </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <NotificationSystem ref={this.notificationSystem} style={style}/>
                </div>
            </div>
        );
    }
}


export default Configuraciones;
