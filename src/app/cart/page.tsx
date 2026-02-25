"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
    const { cartItems, cartCount, updateQuantity, removeItem } = useCart()
    const { isLoggedIn } = useAuth()
    const [promoCode, setPromoCode] = useState("")
    const [promoApplied, setPromoApplied] = useState(false)

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
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>

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
                                Looks like you haven&apos;t added anything to your cart yet. Start
                                browsing our collection!
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
                                                        onClick={() => removeItem(item.product.id)}
                                                        className="text-gray-500 hover:text-white transition-colors p-1"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {item.product.originalPrice && (
                                                    <p className="text-xs text-gray-500 line-through mt-1">
                                                        {formatPrice(item.product.originalPrice)}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-1.5">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
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
                                                            updateQuantity(item.product.id, item.quantity + 1)
                                                        }
                                                        className="text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <p className="text-lg font-bold text-white">
                                                    {formatPrice(item.product.price * item.quantity)}
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
                                            <span className="text-gray-400">Subtotal ({cartCount} items)</span>
                                            <span className="text-white">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Shipping</span>
                                            <span className={shipping === 0 ? "text-emerald-400" : "text-white"}>
                                                {shipping === 0 ? "FREE" : formatPrice(shipping)}
                                            </span>
                                        </div>
                                        {promoApplied && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-400">Promo (10% off)</span>
                                                <span className="text-emerald-400">-{formatPrice(discount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-white/10 pt-4 flex justify-between">
                                            <span className="text-base font-semibold text-white">Total</span>
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
                                                onChange={(e) => setPromoCode(e.target.value)}
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
                                                ✓ Code &quot;SAVE10&quot; applied — 10% off!
                                            </p>
                                        )}
                                        {!promoApplied && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Try &quot;SAVE10&quot; for 10% off
                                            </p>
                                        )}
                                    </div>

                                    {isLoggedIn ? (
                                        <Button variant="glow" size="lg" className="w-full group">
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Checkout — {formatPrice(total)}
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    ) : (
                                        <Link href="/login">
                                            <Button variant="glow" size="lg" className="w-full group">
                                                Sign In to Checkout
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    )}

                                    {/* Benefits */}
                                    <div className="mt-6 space-y-3">
                                        {[
                                            { icon: Truck, text: "Free shipping on orders over $200" },
                                            { icon: Shield, text: "Secure checkout with encryption" },
                                        ].map(({ icon: Icon, text }) => (
                                            <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                                                <Icon className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
