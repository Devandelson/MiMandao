import type { ButtonHTMLAttributes } from "react";

export default function Button1({styles, label, click = () => {}}: 
    {styles?: string, label: string, click?: () => void} & ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            className={`mt-3 w-full rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white active:scale-[0.97]
            transition-all cursor-pointer hover:scale-[1.020] ${styles}`}
            onClick={(e) => {
                e.preventDefault();
                click();
            }}
            
        >
            {label}
        </button>
    )
}