// ------------ Components
import HeaderChat from '../../Components/headerChat.tsx';
import Footer from "@src/shared/footer.tsx";
import Aside from "../../Components/verticalMenu/Aside.tsx";
import ContainerChat from "./components/chat/containerChat.tsx";
// ----------- Hooks
import { useState} from "react";

import TabsRequestUser from '@src/shared/utils/tabsUser.ts';

export default function OrderDetail() {
    const [resMenu, setResMenu] = useState(false);
    const [idOrder, setIdOrder] = useState<number | null>(null);
    const manageView  = TabsRequestUser.map((item) => {
        return {...item, 'focus': item.id == 'manage'}
    });

    return (
        <>
            <div className={`flex h-[calc(100vh-5rem)] gap-4 bg-slate-50 p-3 text-slate-900 lg:gap-6 lg:p-6 ${resMenu ? '' : 'overflow-hidden'}`}>
                {/* ---------- Orders menu ---------- */}
                <Aside stateMenu={resMenu} setIdOrder={setIdOrder}></Aside>

                {/* ---------- Chat ---------- */}
                <main className={`flex flex-1 flex-col ${resMenu ? '' : 'overflow-hidden'}`}>
                    <HeaderChat toggleMenu={() => {
                        setResMenu((prev) => prev == true ? false : true);
                    }} stateMenu={resMenu}></HeaderChat>

                    <ContainerChat idOrder={idOrder}></ContainerChat>
                </main>
            </div>
            <Footer tabs={manageView}></Footer>
        </>
    )
}