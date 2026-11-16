import { create } from "zustand"

interface pageProps {
    page: {
        limit: number, page: number
    },
    setPage: (newPage: { limit: number, page: number }) => void
}

const configPage = create<pageProps>()((set) => ({
    page: { limit: 1, page: 0 },
    setPage: (newPage) => set({ page: newPage })
}));

export default configPage;