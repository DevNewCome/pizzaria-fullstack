import styles from './styles.module.scss'
import { Button } from "@/app/dashboard/components/button"
import { api } from '@/services/api'
import { redirect } from 'next/navigation'
import { getCookieServer } from '@/lib/cookieServer'
import { cookies } from "next/headers";

export default function Category(){

  async function handleRegisterCategory(formData: FormData){
    "use server"
    
    const name = formData.get("name") // pega do input name

    if(name === "") return;

    const data = {
      name: name,
    }

    const token = await getCookieServer();
    // console.log("Token recebido:", token); 
    
        if (!token) {
        console.error("Token não encontrado");
        return;
    }
    await api.post("/category", data, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .catch((err) => {
      console.log(err);
      return;
    })

    redirect("/dashboard")

  }


  return(
    <main className={styles.container}>
      <h1>Nova Categoria</h1>

      <form 
        className={styles.form}
        action={handleRegisterCategory}
      >
        <input 
          type="text"
          name="name"
          placeholder="Nome da categoria, ex: Pizzas"
          required
          className={styles.input}
        />

        <Button name="Cadastrar" />
      </form>
    </main>
  )
}