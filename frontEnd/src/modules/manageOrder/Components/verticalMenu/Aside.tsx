// ------------ Resources
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faBasketShopping,
    faCalendarDays,
    faChevronRight,
    faReceipt,
} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// data
import GetOrders from "./utils/getOrders";

interface OrdersProps {
    id_order: number,
    name: string,
    date: string,
    active: boolean
}

// tools
import useCheckToken from "@src/shared/tools/checkToken.ts";
import Swal from 'sweetalert2';

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

export default function Aside({ stateMenu, setIdOrder }: {
    stateMenu: boolean,
    setIdOrder: React.Dispatch<React.SetStateAction<number | null>>
}) {
    // --- Responsive
    const positionMenu = stateMenu ? 'max-md:-translate-x-0]' : 'max-md:-translate-x-[calc(100%+30px)]';
    const [orders, setOrders] = useState<OrdersProps[]>([]);
    const tokenStatus = useCheckToken();

    const formateador = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    useEffect(() => {
        if (tokenStatus !== 'valid') return;
        const resultFetch = async () => {
            const result = await GetOrders('limit');
            if (result == null) { await Swal.fire({ icon: 'error', title: 'Error' }); }
            setOrders(result);
        }
        resultFetch();
    }, [tokenStatus])

    function handleSelectOrder(idOrder: number) {
        setOrders((prev) =>
            prev.map((order) => {
                return { ...order, active: order.id_order == idOrder }
            })
        );
        setIdOrder(idOrder);
    }

    async function handleAllOrders() {
        const result = await GetOrders('all');
        if (result == null) { await Swal.fire({ icon: 'error', title: 'Error' }); }
        setOrders(result);
        Swal.fire({ icon: 'success', title: 'Listo', text: 'Se ha solicitado todas las ordenes.' });
    }

    return (
        <aside className={`flex w-70 flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/10 transition-all ${positionMenu} max-md:h-[calc(100vh-1.5rem)]! max-md:w-60 pointer-events-auto max-md:fixed max-md:top-3 transition-all z-60`}>
            <header className="flex items-center flex-col gap-2 pb-2 text-center">
                <FontAwesomeIcon icon={faBasketShopping} className="text-5xl" />
                <div>
                    <h1 className="text-2xl font-bold">Pedidos</h1>
                    <p className="text-sm text-slate-500">De las últimas fechas</p>
                </div>
            </header>

            <nav className="mt-3 min-h-0 flex-1">
                <ul className="flex gap-3 mx-0 h-full flex-col overflow-y-auto overflow-x-hidden px-0 pb-0 pr-1 scrollbar-thin">
                    <AnimatePresence mode="popLayout">
                        {orders && orders.length > 0 && orders.map((order, i) => (
                            <motion.li
                                key={order.id_order}
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ ...spring, delay: Math.min(i, 8) * 0.04 }}
                                className={`w-full rounded-xl p-4 transition-colors ${order.active
                                    ? "bg-blue-50"
                                    : "bg-gray-50 hover:bg-slate-50"
                                    }`}
                            >
                                <section className="flex items-start gap-1">
                                    <FontAwesomeIcon icon={faReceipt} className={`justify-center text-2xl translate-y-1 ${order.active ? "text-blue-600" : "text-slate-800"
                                        }`} />

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold">{
                                            String(order.id_order).padStart(4, '0')
                                        }</p>

                                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                            <FontAwesomeIcon icon={faCalendarDays} className="text-[11px]" />
                                            {formateador.format(new Date(order.date))}
                                        </p>
                                    </div>
                                </section>

                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    className={`mt-3 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${order.active
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    onClick={() => { handleSelectOrder(order.id_order) }}
                                >
                                    Ver pedido
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                </motion.button>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </nav>

            <motion.p
                whileTap={{ scale: 0.97 }}
                className="text-center text-gray-500 font-semibold hover:underline transition-colors cursor-pointer"
                onClick={handleAllOrders}
            >
                Ver todos los pedidos
            </motion.p>
        </aside>
    )
}