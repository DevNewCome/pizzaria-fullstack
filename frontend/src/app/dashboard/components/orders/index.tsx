"use client"


import styles from './styles.module.scss'
import { RefreshCw } from 'lucide-react'
import { OrderProps } from '@/lib/order.type'
import { Modalorder } from '../modal'
import { use } from 'react'
import { OrderContext } from '@/providers/order'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
interface Props{
    orders: OrderProps[]
}
export function Orders({orders}: Props){
    const {isOpen,onRequestOpen} = use(OrderContext)
    const router = useRouter()

   async function handleDetailOrder(order_id: string){
        await onRequestOpen(order_id)
    }

    function handleRefreshPage(){
        router.refresh()
        toast.success('Pedidos atualizados com sucesso')
    }

    return(
        <>
        <main className={styles.container}>
            <section className={styles.containerHeader}>
                <h1>Ultimos pedidos</h1>
                <button onClick={handleRefreshPage}>
                    <RefreshCw size={24} color="#3fffa3" />
                </button>
            </section>
            <section className={styles.listOrders}>
                {orders.length === 0 &&(
                    <span className={styles.emptyItem}>Nenhum pedido aberto no momento</span>
                )}
               {orders.map(order => (
                <button 
                key={order.id} 
                className={styles.orderItem} 
                onClick={ () => handleDetailOrder(order.id)}>
                    <div className={styles.tag}></div>
                    <span>Mesa {order.table}</span>
                </button>
               ))}
            </section>
        </main>
        {isOpen && <Modalorder/>}
        </>
    )
}