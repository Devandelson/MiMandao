import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

export default function EmptyChat() {
    return (
        <section className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl text-blue-600">
                <FontAwesomeIcon icon={faComments} />
            </span>
            <h2 className="text-lg font-semibold text-slate-800">
                Ningún pedido seleccionado
            </h2>
            <p className="max-w-xs text-sm text-slate-500">
                Elige un pedido del menú para ver su conversación y los detalles.
            </p>
        </section>
    );
}