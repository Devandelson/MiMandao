import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface dataProcessGoogle {
    data: {
        name: string
        password: string
        email: string
    };
    setData: (data: dataProcessGoogle['data']) => void;
}

const dataProcessG = create<dataProcessGoogle>()(persist(
    (set) => ({
        data: {
            name: '',
            password: '',
            email: ''
        },
        setData: async (newData) => set({ data: newData }),
    }),
    {
        name: 'credentialsGoogle',
        storage: createJSONStorage(() => sessionStorage)
    }
));

export default dataProcessG;