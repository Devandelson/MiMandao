export interface groupOrder {
    "id_user": number
    "name": string
    "totalr": number
}

export interface ordersUsers {
    recentsOrder: groupOrder[]
    todayOrders: groupOrder[]
    anotherOrders: groupOrder[]
}

export interface orderProps {
    id_order: number,
    process_state: string,
    order?: {
        "ud": number,
        "date": string,
        "name": string,
        "price": number,
        "stock": number,
        "images": string,
        "category": string,
        "id_product": number
    }[]
}



