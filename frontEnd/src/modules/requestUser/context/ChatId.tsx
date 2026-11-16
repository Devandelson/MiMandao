import { create } from "zustand";

interface chatIdProps {
    idOrder: number | null,
    setIdOrder: (idOrder: number | null) => void
};

const useContextChatId = create<chatIdProps>()((set) => ({
   'idOrder': null,
   setIdOrder: (idOrder) => {set({idOrder: idOrder})}
}));

export default useContextChatId;