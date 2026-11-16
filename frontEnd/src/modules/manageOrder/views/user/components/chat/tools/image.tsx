type AttachedImage = {
    id: string;
    file: File;
    previewUrl: string;
};

export const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>, setImages: React.Dispatch<React.SetStateAction<AttachedImage[]>>) => {
    const files = Array.from(e.target.files ?? []);

    const newImages: AttachedImage[] = files
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
            id: crypto.randomUUID(),
            file,
            previewUrl: URL.createObjectURL(file),
        }));

    setImages((prev) => [...prev, ...newImages]);
    e.currentTarget.value = '';
};

export const handleRemoveImage = (id: string, setImages: React.Dispatch<React.SetStateAction<AttachedImage[]>>) => {
    setImages((prev) => {
        const target = prev.find((img) => img.id === id);
        if (target) URL.revokeObjectURL(target.previewUrl);
        return prev.filter((img) => img.id !== id);
    });
};