
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

//Encargado
import PrincipalIngreso from 'componente/Ingresos/PrincipalIngreso.js'
import PrincipalEgreso from 'componente/Egresos/PrincipalEgreso.js'

import AltaInvitado from 'componente/Invitado/AltaInvitado.js'

//Propietario
import PrincipalInvitado from 'componente/Invitado/PrincipalInvitados.js'
import EditarInvitado from 'componente/Invitado/EditarInvitado.js'

import PrincipalReserva from './componente/Reserva/PrincipalReserva.js'
import AltaReserva from './componente/Reserva/AltaReserva.js'
import VisualizarReserva from './componente/Reserva/VisualizarReserva.js'

//Todos
import MiPerfil from './componente/Perfil/MiPerfil';


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
        layoutCollapse: '/juju',
        path: '/components',
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
                path: '/icons',
                layout: '/admin',
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
                layout: '/admin',
                name: 'Regular Forms',
                mini: 'RF',
                component: RegularForms
            },
            {
                path: '/extended-forms',
                layout: '/admin',
                name: 'Extended Forms',
                mini: 'EF',
                component: ExtendedForms
            },
            {
                path: '/validation-forms',
                layout: '/admin',
                name: 'Validation Forms',
                mini: 'VF',
                component: ValidationForms
            },
            {
                path: '/wizard',
                layout: '/admin',
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
        layout: '/example',
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
        layoutCollapse: '/encargado',
        path: '/pages',
        name: 'Pages',
        state: 'openPages',
        icon: 'pe-7s-gift',
        views: [
            {
                path: '/user-page',
                layout: '/encargado',
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
                name: 'Editar Country',
                mini: 'EC',
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
                name: 'Nuevo Admin.',
                mini: 'NB',
                component: AltaAdministrador
            },
            {
                path: '/editarAdministrador',
                layout: '/root',
                name: 'Editar Admin.',
                mini: 'EC',
                component: EditarAdministrador
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/admin',
        path: '/admin',
        name: 'Propietario',
        state: 'openPropietario',
        icon: 'pe-7s-users',
        views: [
            {
                path: '/propietarios',
                layout: '/admin',
                name: 'Propietario',
                mini: 'P',
                component: PrincipalPropietario
            },
            {
                path: '/altaPropietario',
                layout: '/admin',
                name: 'Nuevo Prop.',
                mini: 'NP',
                component: AltaPropietario
            },
            {
                path: '/editarPropietario',
                layout: '/admin',
                name: 'Editar Prop.',
                mini: 'EP',
                component: EditarPropietario
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/admin',
        path: '/admin',
        name: 'Servicios',
        state: 'openServicio',
        icon: 'pe-7s-users',
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
                component: EditarServicio
            }
        ]
    },
    {
        collapse: true,
        layoutCollapse: '/propietario',
        path: '/propietario',
        name: 'Reservas',
        state: 'openReserva',
        icon: 'pe-7s-users',
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
                path: '/altaInvitado',
                layout: '/propietario',
                name: 'Nuevo Invitado',
                mini: 'NI',
                component: AltaInvitado
            },
            {
                path: '/invitados',
                layout: '/propietario',
                name: 'Mis Invitados',
                mini: 'MI',
                component: PrincipalInvitado
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
        path: '/ingresos',
        layout: '/encargado',
        name: 'Ingresos',
        icon: 'pe-7s-graph',
        component: PrincipalIngreso
    },
    {
        path: '/egresos',
        layout: '/encargado',
        name: 'Egresos',
        icon: 'pe-7s-graph',
        component: PrincipalEgreso
    },
    {
        path: '/editarInvitado',
        layout: '/encargado',
        name: 'Editar Invitado',
        icon: 'pe-7s-graph',
        component: EditarInvitado
    },
    {
        path: '/altaInvitado',
        layout: '/encargado',
        name: 'Nuevo Invitado',
        icon: 'pe-7s-graph',
        component: AltaInvitado
    },
    {
        path: '/miPerfil',
        layout: '/propietario',
        name: 'Mi Perfil',
        icon: 'null',
        noVisualizar: true,
        component: UserPage
    },
];
export default routes;
