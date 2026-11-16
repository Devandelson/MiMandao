// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faAngleDown, faBarsStaggered } from '@fortawesome/free-solid-svg-icons'
import userLogo from '@src/assets/user.png';
import { motion, AnimatePresence } from 'motion/react'

// shared focus style so keyboard users always see where they are
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

// --------- Components
import Button1 from '@shared/smallComponents/button';

// ------- Hooks
import { useState, type MouseEvent } from 'react';

const apiURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
import dataSing from '@src/context/login/Datasing';
import { useNavigate } from 'react-router';

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

export default function Header({ toggleMenu, stateMenu }: { toggleMenu: () => void, stateMenu: boolean }) {
    const [menu, setMenu] = useState(false);
    const userData = dataSing.getState().data;
    const navigate = useNavigate();

    function handleMenu(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setMenu((prev) => prev == true ? false : true);
    }

    // Status of the user info.
    const statusText = userData.statusInfo ? 'Completos' : 'Incompletos';
    const textColorClass = userData.statusInfo ? 'text-emerald-600' : 'text-amber-600';

    async function handleLogOut() {
        const fecthProccess = await fetch(`${apiURL}/login/logOut`, {
            method: 'GET',
        });
        const result = await fecthProccess.json();

        if (result.success) {
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('credentialsGoogle');
            navigate('/login');
        }
    }

    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className={`sticky top-0 z-20 w-full px-0 py-3 flex justify-between items-center`}
        >
            <section className="flex items-center gap-3">
                {/* button (Open the responsive menu) */}
                <span className={`${stateMenu && 'max-md:fixed max-md:top-0 max-md:left-0 max-md:w-full max-md:h-screen max-md:bg-black/40 max-md:flex max-md:justify-end max-md:p-5 transition-all max-md:z-50'}`}>
                    <FontAwesomeIcon icon={faBarsStaggered} className={`text-2xl hover:text-yellow-700 hover:scale-110 cursor-pointer active:scale-95 hidden! max-md:block! ${stateMenu && 'max-md:text-white'} transition-all
                `}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleMenu();
                        }}
                    ></FontAwesomeIcon>
                </span>

                <img src={'/mandao-logo.svg'} alt="Logo de la institución" className="size-12 rounded-full object-cover ring-slate-200" />
                <h2 className="text-xl font-bold tracking-tight">MiMandado</h2>
            </section>

            <section className="flex items-center gap-2 relative">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    aria-label="Notificaciones"
                    className={`grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer ${focusRing}`}
                >
                    <FontAwesomeIcon icon={faBell} className="text-lg" />
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.97 }}
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
                    <img src={userLogo} alt="Foto del usuario" className="size-10 rounded-full object-cover ring-1 ring-slate-200" />
                    <motion.span
                        animate={{ rotate: menu ? 180 : 0 }}
                        transition={spring}
                        className="inline-flex"
                    >
                        <FontAwesomeIcon icon={faAngleDown} className="text-sm text-slate-400" />
                    </motion.span>
                </motion.button>

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
        </motion.header>
    )
}