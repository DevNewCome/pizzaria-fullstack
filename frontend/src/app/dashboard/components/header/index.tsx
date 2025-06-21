"use client"

import styles from './style.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import logoImg from '/public/logo.svg'
import { LogOutIcon } from 'lucide-react'
import { deleteCookie } from 'cookies-next'
import {useRouter} from 'next/navigation'
export function Header(){
const router = useRouter()
    async function handleLogout(){
        deleteCookie('session',{path: '/'} )
        router.replace('/')
    }

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                <Image
                    alt="logo Sujeito programador"
                    src={logoImg}
                    width={190}
                    height={60}
                    priority={true}
                    quality={100}
                />
                </Link>
                <nav>
                    <Link href="/dashboard/category">
                        Categoria
                    </Link>
                    <Link href="/dashboard/product">
                        Produto
                    </Link>

                    <form action={handleLogout}>
                        <button>
                           <LogOutIcon size={24} color='#FFF'/>
                        </button>
                    </form>
                </nav>
            </div>
        </header>
    )
}