"use client"
import { useContext, useEffect, useState, useRef } from "react"
import { AuthContext } from "../context/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import CountdownTimer from "../components/countDownTimer"

export default function Account() {
  const { userId } = useContext(AuthContext)
  const router = useRouter()

  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")

  const [holds, setHolds] = useState<Hold[]>([])
  const refToHolds = useRef(holds)
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([])

  const handleReturn = async (id: number) => {
    const res = await fetch(`http://localhost:3500/holds/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      console.log("Book returned")
      setHolds(holds.filter((hold) => hold.book_id !== id))
    }
  }

  useEffect(() => {
    if (!userId) {
      return router.push("/login")
    }

    const getUserInfo = async () => {
      const res = await fetch(`http://localhost:3500/auth/user/${userId}`)
      if (res.ok) {
        const data = (await res.json()) as {
          first_name: string
          last_name: string
          email: string
        }
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setEmail(data.email)
      }
    }

    const getHolds = async () => {
      const res = await fetch(`http://localhost:3500/holds/user/${userId}`)
      if (res.ok) {
        const data = (await res.json()) as Hold[]
        setHolds(data)
      }
    }

    getUserInfo()
    getHolds()
  }, [])

  useEffect(() => {
    const getBorrowedBooks = async () => {
      const res = await fetch(`http://localhost:3500/books/many/byIds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IDs: holds.map((hold) => hold.book_id),
        }),
      })

      if (res.ok) {
        const data = (await res.json()) as Book[]
        setBorrowedBooks(data)
      }
    }

    if (refToHolds.current !== holds) {
      getBorrowedBooks()
    }
  }, [holds])

  return (
    <>
      <div className="pb-12">
        <p className="text-2xl">Personal details</p>
        <p>First name: {firstName}</p>
        <p>Last name: {lastName}</p>
        <p>Email: {email}</p>
      </div>
      <div>
        <p className="text-2xl">Borrowed books</p>
        {borrowedBooks.length > 0 ? (
          borrowedBooks.map((book) => {
            return (
              <div key={book.id} className="flex flex-col p-4">
                <p>{book.title}</p>
                <p>{book.authors}</p>
                <Image
                  alt="book cover"
                  src={book.image_url}
                  priority={true}
                  width={100}
                  height={150}
                  style={{ width: 100, height: 150 }}
                />
                {/* <p>
                  {CountdownTimer(
                    holds.filter((hold) => hold.book_id === book.id)[0].end_time
                  )}
                </p> */}
                <button className="w-24" onClick={() => handleReturn(book.id)}>
                  Return book
                </button>
              </div>
            )
          })
        ) : (
          <p>No books borrowed</p>
        )}
      </div>
    </>
  )
}
