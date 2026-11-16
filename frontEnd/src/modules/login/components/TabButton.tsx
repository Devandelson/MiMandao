import { Link } from "react-router";

export default function TabLoginButton({ state = false, text, path }: { state: boolean, text: string, path: string }) {
    const classSpan = state ? 'bg-[#c27d38]' : 'bg-gray-600';
    const classBg = state ? 'bg-[#c27d38]' : 'bg-gray-600';

    return (
        <div className="flex flex-col items-center">
            <span className={`h-6 sm:h-8 w-1.5 ${classSpan}`} />
            <Link to={`${path}`}>
                <button
                    className={`cursor-pointer rounded-full px-6 py-2 text-xs text-white transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${classBg}`}
                >
                    {text}
                </button>
            </Link>
        </div>
    )
}