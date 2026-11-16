import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTableCellsLarge, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'

const default_TABS = [
    { id: 'create', label: 'Crear nuevo pedido', icon: faPlus, path: '/productView', focus: true },
    { id: 'manage', label: 'Gestionar pedido', icon: faTableCellsLarge, path: '/order', focus: false },
]

interface TabsProps {
    tabs?: {
        id: string,
        label: string,
        icon: IconDefinition,
        path: string,
        focus: boolean
    }[]
}

// shared focus style so keyboard users always see where they are
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

export default function Footer({ tabs = default_TABS }: TabsProps) {
    const navigate = useNavigate();

    function handleNavigate(tab: any) {
        navigate(tab.path);
    }

    return (
        <nav
            aria-label="Acciones de pedido"
            className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-3xl border border-slate-200/70 bg-white px-3 py-1.5 max-md:px-2 max-md:py-1 lg:py-1 
            shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
        >
            <ul className="flex items-end gap-6 max-md:gap-4 lg:gap-3 list-none">
                {tabs.map((tab) => {
                    const active = tab.focus;

                    const iconWrapperStyle = active
                        ? 'border-[#d9e3ec] bg-blue-400 text-white shadow-2xl/50'
                        : 'border-white bg-gray-200 text-slate-700'

                    return (
                        <li key={tab.id}>
                            <button
                                type="button"
                                aria-current={active ? 'page' : undefined}
                                onClick={() => handleNavigate(tab)}
                                className={`relative flex h-16 max-md:h-12 flex-col items-center justify-end gap-1 max-md:gap-0.5 pb-2.5 max-md:pb-2 px-4 max-md:px-3 cursor-pointer rounded-2xl ${focusRing} group`}
                            >
                                <span className={`p-2 max-md:p-1.5 px-3 max-md:px-2.5 rounded-full transition-all box-border
                                hover:shadow-2xl/50 ${iconWrapperStyle}
                                group-hover:-translate-y-2 border-8 max-md:border-4
                                `}>
                                    <FontAwesomeIcon icon={tab.icon} className={active ? 'text-base max-md:text-sm' : 'text-lg max-md:text-base'} />
                                </span>

                                <span className={`text-sm max-md:text-xs transition-all ${active ? 'font-semibold text-blue-700' : 'text-slate-500'}
                                group-hover:-translate-y-1 text-nowrap`}>
                                    {tab.label}
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}