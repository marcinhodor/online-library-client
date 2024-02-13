"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import useToken from "../hooks/useLocalStorage"
import { useRouter, useSearchParams } from "next/navigation"

export default function Main() {
  useToken()

  const router = useRouter()
  const params = useSearchParams()

  let initialPage: number | null = Number(params.get("page"))
  if (!initialPage || initialPage < 1) {
    initialPage = 1
  }

  const [books, setBooks] = useState<Book[]>([])
  const [page, setPage] = useState(initialPage)

  const fetchBooks = async (page: number = 1) => {
    const baseUrl = "http://localhost:3500/books"
    const url = new URL(baseUrl)
    url.searchParams.append("page", page.toString())
    const res = await fetch(url.href)
    const data = await res.json()
    setBooks(data)
  }

  useEffect(() => {
    router.replace(`/?page=${page}`, { scroll: false })
    fetchBooks(page)
  }, [page])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {books.map((book: Book) => (
        <div key={book.id} className="flex flex-col w-full p-4">
          <Link href={`/books/${book.id}`}>
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-gray-500 text-lg">{book.authors}</p>
            <p className="text-gray-500">{book.publication_year}</p>
            <Image
              alt="book cover"
              src={book.image_url}
              priority={true}
              width={100}
              height={150}
              style={{ width: 100, height: 150 }}
            />
          </Link>
        </div>
      ))}
      <div>
        {page > 1 ? (
          <button onClick={() => setPage(page - 1)}>{"<<<"}</button>
        ) : null}
        <span className="mx-4">{page}</span>
        <button onClick={() => setPage(page + 1)}>{">>>"}</button>
      </div>
    </main>
  )
}
