import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DataSingState {
    data: {
        id_user: number
        name: string
        role: string
        token: string
        statusInfo: boolean
    };
    setData: (data: DataSingState['data']) => void;
}

const dataSing = create<DataSingState>()(persist(
    (set) => ({
        data: {
            id_user: 0,
            name: '',
            role: '',
            token: '',
            statusInfo: false
        },
        setData: (newData) => set({ data: newData }),
    }), {
        name: 'userData',
       storage: createJSONStorage(() => sessionStorage)  
    }
));

export default dataSing;