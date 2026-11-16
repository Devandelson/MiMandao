// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'motion/react'

// ------- Compontens
import SalesInterface from '@src/shared/salesView/saleInterface';

// ------ hooks
import { useState } from 'react';

import type salesProps from '@src/shared/salesView/salesProps.ts';

export default function OrderDetail({
    infoProducts,
    setInfoProducts
}: {
    infoProducts: salesProps[],
    setInfoProducts: React.Dispatch<React.SetStateAction<salesProps[]>>
}) {
    const [detailRes, setDetailRes] = useState(false);

    // Adjusted styles so when detailRes is false, the drawer is hidden/collapsed on mobile
    const stylesResponsive = detailRes === false
        ? 'max-lg:opacity-0 max-lg:pointer-events-none max-lg:scale-95'
        : 'max-lg:opacity-100 max-lg:pointer-events-auto max-lg:scale-100';

    const opacityRes = detailRes === true ? 'max-lg:bg-black/50' : 'max-lg:bg-transparent max-lg:pointer-events-none';

    return (
        <>
            {/* expand the orderDetail (responsive) */}
            {!detailRes && (
                <button
                    type="button"
                    onClick={() => setDetailRes(true)}
                    className="fixed top-22 right-5 z-30 flex p-4 px-3.5 items-center justify-center rounded-full bg-blue-400 text-white shadow-xl transition-all hover:scale-[1.050] cursor-pointer active:scale-95 lg:hidden inset-shadow-[2px_-3px_0] inset-shadow-blue-600 border-4 border-white hover:inset-shadow-[4px_-5px_0] active:inset-shadow-[1px_-2px_0]
                    
                    "
                    aria-label="Abrir detalles de pedido"
                >
                    <FontAwesomeIcon icon={faCartPlus} className="text-lg" />
                </button>
            )}

            <aside className={`w-95 h-[80vh] sticky top-25
                max-lg:fixed max-lg:w-full max-lg:h-screen max-lg:top-0 max-lg:left-0 max-lg:z-40
                max-lg:p-4 max-lg:flex max-lg:flex-col max-lg:gap-5 max-lg:items-center max-lg:justify-center transition-all duration-300 ${opacityRes}`}>

                <motion.section
                    initial={{ x: 56 }}
                    animate={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
                    className={`max-lg:w-full max-lg:h-full max-lg:max-w-220 relative transition-all duration-300 bg-white max-lg:rounded-2xl max-lg:p-4 max-lg:shadow-2xl h-[78vh] ${stylesResponsive}`}
                >
                    {
                        detailRes && (<FontAwesomeIcon
                            icon={faCircleXmark}
                            className="absolute z-10 text-4xl text-black -top-2 -right-3 transition-all duration-300 hover:scale-110 cursor-pointer active:scale-95 hover:rotate-180 block lg:hidden"
                            onClick={(e) => {
                                e.preventDefault();
                                setDetailRes(false);
                            }}
                        />)
                    }

                    <SalesInterface infoProducts={infoProducts} setInfoProducts={setInfoProducts} />
                </motion.section>
            </aside>
        </>
    )
}