import styles from './styles.module.scss'
import { RefreshCw } from 'lucide-react'
export function Orders(){
    return(
        <main className={styles.container}>
            <section className={styles.containerHeader}>
                <h1>Ultimos pedidos</h1>
                <button>
                    <RefreshCw size={24} color="#3fffa3" />
                </button>
            </section>
            <section className={styles.listOrders}>
                <button className={styles.orderItem}>
                    <div className={styles.tag}></div>
                    <span>Mesa 10</span>
                </button>
            </section>
        </main>
    )
}