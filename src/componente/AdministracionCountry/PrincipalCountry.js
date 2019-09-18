import React, { Component } from 'react';
import { Database } from '../../config/config';
import '../Style/Alta.css';
import { Link } from 'react-router-dom';
import Country from './Country';
import { Datatable } from '@o2xp/react-datatable';
import {
    FreeBreakfast as CoffeeIcon,
    CallSplit as CallSplitIcon
} from '@material-ui/icons';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import { chunk } from 'lodash';


class PrincipalCountry extends Component {

    constructor() {
        super();
        this.state = {
            barrios: [],
            filas: {
                title: '',
                dimensions: {
                    datatable: {
                        width: '90vw',
                        height: '500px'
                    },
                    row: {
                        height: '70px'
                    }
                },
                keyColumn: 'idCountry',
                font: 'Arial',
                data: {
                    columns: [
                        {
                            id: 'idCountry',
                            label: 'idCountry',
                            editable: false
                        },
                        {
                            id: 'nombre',
                            label: 'Nombre',
                            editable: true,
                            dataType: 'text',
                            inputType: 'input'
                        },
                        {
                            id: 'calle',
                            label: 'Calle',
                            editable: true,
                            dataType: 'text',
                            inputType: 'input'
                        },
                        {
                            id: 'numero',
                            label: 'Numero',
                            editable: true,
                            dataType: 'number'
                            // valueVerification: val => {
                            //     let error = val > 100 ? true : false;
                            //     let message = val > 100 ? "Value is too big" : "";
                            //     return {
                            //         error: error,
                            //         message: message
                            //     };
                            // }
                        },
                        {
                            id: 'titular',
                            label: 'Titular',
                            editable: true,
                            dataType: 'text'
                            // inputType: "checkbox"
                        },
                        {
                            id: 'celular',
                            label: 'Celular',
                            editable: true,
                            dataType: 'number'
                        }
                        // {
                        //     id: "birthDate",
                        //     label: "birth date",
                        //     colSize: "120px",
                        //     editable: true,
                        //     dataType: "date",
                        //     inputType: "datePicker",
                        //     dateFormat: "YYYY-MM-DDTHH:MM:ss"
                        // },
                        // {
                        //     id: "color",
                        //     label: "color",
                        //     colSize: "100px",
                        //     editable: true,
                        //     inputType: "select",
                        //     values: ["green", "blue", "brown"]
                        // },
                        // {
                        //     id: "creditCard",
                        //     label: "Credit Card",
                        //     colSize: "150px",
                        //     editable: true,
                        //     inputType: "input",
                        //     mask: [
                        //         /\d/,
                        //         /\d/,
                        //         /\d/,
                        //         /\d/,
                        //         " ",
                        //         /\d/,
                        //         /\d/,
                        //         /\d/,
                        //         /\d/,
                        //         " ",
                        //         /\d/,
                        //         /\d/,
                        //         /\d/,
                        //         /\d/,
                        //         " ",
                        //         /\d/,
                        //         /\d/,
                        //         /\d/,
                        //         /\d/
                        //     ]
                        // }
                    ],
                    // rows: [
                    //     {
                    //         id: "50cf",
                    //         age: 28,
                    //         name: "Kerr Mayo",
                    //         adult: true,
                    //         birthDate: "1972-09-04T11:09:59",
                    //         color: "green",
                    //         creditCard: "4478 7842 2486 8743"
                    //     },
                    //     {
                    //         id: "209",
                    //         age: 34,
                    //         name: "Freda Bowman",
                    //         adult: true,
                    //         birthDate: "1988-03-14T09:03:19",
                    //         color: "blue",
                    //         creditCard: "7845 5789 4236 7861"
                    //     },
                    //     {
                    //         id: "2dd81ef",
                    //         age: 14,
                    //         name: "Becky Lawrence",
                    //         adult: false,
                    //         birthDate: "1969-02-10T04:02:44",
                    //         color: "green",
                    //         creditCard: ""
                    //     },
                    //     {
                    //         id: "2sdf456",
                    //         age: 19,
                    //         name: "Lucas Michel",
                    //         adult: true,
                    //         birthDate: "1985-09-10T04:02:44",
                    //         color: "blue",
                    //         creditCard: "4567 7894 4388 9642"
                    //     },
                    //     {
                    //         id: "qsf24fe5",
                    //         age: 35,
                    //         name: "Jean Vaillant",
                    //         adult: true,
                    //         birthDate: "1985-10-25T04:02:44",
                    //         color: "green",
                    //         creditCard: ""
                    //     }
                    // ]
                    rows: [
                    ]
                },
                features: {
                    canEdit: false,
                    canDelete: true,
                    canPrint: false,
                    canDownload: false,
                    canSearch: true,
                    canRefreshRows: true,
                    canOrderColumns: false,
                    canSelectRow: false,
                    canSaveUserConfiguration: false,
                    userConfiguration: {
                        columnsOrder: ['idCountry', 'nombre', 'calle', 'numero', 'titular', 'celular'],
                        copyToClipboard: false
                    },
                    rowsPerPage: {
                        available: [10, 25, 50, 100],
                        selected: 50
                    },
                    additionalIcons: [
                        {
                            title: 'Agregar un Country',
                            icon: <AddCircleIcon className='primary' ></AddCircleIcon>,
                            onClick: ()=>alert('Coffee Time!')
                        }
                    ],
                    // selectionIcons: [
                    //     {
                    //         title: 'Selected Rows',
                    //         icon: <AddCircleIcon></AddCircleIcon>,
                    //         onClick: rows=>console.log(rows)
                    //     }
                    // ]
                }
            },
        };
        
    }


    actionsRow = ({type, payload})=> {
        console.log(type);
        console.log(payload);
    };

    refreshRows = ()=> {
        const {rows} = this.state.filas.data;
        const randomRows = Math.floor(Math.random() * rows.length) + 1;
        const randomTime = Math.floor(Math.random() * 4000) + 1000;
        const randomResolve = Math.floor(Math.random() * 10) + 1;
        return new Promise((resolve, reject)=> {
            setTimeout(()=> {
                if (randomResolve > 3) {
                    resolve(chunk(rows, randomRows)[0]);
                }
                reject(new Error('err'));
            }, randomTime);
        });
    };


    async componentWillMount() {
        const {barrios, filas} = this.state;
        await Database.collection('Country').get().then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
                filas.data.rows.push(
                    // [doc.data(),doc.id]
                    {
                        idCountry: doc.id,
                        nombre: doc.data().Nombre,
                        calle: doc.data().Calle,
                        numero: doc.data().Numero,
                        titular: doc.data().Titular,
                        celular: doc.data().Celular
                    }
                );
            });
        });
        this.setState({barrios});
        // this.state.filas.data.rows= [barrios];

    }
    


    render() {
            return (
                <div className="col-12">
                            <label className="h2">Country</label>
                        <Datatable
                    options={this.state.filas}
                    refreshRows={this.refreshRows}
                    actions={this.actionsRow}
                />  
                </div>
            );    

    }
}

export default PrincipalCountry;