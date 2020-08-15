import { Database } from '../config/config';

//Expreciones regulares para las validaciones.
const NUMBER_REGEXP = /^\d*$/;
const DECIMAL_REGEXP = /^\d+(\.\d+){0,2}?$/;
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
const LETTERS_REGEXP = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
const LETTERS_NUMBER_REGEXP = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]*$/;
const DECIMAL_WITH_TWO_DIGITS_REGEXP = /^[0-9]+(.[0-9]{0,2})?$/;
const DECIMAL_10_DIG_BEFORE_3_DIG_AFTER_REGEXP = /^\d{0,10}(?:(?=\.)\.\d{0,3}|(?!\.))$/;
const DECIMAL_10_DIG_BEFORE_2_DIG_AFTER_REGEXP = /^\d{0,10}(?:(?=\.)\.\d{0,2}|(?!\.))$/;
const CUIT_REGEXP = /^\d{2}-\d{8}-\d{1}$/;
const NUMBER_ZERO = /^[0]+$/;
const NOMBRE_ARCHIVOS = /^(?!((con|prn|aux)((\.[^\\/:*"$•?<>|]{1,3}$)|$))|[\s\.])[^\\/:*"$•?<>|]{1,254}$/;
const LETRAS_REGEXP = /^[a-zA-Z ]*$/;


const ESTADOS_RESERVAS = ['Pendiente', 'En Curso', 'Cancelado', 'Realizado'];


// Se retorna TRUE si hay un error.. 
export const validator = {
    numero,
    requerido,
    mail,
    longitud,
    documento,
    fecha,
    soloLetras,
    soloLetrasNumeros,
    estadoReserva,
    obtenerFecha,
    validarMail,
    fechaRango,
    isValid,
    validarInvitado,
    validarInvitadoExistente
};


function numero(valor) {
    return {
        error: !NUMBER_REGEXP.test(valor),
        mensaje: 'Solo ingresar números'
    };
}


function requerido(valor) {
    return {
        error: (valor === '' || valor == null),
        mensaje: 'El campo es requerido'
    };
}

function mail(valor) {
    return EMAIL_REGEXP.test(valor) ? false : true;
}


function fecha(valor) {

    return {
        error: !(valor instanceof Object),
        mensaje: 'El formato de fecha debe ser: dd/mm/yyyy'
    };
}

function soloLetras(valor) {
    return {
        error: LETTERS_REGEXP.test(valor) ? false : true,
        mensaje: 'Solo ingresar letras'
    };
}

function soloLetrasNumeros(valor) {
    return {
        error: LETTERS_NUMBER_REGEXP.test(valor) ? false : true,
        mensaje: 'Solo ingresar valores alfanuméricos'
    };
}

function longitud(valor, longitud) {
    let error = (valor.length > longitud);
    return {
        error: error,
        mensaje: 'No debe superar los ' + longitud + ' caracteres'
    };
}

function documento(valor) {
    let error = (valor.length > 8 || valor.length < 7);
    return {
        error: error,
        mensaje: 'El documento debe tener entre 7 y 8 caracteres '
    };
}

function estadoReserva(desde, hasta, cancelado) {
    let hoy = new Date();
    if (cancelado) {
        return {Nombre: ESTADOS_RESERVAS[2], Id: 2};
    }
    if (desde < hoy && hasta > hoy) {
        return {Nombre: ESTADOS_RESERVAS[1], Id: 1};
    } else if (desde > hoy) {
        return {Nombre: ESTADOS_RESERVAS[0], Id: 0};
    } else {
        return {Nombre: ESTADOS_RESERVAS[3], Id: 3};
    }
}

function obtenerFecha(time) {
    if (!time){
        return new Date();
    }
    return (new Date(time.seconds * 1000));
}

async function validarMail(mail) {
    let valido = true;
    await Database.collection('Usuarios').doc(mail).get().then(doc=> {
        valido = !doc.exists;
    });
    return valido;
}

function fechaRango(desde, hasta, bool) {
    if (!desde || !hasta) {
        return {
            error: false,
            mensaje: ''
        };
    }
    if (desde >= hasta && bool) {
        return {
            error: true,
            mensaje: 'La fecha desde debe ser menor a la fecha hasta'
        };
    } else if (desde >= hasta) {
        return {
            error: true,
            mensaje: 'La fecha hasta debe ser mayor a la fecha desde'
        };
    } else {
        return {
            error: false,
            mensaje: ''
        };
    }

}

function isValid(errores) {
    let invalid = false;
    errores.map((error)=> {
        if (error.error) {
            invalid = true;
        }
    });
    return !invalid;
}

function validarInvitado(desde, hasta) {
    let hoy = new Date();
    return (validator.obtenerFecha(desde) <= hoy && validator.obtenerFecha(hasta) >= hoy);
}



function validarInvitadoExistente(desde, hasta) {
    let hoy = new Date();
    return (validator.obtenerFecha(desde) <= hoy && validator.obtenerFecha(hasta) >= hoy);
}
