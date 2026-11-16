export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function formatDayLabel(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) return 'Hoy';
    if (isSameDay(date, yesterday)) return 'Ayer';

    // Incluye el año solo si es distinto al actual
    return date.toLocaleDateString('es-DO', {
        day: 'numeric',
        month: 'long',
        ...(date.getFullYear() !== today.getFullYear() && { year: 'numeric' })
    });
}