// -------- data
const hostURL = import.meta.env.VITE_API_URL;
import dataSing from '@src/context/login/Datasing.tsx';
import useCheckToken from '@src/shared/tools/checkToken.ts';
import gettingCategory from './utils/gettinCategories.tsx';
import TabsRequestUser from '@src/shared/utils/tabsUser.ts';

// ------- Compontens
import Footer from '@shared/footer';
import Header from '@shared/header';

import ProductCard from './components/productCard';
import OrderDetail from './components/orderDetail'
import MainFilterComponent from './components/filter/mainComponent'

// hooks
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// types
import type productsProps from './types/product.ts';
import type categoriesProps from './types/categories.ts';
import type salesProps from '@src/shared/salesView/salesProps.ts';

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

export default function UserSale() {
    const [categories, setCategories] = useState<categoriesProps[]>([]);
    const [products, setProducts] = useState<productsProps[]>([]);
    const [order, setOrder] = useState<salesProps[]>([]);
    const tokenStatus = useCheckToken();

    async function gettingProducts() {
        const userData = dataSing.getState().data;
        const currentCategory = categories.filter((item) => {
            return item.state == true
        })[0];

        const resultFetch = await fetch(`${hostURL}/product/all`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${userData.token}`
            },
            body: JSON.stringify({ category: currentCategory.name })
        });
        const infoProducts = await resultFetch.json();
        setProducts(infoProducts.data);
    }

    useEffect(() => {
        if (tokenStatus !== 'valid') return;
        const userData = dataSing.getState().data;
        gettingCategory(userData.token, setCategories, '');
    }, [tokenStatus]);

    useEffect(() => {
        if (categories.length > 0) {
            const callProducts = async () => {
                await gettingProducts();
            };
            callProducts();
        }
    }, [categories])


    return (
        <div className="relative w-full min-h-screen max-w-7xl mx-auto text-slate-900 antialiased">
            <Header></Header>

            {/* ---------- MAIN ---------- */}
            <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full px-6 pt-6 pb-32 flex gap-6 items-start"
            >
                {/* Products */}
                <section className="w-full min-w-0 flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Lista de productos</h1>

                    <div className='mt-3'>
                        <MainFilterComponent
                            categories={categories}
                            setCategories={setCategories}
                            setProducts={setProducts}>
                        </MainFilterComponent>
                    </div>


                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {products.length > 0 && products.map((p, i) => (
                                <motion.div
                                    key={p.id_product}
                                    layout
                                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ ...spring, delay: Math.min(i, 8) * 0.04 }}
                                >
                                    <ProductCard order={order} infoP={p} setOrder={setOrder}>
                                    </ProductCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Order details */}
                <OrderDetail infoProducts={order} setInfoProducts={setOrder}></OrderDetail>
            </motion.main>

            <Footer tabs={TabsRequestUser}></Footer>
        </div>
    )
}