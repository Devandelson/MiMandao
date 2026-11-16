import { create } from "zustand";

interface credentialsProps {
    id_user: number | null
    setIdUser: (id: number | null) => void
}

const useCredentialUser = create<credentialsProps>()((set) => ({
    id_user: null,
    setIdUser: (id) => {set({id_user: id})}
}));

export default useCredentialUser;