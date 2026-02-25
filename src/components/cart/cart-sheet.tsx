"use client"

import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export function CartSheet() {
    const { cartItems: items, cartOpen: isOpen, setCartOpen, updateQuantity, removeItem } = useCart()

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    const onClose = () => setCartOpen(false)

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={onClose}
                />
            )}

            {/* Sheet */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-full glass flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-violet-400" />
                            <h2 className="text-lg font-semibold text-white">
                                Cart ({itemCount})
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <ShoppingBag className="w-10 h-10 text-gray-600" />
                                </div>
                                <p className="text-gray-400">Your cart is empty</p>
                                <Link href="/products">
                                    <Button variant="outline" size="sm" onClick={onClose}>
                                        Browse Products
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex gap-4 p-3 rounded-xl bg-white/5 group"
                                >
                                    <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-white truncate">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {item.product.category}
                                        </p>
                                        <p className="text-sm font-semibold text-violet-400 mt-1">
                                            {formatPrice(item.product.price)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product.id,
                                                        Math.max(0, item.quantity - 1)
                                                    )
                                                }
                                                className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm text-white w-6 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.product.id, item.quantity + 1)
                                                }
                                                className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.product.id)}
                                        className="self-start opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 text-gray-500 hover:text-white" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-lg font-bold text-white">
                                    {formatPrice(total)}
                                </span>
                            </div>
                            <Link href="/cart" onClick={onClose}>
                                <Button variant="glow" size="lg" className="w-full group">
                                    View Cart
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
