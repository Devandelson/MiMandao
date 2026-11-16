import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBellConcierge } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";

// ------- Components
import Header from "./components/header.tsx";
import PreviewOrder from "./components/detailOrder/PreviewOrder.tsx";
import ContainerDate from "./components/DateRequest/container.tsx";
import MainComponentUser from "./components/detailsUser/mainComponent.tsx";
import AnotherDay from "./components/AnotherDay.tsx";
import DetailUniqueRequest from "./components/detailUniqueRequest/detailOrder.tsx";

import Footer from "@src/shared/footer.tsx";

// types
import type { ordersUsers, orderProps } from "./types/orders.ts";

// hooks
import { useEffect, useState } from "react";

// data
const urlHost = import.meta.env.VITE_API_URL;
import dataSing from "@src/context/login/Datasing.tsx";
import useCredentialUser from "./context/infoUser.tsx";
import TabsRequest from "@src/shared/utils/tabsAdmin.ts";

// tools
import useCheckToken from '@src/shared/tools/checkToken.ts';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

export default function RequestUser() {
    const [infoOrderUsers, setInfoOrderUsers] = useState<ordersUsers>({
        'anotherOrders': [],
        'recentsOrder': [],
        'todayOrders': []
    });
    const [currentOrder, setCurrentOrder] = useState<orderProps | null>(null);
    const tokenStatus = useCheckToken();
    const Modalid_user = useCredentialUser((state) => state.id_user);
    const [responsiveMenu, setResponsiveMenu] = useState(false);
    const navigate = useNavigate();

    const infoDates = [
        {
            title: 'Pedidos recientes',
            component: (<></>),
            data: infoOrderUsers.recentsOrder ?? [],
            typeDate: 'recents'
        },
        {
            title: 'Hoy',
            component: (<></>),
            data: infoOrderUsers.todayOrders ?? [],
            typeDate: 'today'
        }
    ];

    useEffect(() => {
        if (tokenStatus !== 'valid') return;
        const gettingData = async () => {
            const userData = dataSing.getState().data;
            const ordersFetch = await fetch(`${urlHost}/order/userOrders`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'authorization': `Bearer ${userData.token}`
                }
            });
            const resultOrders = await ordersFetch.json();
            if (resultOrders.protectedRoute == false) {
                await Swal.fire({ icon: 'warning', title: 'Acceso denegado', text: 'No tiene permiso estar en este espacio.' });
                navigate('/productView');
                return;
            }
            if (resultOrders.success == false) {
                return Swal.fire({ icon: 'error', title: 'Error', text: resultOrders.error });
            }
            const data = resultOrders.data as ordersUsers;
            setInfoOrderUsers(data);
        }
        gettingData();
    }, [tokenStatus])

    return (
        <>
            <Header></Header>
            <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full max-w-6xl m-auto p-6 flex items-start gap-3.5 mb-25 h-auto"
            >
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.1 }}
                >
                    {
                        infoDates.map((itemDate, index) => (
                            <>
                                <ContainerDate {...itemDate} key={index} setCurrentOrder={setCurrentOrder}>
                                    {itemDate.component}
                                </ContainerDate>
                                <hr className="border-gray-300 mt-7 mb-2" />
                            </>
                        ))
                    }
                    <AnotherDay infoOrderUsers={infoOrderUsers} setCurrentOrder={setCurrentOrder}></AnotherDay>
                </motion.div>

                {/* Responsive button (for the view of the order) */}
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    title="Notificaciones"
                    className="fixed top-4 right-1/2 -translate-x-1/2 z-20 size-11  place-items-center rounded-full hidden max-lg:grid
                    bg-blue-200 shadow-md shadow-black/10 text-white
                    hover:bg-blue-400 transition-colors"
                    onClick={() => { setResponsiveMenu((prev) => !prev) }}
                >
                    <FontAwesomeIcon icon={faBellConcierge} className="text-lg" />
                    <span className="absolute top-2 right-2 size-2.5 rounded-full bg-[#e60023] ring-2 ring-white" />
                </motion.button>

                <aside className={`w-150 h-full sticky top-10
                    max-lg:fixed max-lg:w-full max-lg:h-screen max-lg:top-0 max-lg:left-0 max-lg:z-40
                    max-lg:p-4 max-lg:flex-col max-lg:gap-5 max-lg:items-center max-lg:justify-center max-lg:bg-black/50 transition-all duration-300
                    ${responsiveMenu ? '' : 'max-lg:hidden!'}`}>

                    <section className={`max-lg:w-full max-lg:h-full max-lg:max-w-220 relative transition-all duration-300 max-lg:rounded-2xl max-lg:shadow-2xl h-[78vh]
                    max-lg:grid max-lg:grid-rows-[auto_1fr] max-lg:overflow-y-auto max-lg:scrollbar-thin max-lg:scrollbar-thumb-blue-100 m-auto
                    `}>
                        <button className="px-3 py-2 rounded-lg bg-red-400 text-white rounded-bl-none rounded-br-none w-max hidden max-lg:block text-sm hover:bg-red-500 cursor-pointer"
                            onClick={() => { setResponsiveMenu(false) }}
                        >Cerrar ventana</button>

                        <motion.div
                            key={currentOrder ? currentOrder?.id_order : '0'}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="h-full"
                        >
                            <PreviewOrder key={currentOrder ? currentOrder?.id_order : '0'} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />
                        </motion.div>
                    </section>
                </aside>
            </motion.main>
            <Footer tabs={TabsRequest}></Footer>
            <MainComponentUser key={Modalid_user}></MainComponentUser>
            <DetailUniqueRequest></DetailUniqueRequest>
        </>
    )
}