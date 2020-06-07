
import Dashboard from 'views/Dashboard.jsx';
import Buttons from 'views/Components/Buttons.jsx';
import GridSystem from 'views/Components/GridSystem.jsx';
import Panels from 'views/Components/Panels.jsx';
import SweetAlert from 'views/Components/SweetAlertPage.jsx';
import Notifications from 'views/Components/Notifications.jsx';
import Icons from 'views/Components/Icons.jsx';
import Typography from 'views/Components/Typography.jsx';
import RegularForms from 'views/Forms/RegularForms.jsx';
import ExtendedForms from 'views/Forms/ExtendedForms.jsx';
import ValidationForms from 'views/Forms/ValidationForms.jsx';
import Wizard from 'views/Forms/Wizard/Wizard.jsx';
import RegularTables from 'views/Tables/RegularTables.jsx';
import ExtendedTables from 'views/Tables/ExtendedTables.jsx';
import ReactTables from 'views/Tables/ReactTables.jsx';
import GoogleMaps from 'views/Maps/GoogleMaps.jsx';
import FullScreenMap from 'views/Maps/FullScreenMap.jsx';
import VectorMap from 'views/Maps/VectorMap.jsx';
import Charts from 'views/Charts.jsx';
import Calendar from 'views/Calendar.jsx';
import UserPage from 'views/Pages/UserPage.jsx';
import LoginPage from 'views/Pages/LoginPage.jsx';
import RegisterPage from 'views/Pages/RegisterPage.jsx';
import LockScreenPage from 'views/Pages/LockScreenPage.jsx';

//Root
import PrincipalCountry from 'componente/Country/PrincipalCountry.js'
import AltaCountry from 'componente/Country/AltaCountry.js'
import EditarCountry from 'componente/Country/EditarCountry.js'
import PrincipalAdministrador from 'componente/Administrador/PrincipalAdministrador.js'
import AltaAdministrador from 'componente/Administrador/AltaAdministrador.js'
import EditarAdministrador from 'componente/Administrador/EditarAdministrador.js'

//Admin
import PrincipalPropietario from 'componente/Propietario/PrincipalPropietario.js'
import AltaPropietario from 'componente/Propietario/AltaPropietario.js'
import EditarPropietario from 'componente/Propietario/EditarPropietario.js'
import PrincipalServicio from 'componente/Servicio/PrincipalServicio.js'
import AltaServicio from 'componente/Servicio/AltaServicio'
import EditarServicio from 'componente/Servicio/EditarServicio.js'
import PrincipalEncargado from 'componente/Encargado/PrincipalEncargado'
import AltaEncargado from 'componente/Encargado/AltaEncargado'
import EditarEncargado from 'componente/Encargado/EditarEncargado'
import Graficos from "./componente/Reportes/Graficos"


//Encargado
import PrincipalIngreso from 'componente/Ingresos/PrincipalIngreso.js'
import AltaIngreso from 'componente/Ingresos/AltaIngreso'
import PrincipalEgreso from 'componente/Egresos/PrincipalEgreso.js'
import AltaEgreso from 'componente/Egresos/AltaEgreso'

import AltaInvitado from 'componente/Invitado/AltaInvitado.js'

//Propietario
import PrincipalInvitado from 'componente/Invitado/PrincipalInvitados.js'
import EditarInvitado from 'componente/Invitado/EditarInvitado.js'

import PrincipalReserva from './componente/Reserva/PrincipalReserva.js'
import AltaReserva from './componente/Reserva/AltaReserva.js'
import VisualizarReserva from './componente/Reserva/VisualizarReserva.js'

//Todos
import MiPerfil from 'componente/Perfil/MiPerfil'
import MiCountry from 'componente/Perfil/MiCountry'
import Config from 'componente/Perfil/Configuraciones'

