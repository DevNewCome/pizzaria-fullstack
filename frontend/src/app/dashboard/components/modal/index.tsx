"use client"

import styles from './styles.module.scss'
import { X } from 'lucide-react'
import {use} from 'react'
import { OrderContext } from '@/providers/order'

export function Modalorder(){
const {onRequestClose} = use(OrderContext)

  return(
    <dialog className={styles.dialogContainer}>

     <section className={styles.dialogContent}>
        <button className={styles.dialogBack} onClick={onRequestClose}>
          <X size={40} color="#FF3f4b" />
        </button>

        <article className={styles.container}>
          <h2>Detalhes do pedido</h2>

          <span className={styles.table}>
            Mesa <b>36</b>
          </span>

          <section className={styles.item}>
            <span>1 - <b>Pizza catupiry</b></span>
            <span className={styles.description}>Pizza de frango com catupiry, borda recheada</span>
          </section>

          <section className={styles.item}>
            <span>3 - <b>Pizza calabresa</b></span>
            <span className={styles.description}>Pizza de frango com catupiry, borda recheada</span>
          </section>          

          <button className={styles.buttonOrder}>
            Concluir pedido
          </button>

        </article>

     </section>

    </dialog>
  )
}