"use client"

import { useContext, useEffect } from "react"
import { AuthContext } from "../context/auth-context"

export default function useLocalStorage() {
  const { setUserId } = useContext(AuthContext)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      setUserId(userId)
    }
  }, [])
}
