// utils/singFetch.tsx
import Swal from 'sweetalert2'
import dataSing from '@src/context/login/Datasing.tsx'

// types
import type { SyntheticEvent } from 'react'
import { type CredentialResponse } from '@react-oauth/google'
import type { NavigateFunction } from 'react-router'

// config
const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function handleSubmit(e: SyntheticEvent<HTMLFormElement>, navigate: NavigateFunction) {
    e.preventDefault()

    const { email, password } = Object.fromEntries(new FormData(e.currentTarget)) as {
        email: string
        password: string
    }

    try {
        const res = await fetch(`${API_URL}/login/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json().catch(() => ({}))

        if (!res.ok || data.success === false) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error ?? 'No se pudo iniciar sesión. Inténtalo de nuevo.',
            })
            return
        }

        dataSing.getState().setData({
            id_user: data.id_user,
            name: data.name,
            role: data.role,
            token: data.token,
            statusInfo: data.statusInfo
        })

        Swal.fire({ icon: 'success', title: 'Éxito', text: 'Inicio de sesión exitoso.' })
        if (data.role == 'user') {
            return navigate('/productView');
        }
        navigate('/requestUser');
    } catch {
        await Swal.fire({
            icon: 'error',
            title: 'Sin conexión',
            text: 'No se pudo contactar con el servidor.',
        })
    }
}

export async function authSubmit(CredentialResponse: CredentialResponse, navigate: NavigateFunction) {
    const setDataSing = dataSing.getState().setData;

    const Datafecth = await fetch(`${API_URL}/login/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        credentials: 'include',
        body: JSON.stringify({
            credentials: CredentialResponse.credential
        })
    });
    const result = await Datafecth.json();

    if (result.success == false) {
        return Swal.fire({
            icon: 'error',
            'title': 'Usuario reconocido'
        });
    } else {
        setDataSing({
            id_user: result.id_user,
            name: result.name,
            token: result.token,
            role: result.role,
            statusInfo: result.statusInfo
        });
        Swal.fire({
            icon: 'success',
            'title': 'Usuario reconocido'
        });
        if (result.role == 'user') {
            return navigate('/productView');
        }
        navigate('/requestUser');
    }
}