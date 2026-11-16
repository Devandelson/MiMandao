import type GetOrder from "@src/modules/manageOrder/types/getOrder";

import providerAddress from '@src/assets/providerAddress.png';

export default function MenuDetailProvider({ oneItem, enable = false }: { oneItem: GetOrder | null, enable: boolean }) {
    return (
        enable && (
            <nav className="absolute top-full right-0 z-50 mt-2 w-full max-w-[350px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                {/* Cabecera */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                        AG
                    </div>
                    <div className="leading-tight">
                        <p className="text-xs uppercase tracking-wide text-indigo-100">Proveedor</p>
                        <p className="font-semibold text-white">Andelson Gonzalez</p>
                    </div>
                </div>

                <div className="p-4">
                    {/* Detalles */}
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Detalles de la orden
                    </p>

                    <ul className="max-h-48 divide-y divide-gray-100 overflow-y-auto pr-1 text-sm">
                        {oneItem && oneItem.order?.map((item, index) => {
                            const price = item.price ?? 0;
                            const ud = item.ud ?? 1;
                            const itemTotal = price * ud;

                            return (
                                <li key={index} className="flex items-center justify-between gap-3 py-2.5">
                                    <div className="min-w-0">
                                        <span className="block truncate font-medium text-gray-800">
                                            {item.name ?? 'Producto'}
                                        </span>
                                        <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                                            {ud} ud. × ${price}
                                        </span>
                                    </div>
                                    <span className="shrink-0 font-semibold text-gray-900">
                                        ${itemTotal.toFixed(2)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Ubicación */}
                    <div className="mt-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Ubicación del proveedor
                        </p>
                        <div className="relative overflow-hidden rounded-xl border border-gray-200">
                            <img
                                src={providerAddress}
                                alt="Mapa de ubicación"
                                className="h-28 w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </nav>
        )
    )
}