// data
import dataSing from "@src/context/login/Datasing";
const urlHost = import.meta.env.VITE_API_URL;


export default async function GetOrders(typeCall: 'limit' | 'all') {
    const userData = dataSing.getState().data;
    const typeRoute = typeCall == 'limit' ? 'userLimit' : 'user';
    
    const fetchUserOrders = await fetch(`${urlHost}/order/${typeRoute}/${userData.id_user}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${userData.token}`
        },
        credentials: 'include'
    });
    const result = await fetchUserOrders.json(); 
    
    if (result.success == false) { return null };
    const data = result.data.map((item: any) => {
        return {...item, active: false}
    });
    return data;    
}