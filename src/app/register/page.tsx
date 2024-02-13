"use client"
import { useRouter } from "next/navigation"
import { use, useContext, useEffect, useState } from "react"
import useToken from "../hooks/useLocalStorage"
import { AuthContext } from "../context/auth-context"

export default function Register() {
  useToken()
  const { userId } = useContext(AuthContext)
  const [firstName, setFirstName] = useState<string>("Marcin")
  const [lastName, setLastName] = useState<string>("Kowalski")
  const [email, setEmail] = useState<string>("marcin2@email.com")
  const [password, setPassword] = useState<string>("test1234")

  const router = useRouter()

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Send register request
    const res = await fetch("http://localhost:3500/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    })

    if (res.ok) {
      router.push("/login")
    } else {
      console.log("Register failed!")
    }
  }

  useEffect(() => {
    if (userId) {
      router.push("/")
    }
  }, [userId])

  return (
    <form onSubmit={handleRegister}>
      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
  )
}
