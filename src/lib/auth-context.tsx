"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react"
import {
    login as apiLogin,
    register as apiRegister,
    getMe,
    logout as apiLogout,
    AuthData,
} from "./api"

interface User {
    name: string
    email: string
    role: string
}

interface AuthContextValue {
    user: User | null
    isLoggedIn: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Restore session on mount
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setIsLoading(false)
            return
        }
        getMe()
            .then((data) => {
                if (data) {
                    setUser({ name: data.name, email: data.email, role: data.role })
                } else {
                    // Token is invalid — clean up
                    localStorage.removeItem("token")
                }
            })
            .catch(() => {
                localStorage.removeItem("token")
            })
            .finally(() => setIsLoading(false))
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        const data: AuthData = await apiLogin(email, password)
        setUser({ name: data.name, email: data.email, role: data.role })
    }, [])

    const signup = useCallback(
        async (name: string, email: string, password: string) => {
            const data: AuthData = await apiRegister(name, email, password)
            setUser({ name: data.name, email: data.email, role: data.role })
        },
        []
    )

    const logout = useCallback(() => {
        apiLogout()
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
