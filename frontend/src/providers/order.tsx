"use client"

import {createContext, ReactNode, useState} from 'react'
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
interface OrderItemProps{
    id:string;
    amount:string;
    create_at:string;
    order_id:string;
    product_id:string;
    product:{
        id:string;
        name:string;
        price:string;
        banner:string;
        category_id:string;
    }
    order:{
        id:string;
        table:number;
        name:string;
        draft:boolean;
        status:boolean
    }
}

    type OrderContextData = {
        isOpen: boolean;
        onRequestOpen: (order_id: string) => void;
        onRequestClose: () => void;
    }

    type OrderProviderProps = {
        children: ReactNode;
    }

export const OrderContext = createContext({} as OrderContextData)
export function OrderProvider({children}: OrderProviderProps){
const [isOpen, setIsOpen] = useState(false);
const [order, setOrder] = useState<OrderItemProps[]>([])

 async function onRequestOpen(order_id: string){
    const token = await getCookieClient()
    const response = await api.get('/order/detail',{
        headers:{
            Authorization: `Bearer ${token}`
        },
        params:{
            order_id: order_id
        }
    })
    console.log(response.data)
    setIsOpen(true)
}

function onRequestClose(){
    setIsOpen(false)
}

    return(
        <OrderContext.Provider 
        value={{
            isOpen,
            onRequestOpen,
            onRequestClose
            }}>
            {children}
        </OrderContext.Provider>
    )
}