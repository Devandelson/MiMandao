// ------------ Resources
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons"
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { motion, AnimatePresence } from 'motion/react'

// Hooks
import { useRef, useState } from "react"

// types
import type { groupOrder, orderProps } from "../../types/orders"

// data
import dataSing from "@src/context/login/Datasing"
import useCredentialUser from "../../context/infoUser"
const urlHost = import.meta.env.VITE_API_URL;

export default function ItemContainerDate({ id_user, totalr, name, typeDate, setCurrentOrder }: groupOrder &
{
    typeDate: string
    setCurrentOrder: React.Dispatch<React.SetStateAction<orderProps | null>>
}
) {
    const [moreInfo, setMoreInfo] = useState(false);
    const [itemOrders, setItemOrders] = useState<orderProps[]>([]);
    const memoryMenu = useRef(false);
    const firtsLetter = name.split('')[0].toLocaleUpperCase();
    const userData = dataSing.getState().data;

    const setCrendentialsUser = useCredentialUser((state) => state.setIdUser);

    async function gettingOrders() {
        try {
            const searchOrders = await fetch(`${urlHost}/order/uniqueUserOrders/${id_user}/${typeDate.toLocaleLowerCase()}`,
                {
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${userData.token}`
                    }
                }
            );
            const resultOrders = await searchOrders.json();
            const data = resultOrders.data as orderProps[];
            setItemOrders(data ?? []);
            return resultOrders.success;
        } catch (_) {
            return false;
        }
    }

    async function HandleListOrders() {
        if (memoryMenu.current == false) {
            const result = await gettingOrders();
            if (result == false) return;
        }
        memoryMenu.current = !memoryMenu.current;
        setMoreInfo((prev) => !prev);
    }

    function handleSelectOrder(item: orderProps) {
        setCurrentOrder(item);
        memoryMenu.current = !memoryMenu.current;
        setMoreInfo((prev) => !prev);
    }

    return (
        <li className="w-50 h-auto rounded-lg relative">
            <section className="relative p-3 z-10">
                {/* Expan info user */}
                <span className="absolute top-3 text-right p-2 pr-5 right-0 bg-blue-300 text-white transition-all w-1/2 -z-10 text-lg rounded-lg rounded-br-none h-14 hover:bg-blue-400 hover:text-xl hover:inset-shadow-sm/20 cursor-pointer active:text-lg active:bg-blue-500"
                    onClick={() => { setCrendentialsUser(id_user) }}
                >
                    <FontAwesomeIcon icon={faReadme}></FontAwesomeIcon>
                </span>

                {/* Decorative Element */}
                <span className="absolute w-full h-[70%] rounded-lg bottom-0 left-0 -z-10 bg-gray-300 border-b-4 border-gray-500 shadow-[0_5px_0] shadow-gray-500 pointer-events-none"></span>

                {/* Logo */}
                <button className="text-7xl m-auto rounded-full mb-1 border-8 border-gray-300 overflow-hidden h-auto z-10! bg-white w-22 flex items-center justify-center">
                    <p>{firtsLetter}</p>
                </button>

                <h3 className="text-xl font-semibold">{name}</h3>
                <span className="w-full h-auto flex items-center justify-between gap-1.5
                    mt-0.5 text-sm">
                    <p>Pedidos: {totalr}</p>
                    <FontAwesomeIcon icon={faArrowRightLong}></FontAwesomeIcon>
                    <p className="hover:text-red-400 hover:scale-105 cursor-pointer hover:decoration-solid hover:underline active:scale-95 transition-all"
                        onClick={HandleListOrders}>Ver pedidos</p>
                </span>
            </section>

            <AnimatePresence mode="wait">
                {
                    moreInfo && (
                        <motion.section className="w-full h-auto left-0 bg-gray-400 rounded-bl-lg rounded-br-lg p-3 overflow-hidden"
                            initial={{ y: -20, height: 0, z: -10 }}
                            animate={{ y: 0, height: 'auto', z: 0 }}
                            exit={{ y: -20, opacity: 0, height: 0, z: -10, marginBottom: '-100%' }}

                        >
                            <ul className="flex flex-col gap-3">
                                {itemOrders && itemOrders.length > 0 && (
                                    itemOrders.map((item) => (
                                        <li key={item.id_order}>
                                            <button
                                                onClick={() => { handleSelectOrder(item) }}
                                                className="group w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                                            >
                                                <div className="text-left">
                                                    <p className="font-mono font-semibold text-gray-900">
                                                        #{String(item.id_order).padStart(4, '0')}
                                                    </p>
                                                    <p className={`text-xs font-medium capitalize ${item.process_state.toLowerCase() === 'entregado' ? 'text-emerald-600' : 'text-amber-600'
                                                        }`}>
                                                        ● {item.process_state}
                                                    </p>
                                                </div>

                                                <FontAwesomeIcon
                                                    icon={faArrowRightLong}
                                                    className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                                                />
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </motion.section>
                    )
                }
            </AnimatePresence>
        </li>
    )
}