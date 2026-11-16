// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import userLogo from '@src/assets/user.png';
import { motion, AnimatePresence } from 'motion/react'

// shared focus style so keyboard users always see where they are
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

// --------- Components
import Button1 from '@shared/smallComponents/button';

// ------- Hooks
import { useState, type MouseEvent } from 'react';

export default function Header() {
    const [Optionmenu, setOptionMenu] = useState(false);
    function handleMenu(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setOptionMenu((prev) => !prev);
    }

    return (
        <>
            <section className='fixed top-0 left-0 z-20 w-full p-4'>
                <header className="w-full px-4 py-3 flex justify-between items-center bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/40 shadow-sm rounded-3xl">
                    <section className="flex items-center gap-3">
                        <img src={'/mandao-logo.svg'} alt="Logo de la institución" className="size-12 rounded-full object-cover ring-slate-200" />
                        <h2 className="text-xl font-bold tracking-tight">MiMandado</h2>
                    </section>

                    <section className="flex items-center gap-2 relative">
                        <button
                            type="button"
                            aria-label="Notificaciones"
                            className={`grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer ${focusRing}`}
                        >
                            <FontAwesomeIcon icon={faBell} className="text-lg" />
                        </button>

                        <button
                            type="button"
                            className={`flex items-center gap-3 rounded-full py-1 pl-3 pr-3 transition-colors cursor-pointer ${focusRing}`}
                            onClick={(e) => { handleMenu(e) }}
                        >
                            <ul className="hidden sm:flex flex-col items-end text-right leading-tight">
                                <li className="text-sm font-semibold">Nombre del usuario</li>
                                <li className="text-xs text-slate-500"><b className="font-medium">Datos</b>: <span className="text-emerald-600 font-medium">Completos</span></li>
                            </ul>
                            <img src={userLogo} alt="Foto del usuario" className="size-10 rounded-full object-cover ring-1 ring-slate-200" />
                            <FontAwesomeIcon icon={faAngleDown} className="text-sm text-slate-400" />
                        </button>

                        <AnimatePresence>
                            {Optionmenu && (
                                <motion.nav
                                    className="absolute top-full mt-2 right-0 z-50 p-1.5 rounded-xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/50"
                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Button1 label='Cerrar sesión' styles='px-3 py-2 rounded-lg! bg-red-50! text-red-600! hover:bg-red-500! m-0! hover:text-white!' />
                                </motion.nav>
                            )}
                        </AnimatePresence>
                    </section>
                </header>
            </section>

            {/* Spacer: header is fixed, so this reserves its height (≈ 72px) plus the bottom margin */}
            <div aria-hidden="true" className="h-[72px] mb-4" />
        </>
    )
}