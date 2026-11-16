// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'motion/react'
import type productsProps from '../types/product';

// --------- Components
import Button1 from '@shared/smallComponents/button';

// shared focus style so keyboard users always see where they are
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

import type salesProps from '@src/shared/salesView/salesProps';

export default function ProductCard(
    { infoP, order, setOrder }:
    {
        infoP: productsProps,
        order: salesProps[],
        setOrder: React.Dispatch<React.SetStateAction<salesProps[]>>
    }
) {
    const state = 
        order && order.filter((item) => item.id_product == infoP.id_product).length > 0 
        ? true : false;
    const activeClass = state ? 'border-0! ring-3 ring-yellow-700/20' : '';
    const availableClass = state ? 'cursor-not-allowed! pointer-events-none! text-gray-400' : '';

    function addCar() {
        const detailsInfoP = {...infoP, ud: 1};
        setOrder((prev) => {
            return [...prev, detailsInfoP]
        });
    }

    return (
        <article
            key={infoP.id_product}
            className={`group p-3 bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all
            relative ${activeClass}`}
        >
            <AnimatePresence>
                {state && (
                    <motion.span className='absolute p-1 px-2.5 5 top-4 left-4.5 text-sm rounded-2xl bg-yellow-700 text-white'
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                    >
                        Seleccionado
                    </motion.span>
                )}
            </AnimatePresence>

            <section className="flex items-center gap-4 flex-wrap">
                <img src={infoP.images} alt="Imagen del producto" className="size-28 shrink-0 object-cover rounded-xl" />
                <span className="flex min-w-0 flex-col gap-1.5">
                    <h3 className="text-base font-semibold leading-snug">{infoP.name}</h3>
                    <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        <FontAwesomeIcon icon={faFilter} className="text-[10px]" /> {infoP.category}
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums">{infoP.price}</p>
                </span>
            </section>
            <Button1 styles={`${focusRing} ${availableClass}`} label='Agregar al carrito' click={addCar} ></Button1>
        </article>
    )
}