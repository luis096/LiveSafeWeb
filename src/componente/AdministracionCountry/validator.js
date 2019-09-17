import firebase from 'firebase';
import 'firebase/firestore';

const NUMBER_REGEXP = /^\d+$/;
const DECIMAL_REGEXP = /^\d+(\.\d+){0,2}?$/;
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
const LETTERS_REGEXP = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+/;
const DECIMAL_WITH_TWO_DIGITS_REGEXP = /^[0-9]+(.[0-9]{0,2})?$/;
const DECIMAL_10_DIG_BEFORE_3_DIG_AFTER_REGEXP = /^\d{0,10}(?:(?=\.)\.\d{0,3}|(?!\.))$/;
const DECIMAL_10_DIG_BEFORE_2_DIG_AFTER_REGEXP = /^\d{0,10}(?:(?=\.)\.\d{0,2}|(?!\.))$/;
const CUIT_REGEXP = /^\d{2}-\d{8}-\d{1}$/;
const NUMBER_ZERO = /^[0]+$/;

const NOMBRE_ARCHIVOS = /^(?!((con|prn|aux)((\.[^\\/:*"$•?<>|]{1,3}$)|$))|[\s\.])[^\\/:*"$•?<>|]{1,254}$/;

export const validator = {
    numero
    // mail,
    // requerido,
};

function numero(num) {
    return NUMBER_REGEXP.test(num) ? false : true;
}

