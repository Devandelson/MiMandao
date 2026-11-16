// Resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFilter,
    faClipboardCheck,
    faUtensils,
    faMotorcycle,
    faCircleCheck,
    faInbox,
    faBan,
    faXmark,
    faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'
import { motion } from 'motion/react'

// data
const STATES = [
    { label: 'recibido', icon: faClipboardCheck },
    { label: 'preparando', icon: faUtensils },
    { label: 'en camino', icon: faMotorcycle },
    { label: 'finalizado', icon: faCircleCheck },
    { label: 'cancelado', icon: faBan },
]
const delivery = 10;
import dataSing from '@src/context/login/Datasing';
import useContextChatId from '../../context/ChatId';
const urlHost = import.meta.env.VITE_API_URL;

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

// types
import type { orderProps } from '../../types/orders'
import React, { useState } from 'react';
import Swal from 'sweetalert2'

export default function OrderPreview({ currentOrder, setCurrentOrder }:
    { currentOrder: orderProps | null, setCurrentOrder: React.Dispatch<React.SetStateAction<orderProps | null>> }
) {
    const [process_state, setProcessState] = useState(String(currentOrder?.process_state).toLocaleLowerCase().trim());
    const isCancelled = process_state === 'cancelado'
    const userData = dataSing.getState().data;
    const setChatId = useContextChatId((state) => state.setIdOrder);

    const currentIndex = STATES.findIndex((s) => s.label === process_state);
    const elements = currentOrder?.order?.length;
    const items = currentOrder?.order;
    const subtotal = items?.reduce((sum, it) => sum + (it.price * it.ud), 0)
    const total = (subtotal ?? 0) + delivery;

    if (!items || items.length < 1) {
        return (
            <EmptyOrder setCurrentOrder={setCurrentOrder}></EmptyOrder>
        )
    }

    async function handleProcessState(newState: string) {
        if (!currentOrder || isCancelled || newState === process_state) return

        const toCancel = newState === 'cancelado'

        const { isConfirmed } = await Swal.fire({
            title: '¿Cambiar estado?',
            text: toCancel
                ? 'El pedido será cancelado y no podrás volver atrás.'
                : `El pedido pasará a "${newState}".`,
            icon: toCancel ? 'warning' : 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'No',
            confirmButtonColor: toCancel ? '#dc2626' : '#2563eb',
        })
        if (!isConfirmed) return

        const res = await fetch(`${urlHost}/order`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${userData.token}`,
            },
            body: JSON.stringify({ id_order: currentOrder.id_order, process_state: newState }),
        })
        const result = await res.json()

        if (result.success === false) {
            return Swal.fire({ icon: 'error', title: 'Error', text: result.error })
        }
        setProcessState(newState)
    }

    return (
        <div className={`h-full p-5 bg-white rounded-2xl border border-slate-200/70 grid grid-rows-[auto_auto_1fr_auto] gap-4 max-lg:rounded-tl-none`}>
            {/* header */}
            <div className='flex items-start gap-1 justify-between'>
                <span>
                    <h2 className="text-lg font-semibold">Detalles del pedido</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {elements} {elements === 1 ? 'elemento' : 'elementos'}
                    </p>
                </span>
                <span className='p-1 px-1.5 rounded-full bg-gray-900 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm' onClick={() => { setCurrentOrder(null) }}>
                    <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                </span>
            </div>

            {/* status (solo lectura) */}
            <section className="rounded-xl bg-slate-50 p-2.5 flex flex-col gap-3">
                <p className="font-semibold text-sm">Estado del pedido</p>
                <div className="flex items-center flex-wrap gap-1.5">
                    {STATES.map((s, i) => (
                        <motion.button
                            key={s.label}
                            whileTap={isCancelled ? undefined : { scale: 0.95 }}
                            type="button"
                            disabled={isCancelled}
                            onClick={() => handleProcessState(s.label)}
                            className={`flex flex-col grow items-center gap-1.5 rounded-xl px-1 py-2.5 text-[11px] font-medium relative cursor-pointer transition-colors disabled:cursor-not-allowed ${isCancelled
                                ? s.label === 'cancelado'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-100 text-slate-400'
                                : i === currentIndex
                                    ? 'bg-blue-600 text-white'
                                    : i < currentIndex
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-white text-slate-500 border border-slate-200'
                                }`}
                        >
                            <FontAwesomeIcon icon={s.icon} className="text-[8px] absolute -top-2 -left-2 z-10 bg-black text-white rounded-full p-1.5" />
                            <span>{s.label}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* products */}
            <ul className="min-h-0 overflow-y-auto flex flex-col gap-4">
                {items && items.map((it, i) => (
                    <motion.li
                        key={it.id_product}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.1 + Math.min(i, 6) * 0.05 }}
                        className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                        <img src={it.images} alt={it.name} className="size-20 shrink-0 rounded-xl object-cover" />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-semibold">{it.name}</h4>
                                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                    x{it.ud}
                                </span>
                            </div>
                            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                <FontAwesomeIcon icon={faFilter} className="text-[10px]" /> {it.category}
                            </p>
                            <p className="mt-1 flex justify-between text-sm font-semibold">
                                <span>Subtotal</span>
                                <span>${it.price * it.ud}</span>
                            </p>
                        </div>
                    </motion.li>
                ))}
            </ul>

            {/* totals */}
            <section className="rounded-xl bg-slate-50 p-4 flex flex-col gap-2 text-sm">
                <p className="font-semibold">Cálculo total</p>
                <p className="flex justify-between text-slate-600"><span>Productos</span><span>${subtotal} DOP</span></p>
                <p className="flex justify-between text-slate-600"><span>Delivery</span><span>${delivery} DOP</span></p>
                <p className="mt-1 flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
                    <span>Total</span><span>${total} DOP</span>
                </p>
            </section>
            <p className='text-center text-sm font-bold lg:underline cursor-pointer -mt-2 text-red-400
            max-lg:absolute max-lg:top-2 max-lg:right-3 max-lg:p-1.5 max-lg:px-2 max-lg:bg-white 
            max-lg:rounded-md max-lg:font-semibold max-lg:text-[12px] max-lg:hover:bg-red-500 max-lg:hover:text-white transition-all
            '
            onClick={() => {setChatId(currentOrder.id_order)}}    
            >Ver mensajes</p>
        </div>
    )
}

function EmptyOrder({ setCurrentOrder }: { setCurrentOrder: React.Dispatch<React.SetStateAction<orderProps | null>> }) {
    const [idO, setIdO] = useState('');
    const userData = dataSing.getState().data;

    async function handleSearchOrder(e: React.KeyboardEvent<HTMLInputElement>) {
        const value = e.key;

        if (value !== 'Enter') { return; }
        if (idO == '') { return Swal.fire({ icon: 'warning', title: 'Campo vacío', text: 'Id de la orden esta vacío.' }); }
        const searchOrder = await fetch(`${urlHost}/order/${Number(idO)}`, {
            headers: {
                'authorization': `Bearer ${userData.token}`
            }
        });
        const result = await searchOrder.json();
        if (!result.success) {
            return Swal.fire({ icon: 'error', title: 'Error', text: result.error });
        }
        const data = result.data[0];
        setCurrentOrder(data);
    }

    return (
        <section className="h-full flex flex-col gap-3 items-center justify-center text-center border-2 border-dashed rounded-2xl border-gray-500/40 p-6 max-lg:bg-white max-lg:rounded-tl-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: 0.1 }}
                className="size-20 grid place-items-center rounded-full bg-gray-500/10"
            >
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <FontAwesomeIcon icon={faInbox} className="text-4xl text-gray-500" />
                </motion.div>
            </motion.div>

            <div>
                <p className="text-lg font-semibold text-gray-300">Selecciona un pedido</p>
                <p className="text-sm text-gray-500">o búscalo por su ID de orden</p>
            </div>

            <div className="relative w-full max-w-sm mt-2">
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    value={idO}
                    placeholder="ID de orden"
                    onChange={(e) => setIdO(e.target.value)}
                    onKeyDown={handleSearchOrder}
                    className="w-full py-2 pl-10 pr-3 rounded-xl bg-gray-200/50 outline-none
                        ring-2 ring-transparent focus:ring-blue-500/60 focus:bg-gray-100
                        placeholder:text-gray-500 transition-all"
                />
            </div>

            <p className="text-xs text-gray-500">
                Presiona <kbd className="px-1.5 py-0.5 rounded bg-gray-500/20 font-sans">Enter</kbd> para buscar
            </p>
        </section>
    )
}