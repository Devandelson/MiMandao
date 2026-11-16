import Filter from "@shared/smallComponents/filter.tsx"
import Search from "./search"

// types
import type categoriesProps from '../../types/categories.ts';
import type productsProps from "../../types/product.ts";

export default function MainFilterComponent({categories, setCategories, setProducts}: {
    categories: categoriesProps[],
    setCategories: React.Dispatch<React.SetStateAction<categoriesProps[]>>,
    setProducts: React.Dispatch<React.SetStateAction<productsProps[]>>,
}) {
    return (
        <>
            <Filter categories={categories} setCategories={setCategories}></Filter>
            <Search setProducts={setProducts}></Search>
        </>
    )
}