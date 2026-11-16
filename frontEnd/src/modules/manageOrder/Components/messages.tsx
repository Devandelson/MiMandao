import type GetOrder from "../types/getOrder.ts";

interface MessageProps {
    data: GetOrder;
    isOwn: boolean;
}

import dataSing from "@src/context/login/Datasing.tsx";
const urlHost = import.meta.env.VITE_API_URL;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type React from "react";
import Swal from 'sweetalert2';

export default function Message({ data, isOwn, setCurrentOrder }: MessageProps & {
    setCurrentOrder: React.Dispatch<React.SetStateAction<GetOrder[] | null>>
}) {
    const hasImages = Array.isArray(data.images) && data.images.length > 0;
    const userData = dataSing.getState().data;

    const time = new Date(data.date).toLocaleTimeString('es-DO', {
        hour: 'numeric',
        minute: '2-digit'
    });

    async function deleteMessage(id_message: number | undefined) {
        const deleteFetch = await fetch(`${urlHost}/message/${id_message}`, {
            method: 'delete',
            credentials: 'include',
            headers: {
                authorization: `Bearer ${userData.token}`,
            },
        });
        const resultProccess = await deleteFetch.json();
        if (resultProccess.success == false) {
            return Swal.fire({ icon: 'error', title: 'Error', text: resultProccess.error });
        }
        setCurrentOrder((prev) => {
            if (!prev) return null;
            return prev.filter((item) => item.id_message !== id_message);
        });
        Swal.fire({ icon: 'success', title: 'Éxito', text: resultProccess.data });
    }

    // ---------- Mensaje enviado (mío) ----------
    if (isOwn) {
        return (
            <article className="ml-auto flex max-w-[85%] flex-col items-end gap-1 sm:max-w-[70%]">
                <div className="w-full rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm leading-relaxed text-white shadow-sm shadow-blue-600/20">
                    <p>{data.message}</p>
                    {hasImages && (
                        <>
                            <hr className="my-2 border-blue-400" />
                            <section className="flex w-full flex-wrap items-center gap-1.5">
                                {data.images!.map((src, i) => (
                                    <span key={i} className="h-50 w-60 grow overflow-hidden rounded-lg bg-black">
                                        <img src={src} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
                                    </span>
                                ))}
                            </section>
                        </>
                    )}
                </div>
                <div className="flex justify-between gap-1.5 items-center w-full">
                    <span className="flex items-center gap-1 text-red-400 text-sm cursor-pointer hover:scale-110 transition-all active:scale-95"
                        onClick={() => {deleteMessage(data.id_message)}}
                    >
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        Eliminar
                    </span>

                    <span className="flex items-center gap-1 px-1 text-xs text-slate-400">{time}</span>
                </div>

            </article>
        );
    }

    // ---------- Mensaje recibido ----------
    return (
        <article className="flex max-w-[85%] flex-col items-start gap-1 sm:max-w-[70%]">
            <div className="w-full rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-800">
                <p>{data.message}</p>
                {hasImages && (
                    <>
                        <hr className="my-2 border-gray-300" />
                        <section className="flex w-full flex-wrap items-center gap-1.5">
                            {data.images!.map((src, i) => (
                                <span key={i} className="h-50 w-60 grow overflow-hidden rounded-lg bg-black">
                                    <img src={src} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
                                </span>
                            ))}
                        </section>
                    </>
                )}
            </div>
            <span className="flex items-center gap-1 px-1 text-xs text-slate-400">{time}</span>
        </article>
    );
}