import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import TableList from "views/TableList.jsx";
import Typography from "views/Typography.jsx";
import Icons from "views/Icons.jsx";
import Maps from "views/Maps.jsx";
import Notifications from "views/Notifications.jsx";
import Upgrade from "views/Upgrade.jsx";
import PrincipalCountry from 'componente/Country/PrincipalCountry.js';
import EditarCountry from 'componente/Country/EditarCountry.js';
import AltaCountry from 'componente/Country/AltaCountry.js';
import PrincipalAdministrador from 'componente/Administrador/PrincipalAdministrador.js'
import EditarAdministrador from 'componente/Administrador/EditarAdministrador.js'
import AltaAdministrador from 'componente/Administrador/AltaAdministrador.js'
import PrincipalServicio from 'componente/Servicio/PrincipalServicio.js'
import EditarServicio from 'componente/Servicio/EditarServicio.js'
import AltaServicio from 'componente/Servicio/AltaServicio.js'
import PrincipalPropietario from 'componente/Propietario/PrincipalPropietario.js'
import EditarPropietario from 'componente/Propietario/EditarPropietario.js'
import AltaPropietario from 'componente/Propietario/AltaPropietario.js'
import PrincipalEncargado from 'componente/Encargado/PrincipalEncargado.js'
import EditarEncargado from 'componente/Encargado/EditarEncargado.js'
import AltaEncargado from 'componente/Encargado/AltaEncargado.js'
import InvitadoEvento from 'componente/InvitadoEvento/InvitadoEvento'
import Invitado from 'componente/Invitado/PrincipalInvitados'
import Ingresos from 'componente/Ingresos/PrincipalIngreso'
import Egresos from 'componente/Egresos/PrincipalEgreso'
import EditarInvitado from 'componente/Invitado/EditarInvitado'


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    editar: false,
    layout: "/example"
  },
  {
    path: "/table",
    name: "Table List",
    icon: "pe-7s-note2",
    component: TableList,
    editar: false,
    layout: "/example"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography,
    editar: false,
    layout: "/example"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons,
    editar: false,
    layout: "/root"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "pe-7s-map-marker",
    component: Maps,
    editar: false,
    layout: "/example"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    editar: false,
    layout: "/example"
  },
  {
    upgrade: true,
    path: "/upgrade",
    name: "Hello world",
    icon: "pe-7s-rocket",
    component: Upgrade,
    editar: false,
    layout: "/nulo"
  },
  {
    path: "/country",
    name: "Country",
    icon: "pe-7s-home",
    component: PrincipalCountry,
    editar: false,
    layout: "/root"
  },
  {
    path: "/editarCountry/:id",
    name: "Editar un Country",
    icon: "pe-7s-pen",
    component: EditarCountry,
    editar: true,
    layout: "/root"
  },
  {
    path: "/altaCountry",
    name: "Nuevo Country",
    icon: "pe-7s-plus",
    component: AltaCountry,
    editar: false,
    layout: "/root"
  },
  {
    path: "/administrador",
    name: "Administradores",
    icon: "pe-7s-users",
    component: PrincipalAdministrador,
    editar: false,
    layout: "/root"
  },
  {
    path: "/editarAdministrador/:id",
    name: "Editar Administrador",
    icon: "pe-7s-pen",
    component: EditarAdministrador,
    editar: true,
    layout: "/root"
  },
  {
    path: "/altaAdministrador",
    name: "Nuevo Administrador",
    icon: "pe-7s-add-user",
    component: AltaAdministrador,
    editar: false,
    layout: "/root"
  },
  {
    path: "/servicios",
    name: "Servicios",
    icon: "pe-7s-users",
    component: PrincipalServicio,
    editar: false,
    layout: "/admin"
  },
  {
    path: "/editarServicio/:id",
    name: "Editar Servicio",
    icon: "pe-7s-pen",
    component: EditarServicio,
    editar: true,
    layout: "/admin"
  },
  {
    path: "/altaServicio",
    name: "Nuevo Servicio",
    icon: "pe-7s-add-user",
    component: AltaServicio,
    editar: false,
    layout: "/admin"
  },
  {
    path: "/propietarios",
    name: "Propietarios",
    icon: "pe-7s-users",
    component: PrincipalPropietario,
    editar: false,
    layout: "/admin"
  },
  {
    path: "/editarPropietario/:id",
    name: "Editar Propietario",
    icon: "pe-7s-pen",
    component: EditarPropietario,
    editar: true,
    layout: "/admin"
  },
  {
    path: "/altaPropietario",
    name: "Nuevo Propietario",
    icon: "pe-7s-add-user",
    component: AltaPropietario,
    editar: false,
    layout: "/admin"
  },
  {
    path: "/encargados",
    name: "Encargados",
    icon: "pe-7s-users",
    component: PrincipalEncargado,
    editar: false,
    layout: "/admin"
  },
  {
    path: "/editarEncargado/:id",
    name: "Editar Encargado",
    icon: "pe-7s-pen",
    component: EditarEncargado,
    editar: true,
    layout: "/admin"
  },
  {
    path: "/altaEncargado",
    name: "Nuevo Encargado",
    icon: "pe-7s-add-user",
    component: AltaEncargado,
    editar: false,
    layout: "/admin"
  },
  {
    path: "/invitados",
    name: "Mis Invitados",
    icon: "pe-7s-add-user",
    component: Invitado,
    editar: false,
    layout: "/propietario"
  },
  {
    path: "/editarInvitado/:id",
    name: "Editar Invitado",
    icon: "pe-7s-add-user",
    component: EditarInvitado,
    editar: true,
    layout: "/propietario"
  },
  {
    path: "/ingresos",
    name: "Ingresos",
    icon: "pe-7s-add-user",
    component: Ingresos,
    editar: false,
    layout: "/encargado"
  },
  {
    path: "/egresos",
    name: "Egresos",
    icon: "pe-7s-add-user",
    component: Egresos,
    editar: false,
    layout: "/encargado"
  },
  {
    path: "/:id",
    name: "Nuevo Invitado a Evento",
    icon: "pe-7s-add-user",
    component: InvitadoEvento,
    editar: true,
    layout: "/invitado"
  }
];

export default dashboardRoutes;
