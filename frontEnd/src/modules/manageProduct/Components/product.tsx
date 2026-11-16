// resources
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import default_product from '@src/assets/default_product.png';

// types
import type productProps from "../types/itemProduct";
import React, { useEffect, useState } from "react";

// tools
import checkImageExists from "@src/shared/tools/checkImageExists";

// data
import dataSing from "@src/context/login/Datasing";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
const urlHost = import.meta.env.VITE_API_URL;

export default function ItemProduct({ id_product, name, stock, price, category, images, setIdProduct }: productProps & {
    setIdProduct: React.Dispatch<React.SetStateAction<number>>
}) {
    const [finalImg, setFinalImg] = useState(default_product);
    const userData = dataSing.getState().data;
    const navigate = useNavigate();
    useEffect(() => {
        if (!images) return;
        checkImageExists(images).then((check) => {
            if (check) { setFinalImg(images); }
        });
    }, [images]);

    async function handleDelete(id_product: number) {
        const fetchDelete = await fetch(`${urlHost}/product/${id_product}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${userData.token}`
            }
        });
        const resultProcess = await fetchDelete.json();
        if (resultProcess.protectedRoute) {
            await Swal.fire({ icon: 'warning', title: 'Acceso denegado', text: 'No tiene permiso estar en este espacio.' });
            navigate('/productView');
            return;
        }
        if (!fetchDelete.ok || !resultProcess.success) {
            return Swal.fire({ icon: 'error', title: 'Error', text: resultProcess.error });
        }
        await Swal.fire({ icon: 'success', title: 'Éxito', text: resultProcess.data });
        window.location.reload();
    }

    return (
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-3 px-3 sm:px-4 flex flex-col items-center gap-2 text-center min-w-0">

            <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2">{name}</p>

            {/* Image with the Edit button on top */}
            <div className="relative w-full">
                <img
                    src={`${finalImg}`}
                    alt="Producto"
                    className="w-full aspect-[4/3] object-cover rounded-2xl"
                />
                <button
                    type="button"
                    aria-label="Eliminar producto"
                    className="absolute top-2 left-2 size-8 sm:size-7 rounded-full bg-white/90 text-gray-700 hover:bg-[#e60023] hover:text-white shadow flex items-center justify-center transition"
                    onClick={() => { handleDelete(id_product) }}
                >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                </button>

                <button
                    type="button"
                    aria-label="Editar producto"
                    className="absolute top-2 right-2 flex items-center gap-1.5 bg-white/90 text-gray-900 text-xs font-semibold rounded-full pl-3 pr-2 py-1 shadow
                        transition-all cursor-pointer
                        hover:bg-blue-400 hover:text-white hover:scale-105
                        active:scale-95"
                    onClick={() => { setIdProduct(id_product); }}
                >
                    Editar
                    <span className="p-1.5 rounded-full bg-blue-300 text-white flex items-center justify-center ">
                        <FontAwesomeIcon icon={faPencil} className="text-[10px]" />
                    </span>
                </button>
            </div>

            <p className="text-base font-bold text-gray-900">${price} DOP</p>

            <p className="text-xs text-gray-500">
                <FontAwesomeIcon icon={faFilter} className="mr-1" />
                {category}
            </p>
        </article>
    )
};
