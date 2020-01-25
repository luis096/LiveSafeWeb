import { Database } from '../config/config';

const TAMANIO_PAGINA = 10;

export const paginador = {
    paginar,
    cantidad,
    getTamPagina
};

async function paginar(coneccion, arrayCondiciones, arrayValores, nueva, cantidad, paginaActual, paginaNueva, principio, fin) {

    let total = coneccion;
    let con = coneccion.limit(paginador.getTamPagina());
    let pagina = {
        elementos: [],
        numPagina: 0,
        cantidad: [],
        primerDoc: principio,
        ultimoDoc: fin,
        total: 0
    };

    if (paginaNueva > 0) {
        if (paginaNueva > paginaActual) {
            let ultimo = fin[paginaActual];
            con = con.startAfter(ultimo);
        } else {
            let primero = principio[paginaNueva];
            con = con.startAt(primero);
        }
    }

    arrayValores.map((value, i) => {
        if (value) {
            con = con.where(arrayCondiciones[i].atributo, arrayCondiciones[i].condicion, value);
            total = total.where(arrayCondiciones[i].atributo, arrayCondiciones[i].condicion, value);
        }
    });


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

    if ((paginaNueva > paginaActual || paginaActual < 0) && !pagina.ultimoDoc[paginaNueva]) {
        pagina.ultimoDoc.push(ultimoElemento);
        pagina.primerDoc.push(primerElemento);
    }
    if (cantidad) {
        pagina.cantidad = paginador.cantidad(pagina.total);
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
