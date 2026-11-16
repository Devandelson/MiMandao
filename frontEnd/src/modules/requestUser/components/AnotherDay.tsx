import type React from "react";
import type { ordersUsers, orderProps, groupOrder } from "../types/orders";

import ContainerDate from "./DateRequest/container.tsx";
import { useState } from "react";

const urlHost = import.meta.env.VITE_API_URL;
import dataSing from "@src/context/login/Datasing.tsx";

export default function AnotherDay({ infoOrderUsers, setCurrentOrder }: {
    infoOrderUsers: ordersUsers,
    setCurrentOrder: React.Dispatch<React.SetStateAction<orderProps | null>>
}) {
    const [filtered, setFiltered] = useState<groupOrder[] | null>(null);
    const [start, setStart] = useState('');
    const [limit, setLimit] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userData = dataSing.getState().data;

    const dataToShow = filtered ?? infoOrderUsers.anotherOrders ?? [];

    const pill = `flex-1 min-w-35 px-4 py-2.5 text-sm rounded-full bg-gray-100 outline-none
    hover:bg-gray-200/70 focus:ring-2 focus:ring-gray-900/20 transition`;

    async function handleSearch() {
        if (!start || !limit) return setError('Selecciona ambas fechas');
        if (start > limit) return setError('La fecha inicial no puede ser mayor a la final');

        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${urlHost}/order/filterDateAnother/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify({ start, limit }),
            });
            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.error ?? 'No se pudo filtrar');
            }
            setFiltered(result.data ?? []);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    }

    function handleRefresh() {
        setStart('');
        setLimit('');
        setError('');
        setFiltered(null);
    }

    return (
        <>
            <ContainerDate
                data={dataToShow}
                title="Días anteriores"
                typeDate="anotherOrders"
                setCurrentOrder={setCurrentOrder}
            >
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                    className="w-full flex flex-wrap items-center gap-2"
                >
                    <input type="date" value={start} max={limit || undefined}
                        onChange={(e) => setStart(e.target.value)} className={pill} />
                    <input type="date" value={limit} min={start || undefined}
                        onChange={(e) => setLimit(e.target.value)} className={pill} />

                    <button
                        type="submit"
                        disabled={loading || !start || !limit}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#e60023]
        hover:bg-[#ad081b] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Buscando…' : 'Buscar'}
                    </button>

                    {(filtered || start || limit) && (
                        <button type="button" onClick={handleRefresh} disabled={loading}
                            className="px-4 py-2.5 rounded-full text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition">
                            Limpiar
                        </button>
                    )}

                    {error && <p className="w-full px-2 text-xs text-red-500">{error}</p>}
                    {filtered && !error && (
                        <p className="w-full px-2 text-xs text-gray-500">
                            {filtered.length} resultado{filtered.length !== 1 && 's'}
                        </p>
                    )}
                </form>
            </ContainerDate>
        </>
    )
}