import { faPlus, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'

const TabsRequestUser = [
    { id: 'create', label: 'Crear nuevo pedido', icon: faPlus, path: '/productView', focus: true },
    { id: 'manage', label: 'Gestionar pedidos', icon: faTableCellsLarge, path: '/order', focus: false },
]

export default TabsRequestUser;