// components
// import Filter from "@shared/smallComponents/filter.tsx"
import Footer from "@src/shared/footer.tsx";
import MainFilterComponent from "../sale/user/components/filter/mainComponent.tsx";

import Header from "@src/modules/requestUser/components/header.tsx";
import SaveForm from "./Components/form/saveForm.tsx";
import EditForm from "./Components/form/editForm.tsx";
import ItemProduct from "./Components/product.tsx";

// hooks
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// types
import type productsProps from '@src/modules/sale/user/types/product.ts';
import type categoriesProps from '@src/modules/sale/user/types/categories.ts';

// -------- data
const hostURL = import.meta.env.VITE_API_URL;
import gettingCategory from '@src/modules/sale/user/utils/gettinCategories.tsx';
import dataSing from "@src/context/login/Datasing.tsx";
import TabsRequest from "@src/shared/utils/tabsAdmin.ts";

// tools
import useCheckToken from "@src/shared/tools/checkToken.ts";

// animation
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const

export default function ManageProduct() {
    const [categories, setCategories] = useState<categoriesProps[]>([]);
    const [products, setProducts] = useState<productsProps[]>([]);
    const [idProduct, setIdProduct] = useState<number>(0);
    const tokenStatus = useCheckToken();
    
    const manageView  = TabsRequest.map((item) => {
        return {...item, 'focus': item.id == 'manage'}
    });
    
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
        
        const getCategories = async () => {
            const userData = dataSing.getState().data;
            await gettingCategory(userData.token, setCategories, '');
        };
        getCategories();
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
        <>
            <Header></Header>
            <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-auto bg-gray-50 px-4 py-4 sm:px-6 sm:py-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] items-start mb-25"
            >

                <motion.section
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.1 }}
                    className="grid gap-6 md:grid-cols-2 md:items-start lg:grid-cols-1 lg:sticky lg:top-24 h-auto lg:overflow-y-auto lg:pr-1"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={idProduct == 0 ? 'save' : 'edit'}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            {
                                idProduct == 0 ? (<SaveForm categories={categories}></SaveForm>) :
                                    (<EditForm idProduct={idProduct} setIdProduct={setIdProduct} categories={categories} />)
                            }
                        </motion.div>
                    </AnimatePresence>

                    {/* Importación de productos */}
                    {/* <SectionImports></SectionImports> */}
                </motion.section>

                <section className="rounded-xl pt-0 lg:pt-4 min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight">Lista de productos</h1>
                    <div className='mt-3'>
                        <MainFilterComponent
                            categories={categories}
                            setCategories={setCategories}
                            setProducts={setProducts}>
                        </MainFilterComponent>
                    </div>

                    <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 sm:gap-4">
                        <AnimatePresence mode="popLayout">
                            {products && products.length > 0 && (
                                products.map((item, i) => (
                                    <motion.div
                                        key={item.id_product}
                                        layout
                                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ ...spring, delay: Math.min(i, 8) * 0.04 }}
                                    >
                                        <ItemProduct key={i} {...item} setIdProduct={setIdProduct}></ItemProduct>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </motion.main>
            <Footer tabs={manageView}></Footer>
        </>
    )
}