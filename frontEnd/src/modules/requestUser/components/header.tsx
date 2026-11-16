// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'motion/react'
const apiURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
import dataSing from '@src/context/login/Datasing';

// --------- Components
import Button1 from '@shared/smallComponents/button';

// ------- Hooks
import { useNavigate } from 'react-router';

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

export default function Header() {
    const navigate = useNavigate();
    const userData = dataSing.getState().data;

    // Status of the user info.
    const statusText = userData.statusInfo ? 'Completos' : 'Incompletos';
    const textColorClass = userData.statusInfo ? 'text-emerald-600' : 'text-amber-600';

    async function handleLogOut() {
        const fecthProccess = await fetch(`${apiURL}/login/logOut`, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await fecthProccess.json();

        if (result.success) {
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('credentialsGoogle');
            navigate('/login');
        }
    }

    return (
        <div className='p-4'>
            <motion.header
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="sticky top-0 z-20 w-full px-6 py-4 flex justify-between items-center bg-white/85 backdrop-blur border-b border-slate-200/70 
            rounded-3xl max-sm:flex-col gap-4"
            >
                <section className="flex items-center gap-2 relative">
                    <p className='size-10 rounded-full ring-1 ring-slate-200 flex items-center justify-center'>
                        {userData.name.split('')[0].toLocaleUpperCase()}
                    </p>

                    <ul className="flex flex-col items-start text-left w-max">
                        <li className="text-sm font-semibold text-nowrap">{userData.name}</li>
                        <li className="text-xs text-slate-500">
                            <b className="font-medium">Datos</b>:{' '}
                            <span className={`font-medium ${textColorClass}`}>
                                {statusText}
                            </span>
                        </li>
                    </ul>

                    <motion.span
                        whileHover={{ rotate: [0, -15, 15, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex origin-top cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faBell} className="text-lg" />
                    </motion.span>
                </section>

                <Button1 label='Cerrar sesión' styles='w-max px-3 py-2 rounded-lg! bg-red-50! text-red-600! hover:bg-red-500! m-0! hover:text-white!' click={handleLogOut} />
            </motion.header>
        </div>
    )
}