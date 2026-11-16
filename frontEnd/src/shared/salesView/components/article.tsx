// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faMinus, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

import type salesProps from '../salesProps.ts';

export default function Article({
    infoProducts,
    setInfoProducts,
}: {
    infoProducts: salesProps,
    setInfoProducts: React.Dispatch<React.SetStateAction<salesProps[]>>
}) {
    const subT = (infoProducts.price * infoProducts.ud);
    function handleOp(idP: number, op: 'sum' | 'min') {
        setInfoProducts((prev) =>
            prev
                .map((item) => {
                    if (item.id_product !== idP) return item;

                    const delta = op === 'sum' ? 1 : op === 'min' ? -1 : 0;
                    return { ...item, ud: item.ud + delta };
                })
                .filter((item) => item.ud > 0)
        );
    }

    function handleDelete(idP: number) {
        setInfoProducts((prev) => {
            const copyPrev = [...prev]; 
            return copyPrev.filter((item) => item.id_product != idP);
        })
    }

    return (
        <article className="flex flex-col gap-3 pb-4 border-b border-slate-100">
            <section className="flex items-start gap-3">
                <img src={infoProducts.images} alt="Imagen del producto" className="size-20 shrink-0 rounded-xl object-cover" />

                <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <h4 className="text-sm font-semibold">{infoProducts.name}</h4>
                    <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        <FontAwesomeIcon icon={faFilter} className="text-[10px]" />
                        {infoProducts.category}
                    </p>
                    <ul className="mt-1 list-none text-sm space-y-0.5">
                        <li className="flex justify-between text-slate-500"><span>Precio</span><span className="tabular-nums">${infoProducts.price} DOP</span></li>
                        <li className="flex justify-between font-semibold"><span>Subtotal</span><span className="tabular-nums">${subT} DOP</span></li>
                    </ul>
                </span>
            </section>

            <section className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm text-slate-500">{infoProducts.ud} Elemento/s</p>
                <span className="flex items-center gap-1.5">
                    <button type="button" aria-label="Quitar una unidad" className={`grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer text-xs ${focusRing}`}
                        onClick={(e) => {
                            e.preventDefault(); handleOp(infoProducts.id_product, 'min')
                        }}
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <button type="button" aria-label="Agregar una unidad" className={`grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer text-xs ${focusRing}`}
                        onClick={(e) => {
                            e.preventDefault(); handleOp(infoProducts.id_product, 'sum')
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <button type="button" aria-label="Eliminar producto" className={`grid size-8 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer text-xs ${focusRing}`}
                        onClick={(e) => { e.preventDefault(); handleDelete(infoProducts.id_product); }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </span>
            </section>
        </article>
    )
}