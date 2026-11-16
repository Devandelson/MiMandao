import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// components
import ContainerChat from "@src/modules/manageOrder/views/user/components/chat/containerChat";

// data
import dataSing from "@src/context/login/Datasing";
const urlHost = import.meta.env.VITE_API_URL;

// context
import useContextChatId from "../../context/ChatId";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export default function DetailUniqueRequest() {
    const [dataUser, setDataUser] = useState(null);
    const setIdOrder = useContextChatId((state) => state.setIdOrder);
    const IdOrder = useContextChatId((state) => state.idOrder);
    const userData = dataSing.getState().data;

    useEffect(() => {
        if (IdOrder == null) return;
        const callUser = async () =>  {
            const userFetch = await fetch(`${urlHost}/login/order/${IdOrder}`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${userData.token}`
                }
            });
            console.log(userFetch);
            const resultFetch = await userFetch.json();
            if (!userFetch.ok || !resultFetch.success) {
                return Swal.fire({ icon: 'error', title: 'Error', text: resultFetch.error });
            }
            setDataUser(resultFetch.data);
        }
        callUser();
    }, [IdOrder])

    return (
        <>
            {IdOrder !== null && dataUser && (
                <div className="fixed top-0 left-0 z-50 w-full h-screen bg-black/50 flex items-center justify-center p-2">
                    <section className="w-full max-w-125 h-full flex flex-col">
                        <header className="shrink-0 p-5 bg-black/20 backdrop-blur-md rounded-t-3xl">
                            <article className="flex items-start justify-between gap-3">
                                <div className="flex flex-col gap-3">
                                    <span className="flex items-center gap-3">
                                        <span className="size-11 rounded-full bg-white text-black font-bold flex items-center justify-center">
                                            {String(dataUser.name).split('')[0].toLocaleUpperCase()}
                                        </span>
                                        <p className="text-2xl font-semibold text-white">
                                            {dataUser.name}
                                        </p>
                                    </span>

                                    <span className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm px-3 py-1 rounded-full bg-white/90 text-black">{dataUser.email}</p>
                                        <p className="text-sm px-3 py-1 rounded-full bg-white/90 text-black">{dataUser.phone}</p>
                                    </span>
                                </div>

                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="size-5 p-2.5 rounded-full text-white cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
                                    onClick={() => { setIdOrder(null) }}
                                />
                            </article>
                        </header>

                        <div className="flex-1 overflow-y-hidden bg-white rounded-b-3xl px-3 relative grid grid-rows-[auto_1fr_auto]">
                            <ContainerChat idOrder={IdOrder} provider={false}></ContainerChat>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}