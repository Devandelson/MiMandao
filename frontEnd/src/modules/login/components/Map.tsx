import { useRef, useState } from 'react';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB



export default function ImageUpload() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Solo se permiten imágenes PNG, JPG o JPEG.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_SIZE) {
            setError('La imagen no debe superar los 2MB.');
            e.target.value = '';
            return;
        }

        setError(null);
        setPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    };

    const handleRemove = () => {
        setPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full text-left flex flex-col gap-1">
            <p className="font-semibold text-base sm:text-lg mb-1">
                Imagen del lugar (Opcional)
            </p>

            <input
                ref={inputRef}
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleChange}
                name='map'
                className="hidden"
            />

            {preview ? (
                <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden">
                    <img
                        src={preview}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 rounded-full bg-black/60 text-white px-3 py-1 text-sm hover:bg-black/80"
                    >
                        Quitar
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full h-40 sm:h-48 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition"
                >
                    <span className="font-medium">Haga clic para subir una imagen</span>
                    <span className="text-xs">PNG, JPG o JPEG (máx. 2MB)</span>
                </button>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}