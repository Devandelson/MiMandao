import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function useCredentials() {
    const navigate = useNavigate();
    const dataSing = (() => {
        try {
            const item = sessionStorage.getItem('userData');
            return item ? JSON.parse(item).state.data : null;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        if (dataSing && dataSing.email && dataSing.email !== '') {
            Swal.fire({
                icon: 'info',
                text: 'Su sesión permanece activa.'
            });

            if (dataSing.role == 'user') {
                navigate('/productView');
                return;
            }

            navigate('/requestUser');
        }
    }, [dataSing, navigate]);

    return dataSing;
}