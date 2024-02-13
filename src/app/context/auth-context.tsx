"use client"

import { createContext, useState } from "react"

type AuthContextType = {
  userId: string | null
  setUserId: (userId: string | null) => void
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null)

  const values = {
    userId,
    setUserId,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export default AuthProvider
