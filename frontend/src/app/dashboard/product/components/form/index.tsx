"use client"

import { ChangeEvent, useState } from 'react'
import styles from './styles.module.scss'
import { UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/app/dashboard/components/button'
import { api } from '@/services/api'
import { getCookieClient } from '@/lib/cookieClient'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CategoryProps {
  id: string;
  name: string;
}

interface Props {
  categories: CategoryProps[];
}

export function Form({ categories }: Props) {
  const router = useRouter()
  const [image, setImage] = useState<File>()
  const [previewImage, setPreviewImage] = useState("")

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        toast.warning("Formato da imagem não permitido")
        return
      }

      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  async function handleRegisterProduct(formData: FormData) {
    const categoryIndex = formData.get("category")
    const name = formData.get("name")
    const price = formData.get("price")
    const description = formData.get("description")

    if (
      !name ||
      !categoryIndex ||
      !price ||
      !description ||
      !image
    ) {
      toast.warning('Preencha todos os campos')
      return
    }

    const data = new FormData()
    data.append("name", String(name))
    data.append("price", String(price))
    data.append("description", String(description))
    data.append("category_id", categories[Number(categoryIndex)].id)
    data.append("file", image)

    try {
      const token = await getCookieClient()
      await api.post('/product', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success("Cadastrado com sucesso")
      router.push('/dashboard')
    } catch (error) {
      toast.warning("Erro ao cadastrar produto")
    }
  }

  return (
    <main className={styles.container}>
      <h1>Novo produto</h1>

      <form className={styles.form} action={handleRegisterProduct}>
        <label className={styles.labelImage}>
          <span>
            <UploadCloud size={30} color="#FFF" />
          </span>

          <input
            type="file"
            accept="image/png, image/jpeg"
            required
            onChange={handleFile}
          />

          {previewImage && (
            <div className={styles.imageWrapper}>
              <Image
                alt="Imagem de preview"
                src={previewImage}
                className={styles.preview}
                fill
                quality={100}
                priority
              />
            </div>
          )}
        </label>

        <select name="category" className={styles.input}>
          {categories.map((categorie, index) => (
            <option key={categorie.id} value={index}>
              {categorie.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Digite o nome do produto..."
          required
          className={styles.input}
        />

        <input
          type="text"
          name="price"
          placeholder="Preço do produto..."
          required
          className={styles.input}
        />

        <textarea
          className={styles.input}
          placeholder="Digite a descrição do produto..."
          required
          name="description"
        ></textarea>

        <Button name="Cadastrar produto" />
      </form>
    </main>
  )
}
