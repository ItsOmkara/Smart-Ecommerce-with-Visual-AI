"use client"

import { useState, FormEvent } from "react"
import type { CartItem } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Minus,
    Plus,
    X,
    ShoppingBag,
    ArrowLeft,
    ArrowRight,
    Truck,
    Shield,
    Tag,
    CreditCard,
    MapPin,
    User,
    Phone,
    Home,
    CheckCircle2,
    Package,
    Loader2,
} from "lucide-react"
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { placeOrder, ShippingAddress } from "@/lib/api"
import { formatPrice } from "@/lib/utils"

type CheckoutStep = "cart" | "address" | "success"

interface OrderResult {
    orderId: number
    total: number
}

export default function CartPage() {
    const { cartItems, cartCount, updateQuantity, removeItem, clearCart } = useCart()
    const { isLoggedIn } = useAuth()
    const [promoCode, setPromoCode] = useState("")
    const [promoApplied, setPromoApplied] = useState(false)

    // Checkout flow state
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart")
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [orderResult, setOrderResult] = useState<OrderResult | null>(null)
    const [orderedItems, setOrderedItems] = useState<CartItem[]>([])
    const [orderError, setOrderError] = useState("")

    // Address form state
    const [address, setAddress] = useState<ShippingAddress>({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
    })
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({})

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )
    const shipping = subtotal > 200 ? 0 : 15
    const discount = promoApplied ? subtotal * 0.1 : 0
    const total = subtotal + shipping - discount

    const handleApplyPromo = () => {
        if (promoCode.toLowerCase() === "save10") {
            setPromoApplied(true)
        }
    }

    const handleCheckout = () => {
        setCheckoutStep("address")
        setOrderError("")
    }

    const validateAddress = (): boolean => {
        const errors: Partial<Record<keyof ShippingAddress, string>> = {}
        if (!address.fullName.trim()) errors.fullName = "Full name is required"
        if (!address.phone.trim()) errors.phone = "Phone number is required"
        else if (!/^\d{10,}$/.test(address.phone.replace(/[\s\-\(\)]/g, "")))
            errors.phone = "Enter a valid phone number"
        if (!address.street.trim()) errors.street = "Street address is required"
        if (!address.city.trim()) errors.city = "City is required"
        if (!address.state.trim()) errors.state = "State is required"
        if (!address.zip.trim()) errors.zip = "ZIP code is required"

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handlePlaceOrder = async (e: FormEvent) => {
        e.preventDefault()
        if (!validateAddress()) return

        setIsPlacingOrder(true)
        setOrderError("")

        try {
            const result = await placeOrder(address)
            setOrderResult(result)
            setOrderedItems([...cartItems])
            clearCart()
            setCheckoutStep("success")
        } catch (err: any) {
            setOrderError(err.message || "Failed to place order. Please try again.")
        } finally {
            setIsPlacingOrder(false)
        }
    }

    const handleInputChange = (field: keyof ShippingAddress, value: string) => {
        setAddress((prev) => ({ ...prev, [field]: value }))
        // Clear error on edit
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
    }

    return (
        <main className="min-h-screen">
            <LiquidEffectAnimation
                imageUrl="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80"
                metalness={0.85}
                roughness={0.15}
                displacementScale={3}
            />
            <Navbar />
            <CartSheet />

            <div className="pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Back */}
                    {checkoutStep === "cart" && (
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    )}
                    {checkoutStep === "address" && (
                        <button
                            onClick={() => setCheckoutStep("cart")}
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Cart
                        </button>
                    )}

                    <AnimatePresence mode="wait">
                        {/* ──────────── SUCCESS STATE ──────────── */}
                        {checkoutStep === "success" && orderResult && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="glass rounded-3xl p-10 md:p-16 text-center max-w-2xl mx-auto"
                            >
                                {/* Animated checkmark */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
                                >
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                    >
                                        <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                                    </motion.div>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-3xl font-bold text-white mb-3"
                                >
                                    Order Placed Successfully!
                                </motion.h2>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                        <Package className="w-4 h-4" />
                                        Order #{orderResult.orderId}
                                    </div>

                                    <p className="text-gray-400 mb-2">
                                        Your order of{" "}
                                        <span className="text-white font-semibold">
                                            {formatPrice(orderResult.total)}
                                        </span>{" "}
                                        has been confirmed.
                                    </p>
                                    <p className="text-gray-500 text-sm mb-2">
                                        We&apos;ll send you shipping updates to your email.
                                    </p>
                                </motion.div>

                                {/* Ordered Items */}
                                {orderedItems.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 }}
                                        className="mt-6 mb-8 text-left"
                                    >
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">
                                            Items Ordered
                                        </h3>
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {orderedItems.map((item) => (
                                                <div
                                                    key={item.product.id}
                                                    className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-white font-medium truncate">
                                                            {item.product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-white font-semibold">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping address summary */}
                                        <div className="mt-4 bg-white/5 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">Delivering to</p>
                                            <p className="text-sm text-white">
                                                {address.fullName} • {address.phone}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {address.street}, {address.city}, {address.state} {address.zip}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className="flex gap-4 justify-center"
                                >
                                    <Link href="/products">
                                        <Button variant="glow" size="lg">
                                            Continue Shopping
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* ──────────── ADDRESS FORM ──────────── */}
                        {checkoutStep === "address" && (
                            <motion.div
                                key="address"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                    Shipping Address
                                </h1>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Address Form */}
                                    <div className="lg:col-span-2">
                                        <form onSubmit={handlePlaceOrder} id="address-form">
                                            <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                                        <MapPin className="w-5 h-5 text-violet-400" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-white">
                                                            Delivery Details
                                                        </h2>
                                                        <p className="text-sm text-gray-400">
                                                            Where should we deliver your order?
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Full Name & Phone */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm text-gray-300 mb-1.5 block">
                                                            Full Name
                                                        </label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                            <Input
                                                                placeholder="John Doe"
                                                                value={address.fullName}
                                                                onChange={(e) =>
                                                                    handleInputChange("fullName", e.target.value)
                                                                }
                                                                className={`pl-10 bg-white/5 ${formErrors.fullName
                                                                    ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </div>
                                                        {formErrors.fullName && (
                                                            <p className="text-xs text-red-400 mt-1">
                                                                {formErrors.fullName}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-300 mb-1.5 block">
                                                            Phone Number
                                                        </label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                            <Input
                                                                placeholder="1234567890"
                                                                value={address.phone}
                                                                onChange={(e) =>
                                                                    handleInputChange("phone", e.target.value)
                                                                }
                                                                className={`pl-10 bg-white/5 ${formErrors.phone
                                                                    ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </div>
                                                        {formErrors.phone && (
                                                            <p className="text-xs text-red-400 mt-1">
                                                                {formErrors.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Street Address */}
                                                <div>
                                                    <label className="text-sm text-gray-300 mb-1.5 block">
                                                        Street Address
                                                    </label>
                                                    <div className="relative">
                                                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                        <Input
                                                            placeholder="123 Main St, Apt 4"
                                                            value={address.street}
                                                            onChange={(e) =>
                                                                handleInputChange("street", e.target.value)
                                                            }
                                                            className={`pl-10 bg-white/5 ${formErrors.street
                                                                ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                                : ""
                                                                }`}
                                                        />
                                                    </div>
                                                    {formErrors.street && (
                                                        <p className="text-xs text-red-400 mt-1">
                                                            {formErrors.street}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* City, State, ZIP */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="text-sm text-gray-300 mb-1.5 block">
                                                            City
                                                        </label>
                                                        <Input
                                                            placeholder="New York"
                                                            value={address.city}
                                                            onChange={(e) =>
                                                                handleInputChange("city", e.target.value)
                                                            }
                                                            className={`bg-white/5 ${formErrors.city
                                                                ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                                : ""
                                                                }`}
                                                        />
                                                        {formErrors.city && (
                                                            <p className="text-xs text-red-400 mt-1">
                                                                {formErrors.city}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-300 mb-1.5 block">
                                                            State
                                                        </label>
                                                        <Input
                                                            placeholder="NY"
                                                            value={address.state}
                                                            onChange={(e) =>
                                                                handleInputChange("state", e.target.value)
                                                            }
                                                            className={`bg-white/5 ${formErrors.state
                                                                ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                                : ""
                                                                }`}
                                                        />
                                                        {formErrors.state && (
                                                            <p className="text-xs text-red-400 mt-1">
                                                                {formErrors.state}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-300 mb-1.5 block">
                                                            ZIP Code
                                                        </label>
                                                        <Input
                                                            placeholder="10001"
                                                            value={address.zip}
                                                            onChange={(e) =>
                                                                handleInputChange("zip", e.target.value)
                                                            }
                                                            className={`bg-white/5 ${formErrors.zip
                                                                ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                                : ""
                                                                }`}
                                                        />
                                                        {formErrors.zip && (
                                                            <p className="text-xs text-red-400 mt-1">
                                                                {formErrors.zip}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {orderError && (
                                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                                                        {orderError}
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Order Summary (sticky sidebar) */}
                                    <div className="lg:col-span-1">
                                        <div className="glass rounded-2xl p-6 sticky top-24">
                                            <h2 className="text-lg font-semibold text-white mb-6">
                                                Order Summary
                                            </h2>

                                            {/* Items preview */}
                                            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                                                {cartItems.map((item) => (
                                                    <div
                                                        key={item.product.id}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-white truncate">
                                                                {item.product.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                x{item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-white font-medium">
                                                            {formatPrice(
                                                                item.product.price * item.quantity
                                                            )}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t border-white/10 pt-4 space-y-3 mb-6">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">
                                                        Subtotal ({cartCount} items)
                                                    </span>
                                                    <span className="text-white">
                                                        {formatPrice(subtotal)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Shipping</span>
                                                    <span
                                                        className={
                                                            shipping === 0
                                                                ? "text-emerald-400"
                                                                : "text-white"
                                                        }
                                                    >
                                                        {shipping === 0
                                                            ? "FREE"
                                                            : formatPrice(shipping)}
                                                    </span>
                                                </div>
                                                {promoApplied && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-400">
                                                            Promo (10% off)
                                                        </span>
                                                        <span className="text-emerald-400">
                                                            -{formatPrice(discount)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="border-t border-white/10 pt-3 flex justify-between">
                                                    <span className="text-base font-semibold text-white">
                                                        Total
                                                    </span>
                                                    <span className="text-xl font-bold gradient-text">
                                                        {formatPrice(total)}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="glow"
                                                size="lg"
                                                className="w-full group"
                                                type="submit"
                                                form="address-form"
                                                disabled={isPlacingOrder}
                                            >
                                                {isPlacingOrder ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Placing Order...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Package className="w-5 h-5 mr-2" />
                                                        Place Order — {formatPrice(total)}
                                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>

                                            {/* Benefits */}
                                            <div className="mt-6 space-y-3">
                                                {[
                                                    {
                                                        icon: Truck,
                                                        text: "Free shipping on orders over $200",
                                                    },
                                                    {
                                                        icon: Shield,
                                                        text: "Secure checkout with encryption",
                                                    },
                                                ].map(({ icon: Icon, text }) => (
                                                    <div
                                                        key={text}
                                                        className="flex items-center gap-2 text-xs text-gray-400"
                                                    >
                                                        <Icon className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                                                        {text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ──────────── CART VIEW ──────────── */}
                        {checkoutStep === "cart" && (
                            <motion.div
                                key="cart"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                    Shopping Cart
                                </h1>

                                {cartItems.length === 0 ? (
                                    <div className="glass rounded-3xl p-16 text-center">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                                            <ShoppingBag className="w-10 h-10 text-gray-600" />
                                        </div>
                                        <h2 className="text-2xl font-semibold text-white mb-2">
                                            Your cart is empty
                                        </h2>
                                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                            Looks like you haven&apos;t added anything to your cart
                                            yet. Start browsing our collection!
                                        </p>
                                        <Link href="/products">
                                            <Button variant="glow" size="xl">
                                                Browse Products
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Cart Items */}
                                        <div className="lg:col-span-2 space-y-4">
                                            {cartItems.map((item) => (
                                                <div
                                                    key={item.product.id}
                                                    className="glass rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6 group"
                                                >
                                                    <div className="relative w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <p className="text-xs text-violet-400 font-medium">
                                                                        {item.product.category}
                                                                    </p>
                                                                    <h3 className="text-base md:text-lg font-semibold text-white mt-0.5">
                                                                        {item.product.name}
                                                                    </h3>
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        removeItem(item.product.id)
                                                                    }
                                                                    className="text-gray-500 hover:text-white transition-colors p-1"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            {item.product.originalPrice && (
                                                                <p className="text-xs text-gray-500 line-through mt-1">
                                                                    {formatPrice(
                                                                        item.product.originalPrice
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-end justify-between mt-4">
                                                            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-1.5">
                                                                <button
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.product.id,
                                                                            Math.max(
                                                                                1,
                                                                                item.quantity - 1
                                                                            )
                                                                        )
                                                                    }
                                                                    className="text-gray-400 hover:text-white transition-colors"
                                                                >
                                                                    <Minus className="w-3.5 h-3.5" />
                                                                </button>
                                                                <span className="text-sm font-medium text-white w-6 text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.product.id,
                                                                            item.quantity + 1
                                                                        )
                                                                    }
                                                                    className="text-gray-400 hover:text-white transition-colors"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>

                                                            <p className="text-lg font-bold text-white">
                                                                {formatPrice(
                                                                    item.product.price *
                                                                    item.quantity
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="lg:col-span-1">
                                            <div className="glass rounded-2xl p-6 sticky top-24">
                                                <h2 className="text-lg font-semibold text-white mb-6">
                                                    Order Summary
                                                </h2>

                                                <div className="space-y-4 mb-6">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">
                                                            Subtotal ({cartCount} items)
                                                        </span>
                                                        <span className="text-white">
                                                            {formatPrice(subtotal)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">
                                                            Shipping
                                                        </span>
                                                        <span
                                                            className={
                                                                shipping === 0
                                                                    ? "text-emerald-400"
                                                                    : "text-white"
                                                            }
                                                        >
                                                            {shipping === 0
                                                                ? "FREE"
                                                                : formatPrice(shipping)}
                                                        </span>
                                                    </div>
                                                    {promoApplied && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-emerald-400">
                                                                Promo (10% off)
                                                            </span>
                                                            <span className="text-emerald-400">
                                                                -{formatPrice(discount)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="border-t border-white/10 pt-4 flex justify-between">
                                                        <span className="text-base font-semibold text-white">
                                                            Total
                                                        </span>
                                                        <span className="text-xl font-bold gradient-text">
                                                            {formatPrice(total)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Promo Code */}
                                                <div className="mb-6">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Promo code"
                                                            value={promoCode}
                                                            onChange={(e) =>
                                                                setPromoCode(e.target.value)
                                                            }
                                                            className="bg-white/5"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="default"
                                                            onClick={handleApplyPromo}
                                                            disabled={promoApplied}
                                                        >
                                                            <Tag className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    {promoApplied && (
                                                        <p className="text-xs text-emerald-400 mt-2">
                                                            ✓ Code &quot;SAVE10&quot; applied — 10%
                                                            off!
                                                        </p>
                                                    )}
                                                    {!promoApplied && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Try &quot;SAVE10&quot; for 10% off
                                                        </p>
                                                    )}
                                                </div>

                                                {isLoggedIn ? (
                                                    <Button
                                                        variant="glow"
                                                        size="lg"
                                                        className="w-full group"
                                                        onClick={handleCheckout}
                                                    >
                                                        <CreditCard className="w-5 h-5 mr-2" />
                                                        Checkout —{" "}
                                                        {formatPrice(total)}
                                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                ) : (
                                                    <Link href="/login">
                                                        <Button
                                                            variant="glow"
                                                            size="lg"
                                                            className="w-full group"
                                                        >
                                                            Sign In to Checkout
                                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* Benefits */}
                                                <div className="mt-6 space-y-3">
                                                    {[
                                                        {
                                                            icon: Truck,
                                                            text: "Free shipping on orders over $200",
                                                        },
                                                        {
                                                            icon: Shield,
                                                            text: "Secure checkout with encryption",
                                                        },
                                                    ].map(({ icon: Icon, text }) => (
                                                        <div
                                                            key={text}
                                                            className="flex items-center gap-2 text-xs text-gray-400"
                                                        >
                                                            <Icon className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                                                            {text}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </main>
    )
}