var routes = [
    {
        path: '/dashboard',
        layout: '/example',
        name: 'Dashboard',
        icon: 'pe-7s-graph',
        component: Dashboard
    },
    {
        collapse: true,
        layoutCollapse: '/Components',
        path: '/Components',
        name: 'Components',
        state: 'openComponents',
        icon: 'pe-7s-plugin',
        views: [
            {
                path: '/buttons',
                layout: '/root',
                name: 'Buttons',
                mini: 'B',
                component: Buttons
            },
            {
                path: '/grid-system',
                layout: '/admin',
                name: 'Grid System',
                mini: 'GS',
                component: GridSystem
            },
            {
                path: '/panels',
                layout: '/admin',
                name: 'Panels',
                mini: 'P',
                component: Panels
            },
            {
                path: '/sweet-alert',
                layout: '/propietario',
                name: 'Sweet Alert',
                mini: 'SA',
                component: SweetAlert
            },
            {
                path: '/notifications',
                layout: '/propietario',
                name: 'Notifications',
                mini: 'N',
                component: Notifications
            },
            {
                path: '/encargado',
                layout: '/encargado',
                name: 'Icons',
                mini: 'I',
                component: Icons
            },
            {
                path: '/typography',
                layout: '/admin',
                name: 'Typography',
                mini: 'T',
                component: Typography
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/example',
        path: '/forms',
        name: 'Forms',
        state: 'openForms',
        icon: 'pe-7s-note2',
        views: [
            {
                path: '/regular-forms',
                layout: '/example',
                name: 'Regular Forms',
                mini: 'RF',
                component: RegularForms
            },
            {
                path: '/extended-forms',
                layout: '/example',
                name: 'Extended Forms',
                mini: 'EF',
                component: ExtendedForms
            },
            {
                path: '/validation-forms',
                layout: '/example',
                name: 'Validation Forms',
                mini: 'VF',
                component: ValidationForms
            },
            {
                path: '/wizard',
                layout: '/example',
                name: 'Wizard',
                mini: 'W',
                component: Wizard
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/example',
        path: '/tables',
        name: 'Tables',
        state: 'openTables',
        icon: 'pe-7s-news-paper',
        views: [
            {
                path: '/regular-tables',
                layout: '/admin',
                name: 'Regular Tables',
                mini: 'RT',
                component: RegularTables
            },
            {
                path: '/extended-tables',
                layout: '/admin',
                name: 'Extended Tables',
                mini: 'ET',
                component: ExtendedTables
            },
            {
                path: '/react-table',
                layout: '/admin',
                name: 'React Table',
                mini: 'RT',
                component: ReactTables
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/example',
        path: '/maps',
        name: 'Maps',
        state: 'openMaps',
        icon: 'pe-7s-map-marker',
        views: [
            {
                path: '/google-maps',
                layout: '/admin',
                name: 'Google Maps',
                mini: 'GM',
                component: GoogleMaps
            },
            {
                path: '/full-screen-maps',
                layout: '/admin',
                name: 'Full Screen Map',
                mini: 'FSM',
                component: FullScreenMap
            },
            {
                path: '/vector-maps',
                layout: '/admin',
                name: 'Vector Map',
                mini: 'VM',
                component: VectorMap
            }
        ]
    },
    {
        path: '/charts',
        layout: '/asd',
        name: 'Charts',
        icon: 'pe-7s-graph1',
        component: Charts
    },

    {
        path: '/calendar',
        layout: '/example',
        name: 'Calendar',
        icon: 'pe-7s-date',
        component: Calendar
    },
    {
        collapse: true,
        layoutCollapse: '/example',
        path: '/pages',
        name: 'Pages',
        state: 'openPages',
        icon: 'pe-7s-gift',
        views: [
            {
                path: '/user-page',
                layout: '/example',
                name: 'User Page',
                mini: 'UP',
                component: UserPage
            },
            {
                path: '/login-page',
                layout: '/root',
                name: 'Login Page',
                mini: 'LP',
                component: LoginPage
            },
            {
                path: '/register-page',
                layout: '/root',
                name: 'Register',
                mini: 'RP',
                component: RegisterPage
            },
            {
                path: '/lock-screen-page',
                layout: '/root',
                name: 'Lock Screen Page',
                mini: 'LSP',
                component: LockScreenPage
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/root',
        path: '/root',
        name: 'Country',
        state: 'openCountry',
        icon: 'pe-7s-home',
        views: [
            {
                path: '/country',
                layout: '/root',
                name: 'Barrios',
                mini: 'B',
                component: PrincipalCountry
            },
            {
                path: '/altaCountry',
                layout: '/root',
                name: 'Nuevo Barrio',
                mini: 'NB',
                component: AltaCountry
            },
            {
                path: '/editarCountry',
                layout: '/root',
                name: 'Editar Barrio',
                mini: 'EC',
                noVisualizar: true,
                component: EditarCountry
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/root',
        path: '/root',
        name: 'Administradores',
        state: 'openAdmin',
        icon: 'pe-7s-users',
        views: [
            {
                path: '/administradores',
                layout: '/root',
                name: 'Administradores',
                mini: 'A',
                component: PrincipalAdministrador
            },
            {
                path: '/altaAdministrador',
                layout: '/root',
                name: 'Nuevo Administrador',
                mini: 'NB',
                component: AltaAdministrador
            },
            {
                path: '/editarAdministrador',
                layout: '/root',
                name: 'Editar Administrador',
                mini: 'EC',
                noVisualizar: true,
                component: EditarAdministrador
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/admin',
        path: '/admin',
        name: 'Propietarios',
        state: 'openPropietario',
        icon: 'pe-7s-users',
        views: [
            {
                path: '/propietarios',
                layout: '/admin',
                name: 'Propietarios',
                mini: 'P',
                component: PrincipalPropietario
            },
            {
                path: '/altaPropietario',
                layout: '/admin',
                name: 'Nuevo Propietario',
                mini: 'NP',
                component: AltaPropietario
            },
            {
                path: '/editarPropietario',
                layout: '/admin',
                name: 'Editar Propietario',
                mini: 'EP',
                noVisualizar: true,
                component: EditarPropietario
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/admin',
        path: '/admin',
        name: 'Encargados',
        state: 'openEncargado',
        icon: 'pe-7s-user',
        views: [
            {
                path: '/encargado',
                layout: '/admin',
                name: 'Encargados',
                mini: 'EN',
                component: PrincipalEncargado
            },
            {
                path: '/altaEncargado',
                layout: '/admin',
                name: 'Nuevo Encargado',
                mini: 'NE',
                component: AltaEncargado
            },
            {
                path: '/editarEncargado',
                layout: '/admin',
                name: 'Editar Encargado',
                mini: 'EE',
                noVisualizar: true,
                component: EditarEncargado
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/admin',
        path: '/admin',
        name: 'Servicios',
        state: 'openServicio',
        icon: 'pe-7s-news-paper',
        views: [
            {
                path: '/servicios',
                layout: '/admin',
                name: 'Servicios',
                mini: 'S',
                component: PrincipalServicio
            },
            {
                path: '/altaServicio',
                layout: '/admin',
                name: 'Nuevo Servicio',
                mini: 'NS',
                component: AltaServicio
            },
            {
                path: '/editarServicio',
                layout: '/admin',
                name: 'Editar Servicio',
                mini: 'ES',
                noVisualizar: true,
                component: EditarServicio
            }
        ]
    },
    {
        path: '/charts',
        layout: '/lala',
        name: 'Reportes',
        icon: 'pe-7s-graph1',
        component: Graficos
    },
    {
        collapse: true,
        layoutCollapse: '/propietario',
        path: '/propietario',
        name: 'Reservas',
        state: 'openReserva',
        icon: 'pe-7s-date',
        views: [
            {
                path: '/misReservas',
                layout: '/propietario',
                name: 'Mis Reservas',
                mini: 'MR',
                component: PrincipalReserva
            },
            {
                path: '/altaReserva',
                layout: '/propietario',
                name: 'Nueva Reserva',
                mini: 'NR',
                component: AltaReserva
            },
            {
                path: '/visualizarReserva',
                layout: '/propietario',
                name: 'Visualizar Reserva',
                mini: 'VR',
                noVisualizar: true,
                component: VisualizarReserva
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/propietario',
        path: '/propietario',
        name: 'Invitados',
        state: 'openInvitadoProp',
        icon: 'pe-7s-users',
        views: [
            {
                path: '/invitados',
                layout: '/propietario',
                name: 'Mis Invitados',
                mini: 'MI',
                component: PrincipalInvitado
            },
            {
                path: '/altaInvitado',
                layout: '/propietario',
                name: 'Nuevo Invitado',
                mini: 'NI',
                component: AltaInvitado
            },
            {
                path: '/editarInvitado',
                layout: '/propietario',
                name: 'Editar Invitado',
                mini: 'EI',
                noVisualizar: true,
                component: EditarInvitado
            },
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/encargado',
        path: '/encargado',
        name: 'Ingresos',
        state: 'openIngresos',
        icon: 'pe-7s-next-2',
        views: [
            {
                path: '/ingresos',
                layout: '/encargado',
                name: 'Ingresos',
                mini: 'IN',
                component: PrincipalIngreso
            },
            {
                path: '/altaIngreso',
                layout: '/encargado',
                name: 'Nueva Ingreso',
                mini: 'NI',
                component: AltaIngreso
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/encargado',
        path: '/encargado',
        name: 'Egresos',
        state: 'openEgresos',
        icon: 'pe-7s-back-2',
        views: [
            {
                path: '/egresos',
                layout: '/encargado',
                name: 'Egresos',
                mini: 'EG',
                component: PrincipalEgreso
            },
            {
                path: '/altaEgreso',
                layout: '/encargado',
                name: 'Nuevo Egreso',
                mini: 'NE',
                component: AltaEgreso
            }
        ]
    },
    {
        path: '/editarInvitado',
        layout: '/encargado',
        name: 'Editar Invitado',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: EditarInvitado
    },
    {
        path: '/altaInvitado',
        layout: '/encargado',
        name: 'Nuevo Invitado',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: AltaInvitado
    },
    //Se repiten en los distintos perfiles
    {
        path: '/miPerfil',
        layout: '/propietario',
        name: 'Mi Perfil',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: MiPerfil
    },
    {
        path: '/miCountry',
        layout: '/propietario',
        name: 'Mi Barrio',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: MiCountry
    },
    {
        path: '/configuraciones',
        layout: '/propietario',
        name: 'Configuraciones',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: Config
    },
    {
        path: '/miPerfil',
        layout: '/encargado',
        name: 'Mi Perfil',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: MiPerfil
    },
    {
        path: '/miCountry',
        layout: '/encargado',
        name: 'Mi Barrio',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: MiCountry
    },
    {
        path: '/configuraciones',
        layout: '/encargado',
        name: 'Configuraciones',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: Config
    },
    {
        path: '/miPerfil',
        layout: '/admin',
        name: 'Mi Perfil',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: MiPerfil
    },
    {
        path: '/miCountry',
        layout: '/admin',
        name: 'Mi Barrio',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: MiCountry
    },
    {
        path: '/configuraciones',
        layout: '/admin',
        name: 'Configuraciones',
        icon: 'pe-7s-graph',
        noVisualizar: true,
        component: Config
    },

];

export default routes;
