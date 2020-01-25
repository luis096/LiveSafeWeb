import React from 'react';


const ERROR = ' error';
const ERROR_DATE = ' has-error';

export const errorHTML = {
    classNameError,
    classNameErrorDate,
    errorLabel
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