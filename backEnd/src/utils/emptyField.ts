type Field = {
    value: string | number | null | undefined;
    type: 'string' | 'number';
};

export default async function emptyField(data: Field[]) {
    return data.map(({ value, type }) => {
        if (value === null || value === undefined || !value) return false;

        const text = String(value).trim();
        if (type == 'string' && text === '') return false;
        if (type === 'number') return !isNaN(Number(text));

        return true;
    }).includes(false) ? false : true;
}