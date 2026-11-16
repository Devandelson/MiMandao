import type productsProps from "@src/modules/sale/user/types/product";

export default interface GetOrder {
    id_order: number,
    id_user: number,
    date: string,
    total: number,
    process_state: string,
    id_message?: number
    order?: (productsProps & {ud: number})[]
    message: string
    images?: string[]
}