"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
    ArrowLeft,
    Star,
    ShoppingBag,
    Heart,
    Truck,
    RotateCcw,
    Shield,
    Minus,
    Plus,
    Check,
} from "lucide-react"
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/product/product-card"
import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/mock-data"
import { Product, CartItem } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

export default function ProductDetailPage() {
    const params = useParams()
    const productId = Number(params.id)
    const product = products.find((p) => p.id === productId)

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [cartOpen, setCartOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState(0)
    const [selectedSize, setSelectedSize] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [isLiked, setIsLiked] = useState(false)

    const addToCart = useCallback(
        (prod: Product) => {
            setCartItems((prev) => {
                const existing = prev.find((item) => item.product.id === prod.id)
                if (existing) {
                    return prev.map((item) =>
                        item.product.id === prod.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                }
                return [...prev, { product: prod, quantity }]
            })
            setCartOpen(true)
        },
        [quantity]
    )

    const updateQuantity = useCallback((productId: number, qty: number) => {
        if (qty === 0) {
            setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
        } else {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.product.id === productId ? { ...item, quantity: qty } : item
                )
            )
        }
    }, [])

    const removeItem = useCallback((productId: number) => {
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
    }, [])

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
                    <Link href="/products">
                        <Button variant="outline">Back to Products</Button>
                    </Link>
                </div>
            </main>
        )
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    return (
        <main className="min-h-screen">
            <LiquidEffectAnimation
                imageUrl="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80"
                metalness={0.85}
                roughness={0.15}
                displacementScale={3}
            />
            <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
            <CartSheet
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
            />

            <div className="pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Back button */}
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Products
                    </Link>

                    <div className="glass rounded-3xl p-6 md:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Images */}
                            <div className="space-y-4">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/30">
                                    <Image
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {product.badge && (
                                        <Badge
                                            variant="default"
                                            className="absolute top-4 left-4 bg-violet-500/90 border-0 text-white"
                                        >
                                            {product.badge}
                                        </Badge>
                                    )}
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : "text-white"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Thumbnail gallery */}
                                <div className="flex gap-3">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                                                    ? "border-violet-500 shadow-lg shadow-violet-500/25"
                                                    : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} view ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <p className="text-violet-400 text-sm font-medium mb-2">
                                    {product.category}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">
                                    {product.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-gray-600"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {product.rating} ({product.reviews} reviews)
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-4 mt-6">
                                    <span className="text-3xl font-bold text-white">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-xl text-gray-500 line-through">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                            <Badge variant="destructive" className="bg-rose-500/20 border-rose-500/30 text-rose-400">
                                                -{discount}% OFF
                                            </Badge>
                                        </>
                                    )}
                                </div>

                                <p className="text-gray-400 mt-6 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Colors */}
                                {product.colors && (
                                    <div className="mt-8">
                                        <p className="text-sm font-medium text-gray-300 mb-3">
                                            Color
                                        </p>
                                        <div className="flex gap-3">
                                            {product.colors.map((color, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedColor(idx)}
                                                    className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === idx
                                                            ? "border-violet-500 scale-110 shadow-lg"
                                                            : "border-transparent hover:border-white/30"
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {selectedColor === idx && (
                                                        <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {product.sizes && (
                                    <div className="mt-6">
                                        <p className="text-sm font-medium text-gray-300 mb-3">
                                            Size
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSize === size
                                                            ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity & Add to Cart */}
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 h-12">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-white font-medium w-8 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <Button
                                        variant="glow"
                                        size="lg"
                                        className="flex-1"
                                        onClick={() => addToCart(product)}
                                    >
                                        <ShoppingBag className="w-5 h-5 mr-2" />
                                        Add to Cart — {formatPrice(product.price * quantity)}
                                    </Button>
                                </div>

                                {/* Benefits */}
                                <div className="mt-10 grid grid-cols-3 gap-4">
                                    {[
                                        { icon: Truck, label: "Free Shipping" },
                                        { icon: RotateCcw, label: "30-Day Returns" },
                                        { icon: Shield, label: "2-Year Warranty" },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-white/5">
                                            <Icon className="w-5 h-5 text-violet-400" />
                                            <span className="text-xs text-gray-400">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-2xl font-bold text-white mb-8">
                                You Might Also Like
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        onAddToCart={addToCart}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
