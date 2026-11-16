// data
const inputStyle =
    "w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-base sm:text-sm outline-none focus:border-[#e60023]";
import dataSing from "@src/context/login/Datasing";
const urlHost = import.meta.env.VITE_API_URL;

// types
import React, { useEffect, useState, type SyntheticEvent } from "react";
import type productProps from "../../types/itemProduct";
import type categoriesProps from '@src/modules/sale/user/types/categories.ts';

// Components
import ImageUpload from "./components/image";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';

export default function EditForm({ idProduct, categories, setIdProduct }: {
    idProduct: number, categories: categoriesProps[],
    setIdProduct: React.Dispatch<React.SetStateAction<number>>
}) {
    const [currentProduct, setCurrentProduct] = useState<productProps | null>(null);
    const userData = dataSing.getState().data;
    const [preview, setPreview] = useState<string | null>('');
    const navigate = useNavigate();

    async function handleSaveSubmit(e: SyntheticEvent<HTMLFormElement>, idProduct: number) {
        e.preventDefault();
        const target = e.currentTarget;
        const data = new FormData(target);
        data.append('id_product', String(idProduct));

        try {
            const fetchSaveProduct = await fetch(`${urlHost}/product`, {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${userData.token}`
                },
                body: data
            });

            const resultProccess = await fetchSaveProduct.json();
            if (resultProccess.protectedRoute == false) {
                await Swal.fire({ icon: 'warning', title: 'Acceso denegado', text: 'No tiene permiso estar en este espacio.' });
                navigate('/productView');
                return;
            }

            if (!fetchSaveProduct.ok || resultProccess.success === false) {
                return Swal.fire({ icon: 'error', title: 'Error', text: resultProccess.error || "Hubo un error al editar el producto." });
            }

            await Swal.fire({ icon: 'success', title: 'Éxito', text: resultProccess.data || "¡Producto editado con éxito!" });
            target.reset();
            setPreview(null);
            setIdProduct(0);
            window.location.reload();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    }

    useEffect(() => {
        if (idProduct == 0) return;
        const searchProduct = async () => {
            const fetchProduct = await fetch(`${urlHost}/product/one/${idProduct}`, {
                method: 'GET',
                headers: { 'authorization': `Bearer ${userData.token}` }
            });
            const resultFetch = await fetchProduct.json();
            if (!fetchProduct.ok || !resultFetch.success) {
                return Swal.fire({ icon: 'error', title: 'Error', text: resultFetch.error });
            };

            setCurrentProduct(resultFetch.data);
            setPreview(resultFetch.data.images);
        }
        searchProduct();
    }, [idProduct])

    return (
        <form
            onSubmit={(e) => { handleSaveSubmit(e, idProduct) }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col gap-5 w-full"
            encType="multipart/form-data"
        >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Editando producto</h2>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="nombre" className="text-sm text-gray-700">Nombre</label>
                <input id="nombre" name="name" type="text"
                    defaultValue={currentProduct?.name}
                    placeholder="Nombre" className={inputStyle} required />
            </div>

            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="coste" className="text-sm text-gray-700">Coste ($)</label>
                    <input id="coste" name="price" type="number" min="0" step="0.01" placeholder="Coste ($)" className={inputStyle} required defaultValue={currentProduct?.price} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="stock" className="text-sm text-gray-700">Stock (u)</label>
                    <input id="stock" name="stock" type="number" min="0" step="1" placeholder="Stock (u)" className={inputStyle} required defaultValue={currentProduct?.stock} />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="categoria" className="text-sm text-gray-700">Categoría</label>
                <input
                    id="categoria"
                    name="category"
                    type="text"
                    list="categorias"
                    placeholder="Seleccione o escriba una categoría"
                    className={inputStyle}
                    defaultValue={currentProduct?.category}
                    required
                />
                <datalist id="categorias">
                    {categories && categories.length > 0 && categories.map((c, index) => (
                        <option key={index} value={c.name} />
                    ))}
                </datalist>
            </div>

            {/* Imagen del producto */}
            <ImageUpload name="image" preview={preview} setPreview={setPreview} />

            {/* Controles */}
            <div className="flex items-center gap-4 pt-2">
                <button type="submit" className="w-full bg-[#e60023] hover:bg-[#c8001f] text-white text-sm font-semibold rounded-xl py-3 shadow-md transition-colors">
                    Guardar cambios
                </button>
            </div>
        </form>
    )
}