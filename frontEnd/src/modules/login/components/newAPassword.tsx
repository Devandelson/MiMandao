import { useState } from 'react';
import Input from './inputs.tsx'
import { faLock } from '@fortawesome/free-solid-svg-icons'

export default function NewAPassword() {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1 w-full" >
            <Input
                title="Contraseña"
                placeholder="••••••••••••"
                type={show ? 'text' : 'password'}
                name="password"
                icon={faLock}
            />
            <div className="flex items-center gap-1.5 text-xs text-gray-800 cursor-pointer select-none mt-1">
                <input
                    type="checkbox"
                    checked={show}
                    onChange={(e) => setShow(e.target.checked)}
                    className="accent-indigo-600 rounded"
                />
                <span>Mostrar contraseña</span>
            </div>
        </div >
    )
}