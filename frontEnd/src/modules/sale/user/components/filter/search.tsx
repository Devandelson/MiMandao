// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import type productsProps from "../../types/product.ts";

import dataSing from '@src/context/login/Datasing.tsx';
import type { SyntheticEvent } from 'react';
import Swal from 'sweetalert2';
const urlHost = import.meta.env.VITE_API_URL;

export default function Search({ setProducts }: {
    setProducts: React.Dispatch<React.SetStateAction<productsProps[]>>,
}) {
    const userData = dataSing.getState().data;
    async function handleSearch(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.currentTarget;
        const input = target.input.value;
        if (input == '') return;

        // product
        const searchFetch = await fetch(`${urlHost}/product/${input}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${userData.token}`
            }
        });
        const resultFetch = await searchFetch.json();
        const data = resultFetch.data as productsProps[];
        if (resultFetch.success == false) {
            Swal.fire({ icon: 'error', title: 'Error', text: resultFetch.error });
            return;
        };

        if (data.length < 1) {
            return Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No se encontraron productos' });
        }
        setProducts(data);
    }

    return (
        <form className="flex items-center gap-3 flex-wrap w-full mt-2"
            method='GET'
            onSubmit={handleSearch}
        >
            <span className="group flex flex-1 items-center rounded-lg border border-slate-200 bg-white pl-4 pr-1.5 py-1.5 shadow-sm/5 transition-all duration-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <input
                    type="text"
                    placeholder="Buscar producto...."
                    aria-label="Buscar producto"
                    className="flex-1 min-w-0 bg-transparent text-[16px] text-slate-900 placeholder:text-slate-400 outline-none"
                    name='input'
                />
                <button
                    aria-label="Buscar"
                    className="flex p-2 px-3 gap-1.5 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/30 transition-all duration-200 hover:bg-blue-700 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 cursor-pointer"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
                    <p className='max-sm:hidden'>Buscar</p>
                </button>
            </span>
        </ form>
    )
}