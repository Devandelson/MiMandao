// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'motion/react'
const apiURL = import.meta.env.VITE_API_URL;
import dataSing from '@src/context/login/Datasing';

// shared focus style so keyboard users always see where they are
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

// --------- Components
import Button1 from '@shared/smallComponents/button';

// ------- Hooks
import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';

export default function Header() {
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();
    const userData = dataSing.getState().data;

    // Status of the user info.
    const statusText = userData.statusInfo ? 'Completos' : 'Incompletos';
    const textColorClass = userData.statusInfo ? 'text-emerald-600' : 'text-amber-600';

    function handleMenu(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setMenu((prev) => prev == true ? false : true);
    }

    async function handleLogOut() {
        const fecthProccess = await fetch(`${apiURL}/login/logOut`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await fecthProccess.json();

        if (result.success) {
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('credentialsGoogle');
            navigate('/login');
        }
    }

    return (
        <section className='sticky top-0 z-20 w-full p-3'>
            < header className="w-full px-6 py-3 flex justify-between items-center bg-white/85 backdrop-blur border-b border-slate-200/70 rounded-3xl" >
                <section className="flex items-center gap-3">
                    <img src={'/mandao-logo.svg'} alt="Logo de la institución" className="size-12 rounded-full object-cover ring-slate-200" />
                    <h2 className="text-xl font-bold tracking-tight">MiMandado</h2>
                </section>

                <section className="flex items-center gap-2 relative">
                    {/* <button
                        type="button"
                        aria-label="Notificaciones"
                        className={`grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer ${focusRing}`}
                    >
                        <FontAwesomeIcon icon={faBell} className="text-lg" />
                    </button> */}

                    <button
                        type="button"
                        className={`flex items-center gap-3 rounded-full py-1 pl-3 pr-3 transition-colors cursor-pointer ${focusRing}`}
                        onClick={(e) => { handleMenu(e) }}
                    >
                        <ul className="hidden sm:flex flex-col items-end text-right leading-tight">
                            <li className="text-sm font-semibold">{userData.name}</li>
                            <li className="text-xs text-slate-500">
                                <b className="font-medium">Datos</b>:{' '}
                                <span className={`font-medium ${textColorClass}`}>
                                    {statusText}
                                </span>
                            </li>
                        </ul>
                        <span className='size-10 rounded-full flex items-center justify-center ring-1 ring-slate-200 bg-green-950 text-white'>
                            {userData.name.split('')[0].toLocaleUpperCase()}
                        </span>
                        <FontAwesomeIcon icon={faAngleDown} className="text-sm text-slate-400" />
                    </button>

                    <AnimatePresence>
                        {menu && (
                            <motion.nav
                                className="absolute bottom-[-140%] mb-2 right-0 z-50 p-1.5 rounded-xl bg-white shadow-xl border border-slate-100"
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Button1 label='Cerrar sesión' styles='px-3 py-2 rounded-lg! bg-red-50! text-red-600! hover:bg-red-500! m-0! hover:text-white!' click={handleLogOut} />
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </section>
            </ header>
        </section>
    )
}