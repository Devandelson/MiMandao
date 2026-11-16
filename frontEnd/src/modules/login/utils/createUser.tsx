// utils/singFetch.tsx
import type { SyntheticEvent } from 'react'
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export default async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    
}