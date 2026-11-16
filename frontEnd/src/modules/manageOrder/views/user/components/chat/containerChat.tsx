// ------------ Resources
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPaperclip,
    faPaperPlane,
    faClipboardList,
    faXmark
} from "@fortawesome/free-solid-svg-icons"
import { motion, AnimatePresence } from "motion/react";
import { formatDayLabel, isSameDay } from "../../../../utils/formatDayLabel.ts";
import { handleFilesChange, handleRemoveImage } from "./tools/image.tsx";

// Components
import EmptyChat from "../../../../Components/emptyChat.tsx";
import Message from "@src/modules/manageOrder/Components/messages.tsx";
import MenuDetailProvider from "./component/MenuDetailProvider.tsx";

// Hooks
import { useState, useEffect, useRef, Fragment, type SyntheticEvent } from "react";

// types
interface containerChatProp {
    idOrder: number | null,
    provider?: boolean
}
import type GetOrder from "@src/modules/manageOrder/types/getOrder.ts";

type AttachedImage = {
    id: string;
    file: File;
    previewUrl: string;
};

// data
import dataSing from "@src/context/login/Datasing.tsx";
import Swal from 'sweetalert2';
const urlHost = import.meta.env.VITE_API_URL;

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

export default function ContainerChat({ idOrder, provider = true }: containerChatProp) {
    const [currentOrder, setCurrentOrder] = useState<GetOrder[] | null>(null);
    const [images, setImages] = useState<AttachedImage[]>([]);
    const userData = dataSing.getState().data;

    const oneItem = currentOrder?.[0] ?? null;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [menuOrder, setMenuOrder] = useState(false);

    const providerComponents = {
        buttonDetail: (<FontAwesomeIcon
            icon={faClipboardList}
            className="text-xl transition-all hover:scale-125
            active:scale-95 cursor-pointer hover:text-blue-500"
            aria-label="Ver detalles del pedido"
            onClick={() => {setMenuOrder((prev) => !prev)}}
        />),
        menuDetail: ( <MenuDetailProvider oneItem={oneItem} enable={menuOrder}></MenuDetailProvider>  )
    }
    const classAdmin =  {
        chat: provider == false && 'scrollbar-thumb-blue-200'
    }

    useEffect(() => {
        if (idOrder == null) return;
        const resultFetch = async () => {
            const searchOrder = await fetch(`${urlHost}/order/${idOrder}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${userData.token}`
                }
            });
            const resultSearch = await searchOrder.json();
            if (resultSearch.success == false) {
                return Swal.fire({ icon: 'error', title: 'Error', text: resultSearch.error });
            };

            const dataOrder = resultSearch.data as GetOrder[];
            setCurrentOrder(dataOrder);
        }
        resultFetch();
    }, [idOrder]);

    const scrollContainerRef = useRef<HTMLElement>(null);
    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [currentOrder]);

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = new FormData(e.currentTarget);
        const input = String(target.get('input') ?? '').trim();

        if (input === '') {
            return Swal.fire({ icon: 'warning', title: 'Mensaje vacío', text: 'Al menos tiene que enviar un mensaje.' });
        }

        target.append('id_order', String(oneItem?.id_order ?? ''));
        target.append('id_user', String(userData.id_user ?? ''));
        target.append('message', input);

        images.forEach((img) => target.append('images', img.file, img.file.name));

        const sendFetch = await fetch(`${urlHost}/message`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                authorization: `Bearer ${userData.token}`,
            },
            body: target,
        });

        const result = await sendFetch.json();
        if (!result.success) {
            return Swal.fire({ icon: 'error', title: 'Error', text: result.error ?? result.data });
        }

        // adding new message
        const ahora = new Date();
        const imageFiles = target.getAll('images') as File[];
        // Filtramos solo los archivos cuyo tipo MIME comience con "image/"
        const validImageFiles = imageFiles.filter(file => {
            // Verificamos que sea un objeto File y que su tipo sea una imagen
            return file instanceof File && file.type.startsWith('image/');
        });
        // Ahora mapeamos solo las imágenes válidas
        const imageUrls = validImageFiles.map(file => URL.createObjectURL(file));
        const newMessage: GetOrder = {
            'date': ahora.toISOString(),
            'id_order': oneItem?.id_order ?? 0,
            'id_user': userData.id_user,
            'images': imageUrls,
            'message': input,
            'process_state': oneItem?.process_state ?? '',
            'total': oneItem?.total ?? 0,
        };

        setCurrentOrder((prev) => {
            return [...(prev ?? []), newMessage];
        });

        if (inputRef.current) { inputRef.current.value = ''; }
        setImages([]);
    }

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {idOrder == null ? (
                <EmptyChat />
            ) : (<>
                {/* Order context bar */}
                {oneItem && (
                    <motion.section
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={spring}
                        className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6 mt-3 bg-gray-200/40 rounded-lg relative"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">Pedido #{
                                String(oneItem.id_order).padStart(4, '0')
                            }</p>
                            <p className="text-xs text-slate-500">
                                Total ${oneItem.total.toLocaleString('es-DO')} DOP
                            </p>
                        </div>
                        <span className="flex items-center gap-2">
                            <button className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 outline-0">
                                {oneItem.process_state}
                            </button>

                            {provider && providerComponents.buttonDetail}
                        </span>

                        {provider && providerComponents.menuDetail}
                    </motion.section>
                )}

                {/* Messages */}
                <section className={`flex-1 space-y-4 overflow-y-auto px-4 py-5 lg:px-6 scrollbar-thin ${classAdmin.chat}`}
                    ref={scrollContainerRef}
                >
                    {currentOrder?.map((msg, index) => {
                        const showDay =
                            index === 0 ||
                            !isSameDay(new Date(msg.date), new Date(currentOrder[index - 1].date));

                        return (
                            <Fragment key={`${msg.id_order}-${index}`}>
                                {showDay && (
                                    <div className="flex justify-center">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                            {formatDayLabel(msg.date)}
                                        </span>
                                    </div>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                >
                                    <Message
                                        data={msg}
                                        isOwn={msg.id_user === userData.id_user}
                                        setCurrentOrder={setCurrentOrder}
                                    />
                                </motion.div>
                            </Fragment>
                        );
                    })}
                </section>

                {/* Message input */}
                <section className={`border-t border-slate-100 p-3 lg:p-4`}>
                    <section className="rounded-2xl bg-slate-100 p-2 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600">
                        <form className="flex items-start gap-2 w-full" method="post"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                name="images"
                                multiple
                                hidden
                                onChange={(e) => { handleFilesChange(e, setImages) }}
                            />

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={handleAttachClick}
                                aria-label="Adjuntar archivo"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                            >
                                <FontAwesomeIcon icon={faPaperclip} />
                            </motion.button>

                            <section className="w-full grow flex flex-col gap-2">
                                {images.length > 0 && (
                                    <>
                                        <span className="w-full h-auto flex flex-wrap gap-2">
                                            <AnimatePresence initial={false}>
                                                {images.map((img) => (
                                                    <motion.span
                                                        key={img.id}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={spring}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={img.previewUrl}
                                                            alt={img.file.name}
                                                            className="size-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(img.id, setImages)}
                                                            aria-label={`Quitar ${img.file.name}`}
                                                            className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-800 text-xs text-white shadow transition hover:bg-red-600"
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} />
                                                        </button>
                                                    </motion.span>
                                                ))}
                                            </AnimatePresence>
                                        </span>
                                        <hr className="border-gray-200" />
                                    </>
                                )}

                                <span className="w-full flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        placeholder="Escribe un mensaje"
                                        className="min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                        name="input"
                                        ref={inputRef}
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        aria-label="Enviar mensaje"
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </motion.button>
                                </span>

                            </section>
                        </form>
                    </section>
                </section>
            </>)}
        </>
    )
}