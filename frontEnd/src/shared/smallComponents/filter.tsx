// -------- resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faAngleRight } from '@fortawesome/free-solid-svg-icons'

// -------- data (same content as before, just not repeated by hand)
// const CATEGORIES = ['Producto 1', 'Producto 2', 'Producto 3']

// shared focus style so keyboard users always see where they are
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

// types
import type categoriesProps from '@src/modules/sale/user/types/categories.ts'

export default function Filter({ categories, setCategories }: {
    categories: categoriesProps[],
    setCategories: React.Dispatch<React.SetStateAction<categoriesProps[]>>
}) {
    function handleCategories(category: string) {
        setCategories((prev) => {
            if (prev.length < 1) { return [] }
            const copyPrev = [...prev].map((item) => {
                return {
                    ...item,
                    'name': item.name,
                    'state': category == item.name
                }
            });
            return copyPrev;
        })
    }

    return (
        <nav aria-label="Filtrar productos" className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300">
            <span className="flex shrink-0 items-center gap-1.5 text-slate-500">
                <FontAwesomeIcon icon={faFilter} />
                <FontAwesomeIcon icon={faAngleRight} className="text-xs" />
            </span>

            <ul className="flex items-center gap-2 list-none">
                {categories.map((item, index) => {
                    return (
                        <li key={index}>
                            <button
                                type="button"
                                aria-pressed={item.state}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategories(item.name);
                                }}
                                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium border transition-colors cursor-pointer ${focusRing} ${item.state
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                                    }`}
                            >
                                {item.name}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}