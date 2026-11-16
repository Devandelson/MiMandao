// ------------ Resources
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPaperclip,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"

export default function SendControl() {
    return (
        <section className="border-t border-slate-100 p-3 lg:p-4">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-2 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600">
                <button
                    aria-label="Adjuntar archivo"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                    <FontAwesomeIcon icon={faPaperclip} />
                </button>
                <input
                    type="text"
                    placeholder="Escribe un mensaje"
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                    aria-label="Enviar mensaje"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </section>
    )
}