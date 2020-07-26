import React from 'react';
import { Database } from '../config/config';

const PERFILES = ['/Root/', '/Administradores/', '/Encargados/', '/Propietarios/'];
const DIAS = ['Lun', 'Mar','Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
const EstadosServicioSelect = [{value: true, label:'Disponible'}, {value: false, label:'No Disponible'}];
const MinutosReserva = [{value: 0, label:'0'}, {value: 30, label:'30'}];

export const constantes = {
    EstadosServicioSelect,
    MinutosReserva
};

export const operacion = {
    obtenerTiposDocumento,
    obtenerDocumentoLabel,
    obtenerReferenciaDocumento,
    obtenerMiReferencia,
    obtenerReferenciaConId,
    obtenerDisponibleString,
    esDiaDisponible,
    error,
    registroConExito
};

async function obtenerTiposDocumento() {
    let resultado = [];

    await Database.collection('TipoDocumento').get().then(querySnapshot=> {
        querySnapshot.forEach(doc=> {
            resultado.push(
                {value: doc.id, label: doc.data().Nombre}
            );
        });
    });

    return resultado;
}



function obtenerDocumentoLabel(id, value) {
    let resultado = '';
    value.map(doc=> {
        if (doc.value === id) {
            resultado = doc.label;
        }
    });
    return resultado;
}

function obtenerReferenciaDocumento(tipoDocumento) {
    let resultado = Database.doc('TipoDocumento/' + tipoDocumento.value);
    return resultado;
}


function obtenerMiReferencia(num) {
    let resultado = Database.doc('Country/' + localStorage.getItem('idCountry')
        + PERFILES[num] + localStorage.getItem('idPersona'));
    return resultado;
}

function obtenerReferenciaConId(num, id) {
    let resultado = Database.doc('Country/' + localStorage.getItem('idCountry')
        + PERFILES[num] + id);
    return resultado;
}

function obtenerDisponibleString(value){
    let resultado = '';
    value.map((dia, i)=>{
        if(dia){
            resultado += '-' + DIAS[i];
        }
    });
    return resultado;
}

function esDiaDisponible(dias, dia){
    let elementos = Object.assign([], dias);
    elementos.unshift(dias[6]);
    return !!elementos[dia];
}

function error(mensaje) {
    let obj = {
        title: <span data-notify="icon" className="pe-7s-bell"/>,
        message: (<div>{mensaje}</div>),
        level: "error",
        position: "br",
        autoDismiss: 15
        };
    return obj;
}


function registroConExito(mensaje) {
    let obj = {
        title: <span style={{color: "black"}} data-notify="icon" className="pe-7s-check"/>,
        message: (<div style={{color: "black"}}>{mensaje}</div>),
        level: "success",
        position: "br",
        autoDismiss: 2
    };
    return obj;
}
