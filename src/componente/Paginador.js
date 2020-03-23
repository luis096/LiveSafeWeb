import { Database } from '../config/config';

const TAMANIO_PAGINA = 10;

export const paginador = {
    paginar,
    cantidad,
    getTamPagina
};

async function paginar(con, total, totalNum, nueva, cantidad, paginaActual, paginaNueva, principio, fin) {

    let pagina = {
        elementos: [],
        numPagina: 0,
        cantidad: cantidad,
        primerDoc: principio,
        ultimoDoc: fin,
        total: totalNum
    };

    if (nueva) {
        fin = [];
        principio = [];
        paginaActual = -1;
    }

    if (paginaNueva > 0) {
        if (paginaNueva > paginaActual) {
            let ultimo = fin[paginaActual];
            con = con.startAfter(ultimo);
        } else {
            let primero = principio[paginaNueva];
            con = con.startAt(primero);
        }
    }

    if (nueva) {
        await total.get().then((doc)=> {
             pagina.total = doc.docs.length;
        });
    }

    let ultimoElemento = null;
    let primerElemento = null;
    await con.get().then(querySnapshot=> {
        querySnapshot.forEach(doc=> {
            if (!primerElemento) {
                primerElemento = doc;
            }
            ultimoElemento = doc;
            pagina.elementos.push( [doc.data(), doc.id] );
        });
    });

    if ((paginaNueva > paginaActual || paginaActual < 0) && !fin[paginaNueva]) {
        pagina.ultimoDoc.push(ultimoElemento);
        pagina.primerDoc.push(primerElemento);
    }
    if (!cantidad.length) {
        pagina.cantidad = paginador.cantidad(pagina.total);
    } else {
        pagina.cantidad = cantidad;
    }
    return pagina;
}

function cantidad(tam) {
    let array = [];
    for (let i = 0; i < (tam / TAMANIO_PAGINA); i++) {
        array.push(i);
    }
    return (array);
}

function getTamPagina() {
    return (TAMANIO_PAGINA);
}
