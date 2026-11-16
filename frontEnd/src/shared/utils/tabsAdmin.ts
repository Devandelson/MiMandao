import { faUserPlus, faBoxesStacked } from "@fortawesome/free-solid-svg-icons";

const TabsRequest = [
  { 
    id: 'create', 
    label: 'Solicitudes',
    icon: faUserPlus,
    path: '/requestUser',
    focus: true 
  },
  { 
    id: 'manage', 
    label: 'Productos',
    icon: faBoxesStacked,
    path: '/ManageProduct',
    focus: false
  },
];

export default TabsRequest;