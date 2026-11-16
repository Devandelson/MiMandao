import dataSing from "@src/context/login/Datasing";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';

function useCheckRole(typeUser: string) {
    const userData = dataSing.getState().data;
    const navigate = useNavigate();

    if (userData.role.toLocaleLowerCase().trim() !== typeUser.toLocaleLowerCase().trim()) {
        if (userData.role == 'user') {
            Swal.fire({ icon: 'warning', title: 'Acceso denegado', text: 'No tienes los permisos para entrar a este espacio.' });
            navigate('/productView');
        }
    } 
}

export default useCheckRole;