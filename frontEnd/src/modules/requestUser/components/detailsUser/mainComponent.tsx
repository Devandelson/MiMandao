import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import dataSing from '@src/context/login/Datasing'
import useCredentialUser from '../../context/infoUser'
import Swal from 'sweetalert2'

const urlHost = import.meta.env.VITE_API_URL

interface userProps {
    id: number
    name: string
    email: string
    map?: string
    detail_address: string
    phone: string
}

export default function MainComponentUser() {
    const [user, setUser] = useState<userProps | null>(null)
    const userData = dataSing.getState().data
    const id_user = useCredentialUser((s) => s.id_user)
    const setIdUser = useCredentialUser((s) => s.setIdUser)

    const getUser = async () => {
        if (!id_user || id_user == null) {return;}
        try {
            const res = await fetch(`${urlHost}/login/${id_user}`, {
                headers: { authorization: `Bearer ${userData.token}` },
            })
            if (!res.ok) return
            const result = await res.json()
            if (result.success === false) return Swal.fire({ icon: 'error', title: 'Error', text: result.error })
            setUser({ ...result.data, id: id_user })
        } catch (err) {
            if ((err as Error)) console.error(err)
        }
    }
    getUser();


    // derived value: no reset needed
    const currentUser = user && user?.id === id_user ? user : null;

    const info = currentUser && [
        { icon: faEnvelope, label: 'Correo', value: currentUser.email ?? '' },
        { icon: faPhone, label: 'Teléfono', value: currentUser.phone ?? '' },
        { icon: faLocationDot, label: 'Dirección', value: currentUser.detail_address ?? '' },
    ];

    return (
        <AnimatePresence>
            {id_user != null && currentUser && (
                // black transparent layer
                <motion.div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIdUser(null)}
                >
                    {/* card */}
                    <motion.div
                        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid md:grid-cols-2"
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* close button */}
                        <motion.button
                            type="button"
                            aria-label="Cerrar"
                            onClick={() => setIdUser(null)}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </motion.button>

                        {/* image (random, same one for the same user) */}
                        <div className="h-64 overflow-hidden md:h-full">
                            <motion.img
                                src={`https://picsum.photos/seed/${id_user}/600/800`}
                                alt={currentUser.name}
                                className="size-full object-cover"
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                        </div>

                        {/* info */}
                        <div className="flex flex-col justify-center gap-6 p-8">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Cliente</p>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{currentUser.name}</h2>
                            </div>

                            <ul className="flex flex-col gap-3">
                                {info!.map((it, i) => (
                                    <motion.li
                                        key={it.label}
                                        className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + i * 0.1 }}
                                    >
                                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
                                            <FontAwesomeIcon icon={it.icon} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500">{it.label}</p>
                                            <p className="truncate text-sm font-semibold text-slate-900">{it.value}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}