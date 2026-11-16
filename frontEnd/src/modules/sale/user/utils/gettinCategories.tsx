const hostURL = import.meta.env.VITE_API_URL;
import type categoriesProps from "../types/categories";

export default async function gettingCategory(
    token: string,
    setCategories: React.Dispatch<React.SetStateAction<categoriesProps[]>>,
    userCategory?: string) {
    const resultFetch = await fetch(`${hostURL}/category`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const result = await resultFetch.json();
    const dataCategories = result.data as Array<categoriesProps>;
    // {id_category: 1, name: 'Electrónica'}

    setCategories(() => {
        return dataCategories.map((item, index) => {
            return {
                name: item.name,
                state: userCategory && userCategory !== '' ? (userCategory) == item.name :
                    index == 0
            }
        })
    });
}