import ItemContainerDate from "../DateRequest/itemContainer.tsx";

// types
import type { groupOrder, orderProps } from "../../types/orders.ts";

export default function ContainerDate(
    { title, data, children, typeDate, setCurrentOrder }:
        {
            title: string,
            data: groupOrder[]
            children?: React.ReactNode
            typeDate: string
            setCurrentOrder: React.Dispatch<React.SetStateAction<orderProps | null>> 
    }) {

    const mb = data && data.length > 1 && 'mb-5';

    return (
        <section>
            <header className="w-full h-auto flex items-center gap-2 flex-wrap justify-between mb-4">
                <h2 className="font-bold text-2xl">{title}</h2>
                {children}
            </header>

            <nav className="w-full max-h-150 overflow-y-scroll scrollbar-thin">
                <ul className={`list-none w-full h-auto flex items-top gap-5 flex-wrap ${mb}`}>
                    {data && data.length > 0 && (
                        data.map((item, index) => (
                            <ItemContainerDate setCurrentOrder={setCurrentOrder} key={index} {...item} typeDate={typeDate}></ItemContainerDate>
                        ))
                    )}
                </ul>
            </nav>
        </section>
    )
}