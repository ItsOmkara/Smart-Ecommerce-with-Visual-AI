"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
    getCart,
    addToCart as apiAddToCart,
    updateCartItem as apiUpdateCartItem,
    removeCartItem as apiRemoveCartItem,
    clearCart as apiClearCart,
    CartItemData,
} from "./api"
import { useAuth } from "./auth-context"
import { Product, CartItem } from "./types"

interface CartContextValue {
    cartItems: CartItem[]
    cartCount: number
    cartOpen: boolean
    setCartOpen: (open: boolean) => void
    addToCart: (product: Product, quantity?: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    removeItem: (productId: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

// Key used to store a pending add-to-cart action for guests
const PENDING_CART_KEY = "pendingCartAction"

export function CartProvider({ children }: { children: ReactNode }) {
    const { isLoggedIn, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [cartOpen, setCartOpen] = useState(false)

    // ── Load cart when auth state settles ──────────────────────────
    useEffect(() => {
        if (authLoading) return

        if (isLoggedIn) {
            // Fetch server cart and merge any pending guest action
            getCart()
                .then((serverItems) => {
                    const items: CartItem[] = serverItems.map(backendToLocal)
                    setCartItems(items)

                    // Restore a pending cart action that was saved before login
                    const pending = localStorage.getItem(PENDING_CART_KEY)
                    if (pending) {
                        localStorage.removeItem(PENDING_CART_KEY)
                        try {
                            const { productId, quantity } = JSON.parse(pending)
                            const alreadyInCart = items.find(
                                (i) => i.product.id === productId
                            )
                            if (!alreadyInCart) {
                                apiAddToCart(productId, quantity).then(() => {
                                    // Reload cart from server to get full product data
                                    getCart().then((updated) =>
                                        setCartItems(updated.map(backendToLocal))
                                    )
                                })
                            }
                        } catch {
                            /* ignore malformed data */
                        }
                    }
                })
                .catch(console.error)
        } else {
            // Guest — start with empty cart (no localStorage persistence for guests)
            setCartItems([])
        }
    }, [isLoggedIn, authLoading])

    // ── Add to cart ────────────────────────────────────────────────
    const addToCart = useCallback(
        (product: Product, quantity = 1) => {
            if (!isLoggedIn) {
                // Save the action so we can replay it after login
                localStorage.setItem(
                    PENDING_CART_KEY,
                    JSON.stringify({ productId: product.id, quantity })
                )
                router.push("/login")
                return
            }

            // Optimistic local update
            setCartItems((prev) => {
                const existing = prev.find((item) => item.product.id === product.id)
                if (existing) {
                    return prev.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                }
                return [...prev, { product, quantity }]
            })
            setCartOpen(true)

            // Sync with backend
            apiAddToCart(product.id, quantity).catch(console.error)
        },
        [isLoggedIn, router]
    )

    // ── Update quantity ────────────────────────────────────────────
    const updateQuantity = useCallback(
        (productId: number, quantity: number) => {
            if (quantity === 0) {
                setCartItems((prev) =>
                    prev.filter((item) => item.product.id !== productId)
                )
                if (isLoggedIn) apiRemoveCartItem(productId).catch(console.error)
            } else {
                setCartItems((prev) =>
                    prev.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    )
                )
                if (isLoggedIn) apiUpdateCartItem(productId, quantity).catch(console.error)
            }
        },
        [isLoggedIn]
    )

    // ── Remove item ────────────────────────────────────────────────
    const removeItem = useCallback(
        (productId: number) => {
            setCartItems((prev) =>
                prev.filter((item) => item.product.id !== productId)
            )
            if (isLoggedIn) apiRemoveCartItem(productId).catch(console.error)
        },
        [isLoggedIn]
    )

    // ── Clear cart ─────────────────────────────────────────────────
    const clearCart = useCallback(() => {
        setCartItems([])
        if (isLoggedIn) apiClearCart().catch(console.error)
    }, [isLoggedIn])

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartOpen,
                setCartOpen,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart must be used within CartProvider")
    return ctx
}

// ── Helper: convert backend DTO to local CartItem ─────────────────
function backendToLocal(dto: CartItemData): CartItem {
    return {
        product: {
            id: dto.productId,
            name: dto.productName,
            image: dto.productImage,
            price: dto.price,
            originalPrice: dto.originalPrice ?? undefined,
            category: dto.category,
            inStock: dto.inStock,
            // Fields not provided by cart DTO — use safe defaults
            description: "",
            images: [dto.productImage],
            rating: 0,
            reviews: 0,
        },
        quantity: dto.quantity,
        selectedColor: dto.selectedColor ?? undefined,
        selectedSize: dto.selectedSize ?? undefined,
    }
}
