export interface userProps {
  id_user?: number
  name: string
  email: string
  map: string
  detail_address?: string
  phone: string
  role?: "admin" | "user"
  state_account: boolean
  type_check: "google" | "normal"
  password: string
}

export interface productProps {
  id_product?: number
  name: string
  stock: number
  date: string | Date
  price: number
  category: string
  images?: string
}

export interface orderProps {
  id_order?: number
  id_user: number
  order: Pick<productProps, "id_product" | 'name' | "images" | "price">[]
  date?: string | Date
  total: number
  process_state?: string
}

export interface messageProps {
  id_message?: number
  id_order: number
  id_user: number
  message: string
  date: string | Date
  images?: string[]
}

export interface category_productProps {
  id_category: number
  name: string
}