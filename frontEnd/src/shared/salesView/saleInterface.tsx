import type { Dispatch, SetStateAction } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'motion/react';

import type salesProps from './salesProps.ts';
import Article from './components/article.tsx';

// config
const focusRing =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
const DELIVERY_FEE = 10;
const formatDOP = (value: number) =>
    `$${value.toLocaleString('es-DO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} DOP`;
const urlHost = import.meta.env.VITE_API_URL;

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

import dataSing from '@src/context/login/Datasing.tsx';

export default function SalesInterface({
    infoProducts,
    setInfoProducts,
}: {
    infoProducts: salesProps[];
    setInfoProducts: Dispatch<SetStateAction<salesProps[]>>;
}) {
    const isEmpty = infoProducts.length === 0;
    const countP = infoProducts.length;
    const sumT = infoProducts.reduce((acc, item) => acc + item.price * item.ud, 0);
    const delivery = isEmpty ? 0 : DELIVERY_FEE;
    const total = sumT + delivery;
    const userData = dataSing.getState().data;

    function handleAllItems() {
        if (isEmpty) {
            Swal.fire({
                title: 'No hay productos suficientes para ejecutar la acción',
                icon: 'info',
            });
            return;
        }

        Swal.fire({
            title: '¿Estás seguro que quieres eliminar todos los productos del carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                setInfoProducts([]);
            }
        });
    }

    async function sentOrder() {
        const resultFecth = await fetch(`${urlHost}/order`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${userData.token}`
            },
            credentials: 'include',
            body: JSON.stringify({
                id_user: userData.id_user,
                order: infoProducts,
                total: total,
            })
        });
        const resultJson = await resultFecth.json();
        if (resultJson.success == false) return;
        const idOrder = resultJson.idOrder;

        // 1. Generate current timestamp
        const currentTime = new Date().toLocaleTimeString();

        // 2. Format the products list nicely
        const productsListText = infoProducts
            .map(item => `- ${item.name} (Cant: ${item.ud}) - $${(item.price * item.ud).toFixed(2)}`)
            .join('\n');

        // 3. Construct the detailed message
        const detailedMessage = `Pedido solicitado a las ${currentTime}:\n${productsListText}\nTotal: $${total.toFixed(2)}`;

        await fetch(`${urlHost}/message`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${userData.token}`
            },
            credentials: 'include',
            body: JSON.stringify({
                id_order: Number(idOrder),
                id_user: userData.id_user,
                message: detailedMessage,
            })
        });
        // const jsonMessage = await resultMessage.json();
        if (resultJson.success == true) {
            setInfoProducts([]);
            return Swal.fire({
                title: 'Se genero la orden correctamente',
                icon: 'success'
            });
        };

        return Swal.fire({
            title: 'Ocurrio un error',
            icon: 'error'
        });
    }

    return (
        <div className="h-full p-5 bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] grid grid-rows-[auto_1fr_auto_auto] gap-4">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Detalles del pedido</h2>
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm text-slate-500">
                        {countP} {countP === 1 ? 'elemento' : 'elementos'}
                    </p>

                    <button
                        type="button"
                        className={`text-sm font-medium text-red-500 hover:text-red-600 hover:underline underline-offset-4 cursor-pointer rounded ${focusRing}`}
                        onClick={handleAllItems}
                    >
                        Eliminar todos
                    </button>
                </div>
            </div>

            <div className="min-h-0 overflow-y-auto -mx-1 px-1">
                {isEmpty ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 text-center text-sm text-slate-400"
                    >
                        Tu carrito está vacío
                    </motion.p>
                ) : (
                    <section className="flex flex-col gap-4">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {infoProducts.map((item) => (
                                <motion.div
                                    key={item.id_product}
                                    layout
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -24 }}
                                    transition={spring}
                                >
                                    <Article
                                        infoProducts={item}
                                        setInfoProducts={setInfoProducts}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </section>
                )}
            </div>

            <section className="rounded-xl bg-slate-50 p-4 flex flex-col gap-3">
                <p className="font-semibold">Cálculo total</p>
                <ul className="list-none flex flex-col gap-2 text-sm">
                    <li className="flex justify-between text-slate-600">
                        <span>Sumatoria productos</span>
                        <span className="tabular-nums">{formatDOP(sumT)}</span>
                    </li>
                    <li className="flex justify-between text-slate-600">
                        <span>Delivery</span>
                        <span className="tabular-nums">{formatDOP(delivery)}</span>
                    </li>
                    <li className="mt-1 flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                        <span>Total</span>
                        <span className="tabular-nums">{formatDOP(total)}</span>
                    </li>
                </ul>
            </section>

            <motion.button
                whileTap={isEmpty ? undefined : { scale: 0.97 }}
                type="button"
                disabled={isEmpty}
                className={`w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-[0_6px_16px_rgba(37,99,235,0.28)] hover:bg-blue-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-blue-600 ${focusRing}`}
                onClick={sentOrder}
            >
                Realizar pedido
            </motion.button>
        </div>
    );
}