/**
 * API Service Layer
 * Handles all communication with the Spring Boot backend (port 8080)
 * and Python AI service (port 8001).
 */
import { Product, Category, SearchResult } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
const AI_API_BASE = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8001/api"

// ─── Product APIs ────────────────────────────────────────────────

export async function fetchProducts(category?: string): Promise<Product[]> {
    const url = category
        ? `${API_BASE}/products?category=${encodeURIComponent(category)}`
        : `${API_BASE}/products`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch products")
    return res.json()
}

export async function fetchProductById(id: number): Promise<Product | null> {
    const res = await fetch(`${API_BASE}/products/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Failed to fetch product")
    return res.json()
}

export async function searchProducts(query: string): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error("Failed to search products")
    return res.json()
}

export async function fetchRelatedProducts(id: number, limit = 4): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/${id}/related?limit=${limit}`)
    if (!res.ok) throw new Error("Failed to fetch related products")
    return res.json()
}

// ─── Category APIs ───────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`)
    if (!res.ok) throw new Error("Failed to fetch categories")
    return res.json()
}

// ─── Visual Search API (Python AI Service) ───────────────────────

export async function visualSearch(imageFile: File): Promise<SearchResult[]> {
    const formData = new FormData()
    formData.append("image", imageFile)

    const res = await fetch(`${AI_API_BASE}/search/visual`, {
        method: "POST",
        body: formData,
    })
    if (!res.ok) throw new Error("Visual search failed")
    const data = await res.json()
    return data.results
}

// ─── Auth helpers ────────────────────────────────────────────────

function getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
}

function authHeaders(): HeadersInit {
    const token = getToken()
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

// ─── Auth APIs ───────────────────────────────────────────────────

export interface AuthData {
    token: string
    name: string
    email: string
    role: string
}

export async function register(name: string, email: string, password: string): Promise<AuthData> {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Registration failed")
    localStorage.setItem("token", data.token)
    return data
}

export async function login(email: string, password: string): Promise<AuthData> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Invalid email or password")
    localStorage.setItem("token", data.token)
    return data
}

export async function getMe(): Promise<AuthData | null> {
    const token = getToken()
    if (!token) return null
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    return res.json()
}

export function logout() {
    localStorage.removeItem("token")
}

// ─── Cart APIs (require auth) ────────────────────────────────────

export interface CartItemData {
    id: number
    productId: number
    productName: string
    productImage: string
    category: string
    price: number
    originalPrice: number | null
    quantity: number
    selectedColor: string | null
    selectedSize: string | null
    inStock: boolean
}

export async function getCart(): Promise<CartItemData[]> {
    const res = await fetch(`${API_BASE}/cart`, { headers: authHeaders() })
    if (!res.ok) throw new Error("Failed to fetch cart")
    return res.json()
}

export async function addToCart(
    productId: number,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
): Promise<CartItemData> {
    const res = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ productId, quantity, selectedColor, selectedSize }),
    })
    if (!res.ok) throw new Error("Failed to add to cart")
    return res.json()
}

export async function updateCartItem(productId: number, quantity: number): Promise<void> {
    await fetch(`${API_BASE}/cart/${productId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ quantity }),
    })
}

export async function removeCartItem(productId: number): Promise<void> {
    await fetch(`${API_BASE}/cart/${productId}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
}

export async function clearCart(): Promise<void> {
    await fetch(`${API_BASE}/cart`, {
        method: "DELETE",
        headers: authHeaders(),
    })
}

// ─── Order APIs (require auth) ───────────────────────────────────

export async function placeOrder(): Promise<{ orderId: number; total: number }> {
    const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to place order")
    return data
}

export async function getOrderHistory(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/orders`, { headers: authHeaders() })
    if (!res.ok) throw new Error("Failed to fetch orders")
    return res.json()
}
