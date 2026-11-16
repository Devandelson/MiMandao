// components/GoogleButton.tsx
import { memo } from 'react'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import swal from 'sweetalert2'

interface Props {
    onSuccess: (r: CredentialResponse) => void
}

function GoogleButton({ onSuccess }: Props) {
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
                swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo iniciar sesión con Google' })
            }}
        />
    )
}

export default memo(GoogleButton)