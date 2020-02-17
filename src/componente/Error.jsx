import React from 'react';
import { validator } from './validator';
import SweetAlert from 'react-bootstrap-sweetalert';



const ERROR = ' error';
const ERROR_DATE = ' has-error';

export const errorHTML = {
    classNameError,
    classNameErrorDate,
    errorLabel,
    errorAlert
};

function classNameError(value, clase) {
    let resultado = clase;
    if (value.error) {
        resultado += ERROR;
    }
    return resultado;
}

function classNameErrorDate(value, clase) {
    let resultado = clase;
    if (value.error) {
        resultado += ERROR_DATE;
    }
    return resultado;
}

function errorLabel(value) {
    if (value.error) {
        return <label className='small text-danger'>{value.mensaje}</label> ;
    }
    return <></>;
}

function errorAlert(value, accion) {
    if (!validator.isValid(value)){
        return (
            <SweetAlert
                style={{display: 'block', marginTop: '-100px', position: 'center'}}
                title="Error"
                onConfirm={()=>{return null;}}
                confirmBtnBsStyle="danger"
                openAnim
                closeAnim
            >
                Hay errores en los filtros.
            </SweetAlert>
        )
    } else {
        return null;
    }
}