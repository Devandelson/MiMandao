import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface InputProps {
    title: string
    icon: IconDefinition,
    name: string
    holder: string
}

export default function TextArea({title, icon, name, holder}: InputProps) {
    return (
        <div className="relative peer w-full rounded-lg bg-gray-200 p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 flex items-start gap-1.5 inset-shadow-sm pt-5">
            <FontAwesomeIcon icon={icon} className={'text-gray-400 text-xs translate-y-1'} />

            <textarea id={title}  placeholder={holder} className={'bg-transparent border-none outline-none focus:ring-0 focus:outline-none w-full'} name={name}></textarea>

            <label htmlFor={title} className='absolute p-1 px-3 rounded-3xl text-[10px] text-gray-500 -top-3 bg-gray-100'>{title}</label>
        </div>
    )
}   