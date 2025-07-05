"use client"

import styles from './styles.module.scss'
import { X } from 'lucide-react'
import {use} from 'react'
import { OrderContext } from '@/providers/order'

export function Modalorder(){
const {onRequestClose, order, finishOrder} = use(OrderContext)

async function handleFinishOrder(){
  await finishOrder(order[0].order.id)
}

  return(
    <dialog className={styles.dialogContainer}>

     <section className={styles.dialogContent}>
        <button className={styles.dialogBack} onClick={onRequestClose}>
          <X size={40} color="#FF3f4b" />
        </button>

        <article className={styles.container}>
          <h2>Detalhes do pedido</h2>

          <span className={styles.table}>
            Mesa <b>{order[0].order.table}</b>
          </span>
          {order[0].order?.name && (
            <span className={styles.table}>
            Cliente <b>{order[0].order.name}</b>
            </span>
          )}

         {order.map(item => (
           <section className={styles.item}>
            <span>{item.amount} - <b>{item.product.name}</b></span>
            <span className={styles.description}>{item.product.description}</span>
          </section>
         ))}
         

          <button className={styles.buttonOrder} onClick={handleFinishOrder}>
            Concluir pedido
          </button>

        </article>

     </section>

    </dialog>
  )
}