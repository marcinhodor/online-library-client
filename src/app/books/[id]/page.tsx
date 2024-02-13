"use client"

import { AuthContext } from "@/app/context/auth-context"
import { addMonths } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

export default function Book({ params }: { params: { id: number } }) {
  const [book, setBook] = useState<Book>()
  const [holds, setHolds] = useState<Hold[]>([])

  const router = useRouter()

  const { userId } = useContext(AuthContext)

  const handleRent = async () => {
    const res = await fetch(`http://localhost:3500/holds/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_time: new Date().toISOString(),
        end_time: addMonths(new Date(), 1).toISOString(),
        book_id: params.id,
        user_id: userId,
      }),
    })

    if (res.ok) {
      router.push("/")
    } else {
      console.log("Rent failed!")
    }
  }

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`http://localhost:3500/books/one/${params.id}`)
      const data = await res.json()
      setBook(data)
    }
    fetchBook()
  }, [])

  useEffect(() => {
    const fetchHold = async () => {
      const res = await fetch(
        `http://localhost:3500/holds/book/one/${params.id}`
      )

      if (res.status === 404) {
        return
      }

      const data = await res.json()
      setHolds(data)
    }
    fetchHold()
  }, [book])

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Link href="/">Go back</Link>
      {book ? (
        <div key={book.id} className="flex flex-col p-4">
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p className="text-gray-500 text-lg">{book.authors}</p>
          <p className="text-gray-500">{book.publication_year}</p>
          <p className="text-gray-500">Original title: {book.original_title}</p>
          <p className="text-gray-500">ISBN: {book.isbn}</p>
          <p className="text-gray-500">
            {"Language: "}
            <span className="capitalize">{book.language_code}</span>
          </p>
          <p className="text-gray-500">Rating: {book.average_rating}</p>
          <Image
            alt="book cover"
            src={book.image_url}
            priority={true}
            width={200}
            height={300}
            style={{ width: 200, height: 300 }}
          />
          <div className="mt-6">
            {holds?.length > 0 ? (
              "Unavailable"
            ) : (
              <button onClick={handleRent}>Rent this book</button>
            )}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  )
}
