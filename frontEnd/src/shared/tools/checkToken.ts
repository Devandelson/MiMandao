import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import dataSing from "@src/context/login/Datasing";
import Swal from 'sweetalert2';

const urlHost = import.meta.env.VITE_API_URL;

type TokenStatus = 'checking' | 'valid' | 'invalid';

function useCheckToken(): TokenStatus {
    const navigate = useNavigate();
    const [status, setStatus] = useState<TokenStatus>('checking');

    useEffect(() => {
        let cancelled = false;
        const { data: userData, setData: setUserData } = dataSing.getState();

        const fail = async (msg: string) => {
            if (cancelled) return;
            await Swal.fire({ icon: 'warning', title: 'Atención', text: msg });
            setStatus('invalid');
            navigate('/');
        };

        const check = async () => {
            if (!userData.token) {
                return fail('Sin autenticador.');
            }

            try {
                const res = await fetch(`${urlHost}/login/checkToken`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ token: userData.token })
                });
                const result = await res.json();
                
                if (!result.success) {
                    return fail('Su sesión ha expirado, por favor inicie sesión otra vez.');
                }
                if (result.token) {
                    setUserData({ ...userData, token: result.token });
                }
                if (!cancelled) setStatus('valid');
            } catch {
                fail('Error de conexión.');
            }
        };

        check();
        return () => { cancelled = true; };
    }, []);

    return status;
}

export default useCheckToken;