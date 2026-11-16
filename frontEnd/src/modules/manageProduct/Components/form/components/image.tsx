// ImageUpload.tsx
import { useRef, type ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";

type Props = {
    name?: string;
    preview: string | null,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
};

export default function ImageUpload({ name = "imagen", preview, setPreview }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (preview) URL.revokeObjectURL(preview);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleRemove = () => {
        if (preview) URL.revokeObjectURL(preview);
        if (inputRef.current) inputRef.current.value = "";
        setPreview(null);
    };

    return (
        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden hover:bg-gray-50">
            {/* The input covers the whole box: click and drag & drop both work */}
            <input
                ref={inputRef}
                name={name}
                type="file"
                accept="image/*"
                onChange={handleChange}
                aria-label="Subir imagen"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {preview ? (
                <>
                    <img src={preview} alt="Vista previa de la imagen" className="w-full aspect-[4/3] object-cover" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        aria-label="Quitar imagen"
                        className="absolute z-10 top-2 right-2 size-8 bg-white rounded-full shadow text-[#e60023] flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                    </button>
                </>
            ) : (
                <div className="py-6 sm:py-8 px-3 flex flex-col items-center gap-2 text-center text-sm text-gray-800">
                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="text-xl text-gray-400" aria-hidden="true" />
                    <span>Arrastre una imagen aquí<br />o haga clic para subir</span>
                </div>
            )}
        </div>
    );
}