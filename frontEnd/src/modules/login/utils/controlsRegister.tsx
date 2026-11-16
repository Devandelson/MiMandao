import { type SyntheticEvent } from 'react'
import swal from 'sweetalert2'

import { type NavigateFunction } from 'react-router'
import { type CredentialResponse } from '@react-oauth/google'

// config
interface ApiResponse {
    success: boolean;
    error?: string;
    name?: string;
    password?: string;
    email?: string;
}

const urlHost = import.meta.env.VITE_API_URL;

export async function handleSubmit(
    e: SyntheticEvent<HTMLFormElement>,
    navigate: NavigateFunction
): Promise<void> {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('type_check', 'normal');

    const response = await fetch(`${urlHost}/login`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
        await swal.fire({
            title: 'Error al crear la cuenta',
            text: result.error,
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    await swal.fire({
        title: 'Cuenta creada correctamente',
        text: result.error,
        icon: 'success',
        confirmButtonText: 'Aceptar',
    });

    navigate('/');
}

export async function authGoogle(
    credentialResponse: CredentialResponse,
    navigate: NavigateFunction,
    setProcessGoogleAc: (data: { name: string; password: string; email: string }) => void
): Promise<void> {
    const dataFetch = await fetch(`${urlHost}/login/auth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            credentials: credentialResponse.credential,
        }),
    });

    const result: ApiResponse = await dataFetch.json();

    if (!result.success) {
        setProcessGoogleAc({
            name: result.name ?? '',
            password: result.password ?? '',
            email: result.email ?? '',
        });
        await swal.fire({
            icon: 'info',
            title: 'Creando cuenta con google',
        });
        navigate('/Googleregister');
    } else {
        await swal.fire({
            icon: 'success',
            title: 'Usuario reconocido',
        });
    }
}