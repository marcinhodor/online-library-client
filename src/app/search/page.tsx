"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Search() {
  const [error, setError] = useState<string | null>(null)
  const [books, setBooks] = useState<Book[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const booksCount = books?.length || 0

  const [page, setPage] = useState(1)
  const booksPerPage = 10
  const totalPages = Math.ceil(booksCount / booksPerPage)
  const booksToShow = books?.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const author = formData.get("author") as string
    const title = formData.get("title") as string
    const isbn = formData.get("isbn") as string

    const baseUrl = "http://localhost:3500/books/search"
    const url = new URL(baseUrl)
    if (author) url.searchParams.append("authors", author)
    if (title) url.searchParams.append("title", title)
    if (isbn) url.searchParams.append("isbn", isbn)

    if (!author && !title && !isbn) {
      setError("Please enter at least one search term.")
      return
    }
    if (
      (author && author.length < 2) ||
      (title && title.length < 2) ||
      (isbn && isbn.length < 2)
    ) {
      setError("Please enter at least two characters.")
      return
    }

    setIsLoading(true)
    setPage(1)
    const res = await fetch(url.href)
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      setBooks(data)
    } else {
      setError("Search failed!")
    }
    setIsLoading(false)
  }

  function changePage(offset: number) {
    setPage((prev) => prev + offset)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main>
      <section>
        <h1>Search</h1>
        <form onSubmit={handleSubmit} onFocus={() => setError(null)}>
          <input placeholder="Author" name="author" />
          <input type="title" placeholder="Title" name="title" />
          <input type="isbn" placeholder="ISBN" name="isbn" />
          <button type="submit">Search</button>
          <button type="reset">Clear</button>
          {error ? <p>{error}</p> : null}
        </form>
      </section>

      {!isLoading ? (
        <section>
          {booksToShow ? (
            <div>
              <h2>Books found: {booksCount}</h2>
              {booksToShow.map((book: Book) => (
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
                  <button onClick={() => changePage(-1)}>{"<<<"}</button>
                ) : null}
                <span className="mx-4">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <button onClick={() => changePage(1)}>{">>>"}</button>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  )
}
