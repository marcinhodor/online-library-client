"use client"

import Link from "next/link"
import { useContext } from "react"
import { AuthContext } from "../context/auth-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { userId, setUserId } = useContext(AuthContext)

  const router = useRouter()

  const handleSignOut = async () => {
    const res = await fetch("http://localhost:3500/auth/logout", {
      credentials: "include",
    })

    if (res.ok) {
      setUserId(null)
      localStorage.removeItem("userId")
      router.push("/")
    } else {
      console.log("Logout failed!")
    }
  }

  const notLoggedIn = (
    <>
      <li>
        <Link href="/login">Login</Link>
      </li>
      <li>
        <Link href="/register">Register</Link>
      </li>
    </>
  )

  const loggedIn = (
    <>
      <li>
        <Link href="/account">Account</Link>
      </li>
      <li>
        <button onClick={handleSignOut}>Log out</button>
      </li>
    </>
  )

  return (
    <nav className="py-4">
      <ul className="flex gap-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/search">Search</Link>
        </li>
        {userId ? loggedIn : notLoggedIn}
      </ul>
    </nav>
  )
}
