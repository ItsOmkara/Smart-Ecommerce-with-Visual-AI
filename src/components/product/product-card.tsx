"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingBag, Heart } from "lucide-react"
import { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface ProductCardProps {
    product: Product
    onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [isLiked, setIsLiked] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    return (
        <Link href={`/products/${product.id}`} className="group block">
            <div className="glass-card rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30">
                    {!imageLoaded && (
                        <div className="absolute inset-0 shimmer bg-secondary/50" />
                    )}
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                        onLoad={() => setImageLoaded(true)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.badge && (
                            <Badge variant="default" className="text-[10px] bg-violet-500/90 border-0 text-white backdrop-blur-sm">
                                {product.badge}
                            </Badge>
                        )}
                        {discount > 0 && (
                            <Badge variant="destructive" className="text-[10px] bg-rose-500/90 border-0 text-white backdrop-blur-sm">
                                -{discount}%
                            </Badge>
                        )}
                    </div>

                    {/* Like button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setIsLiked(!isLiked)
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50"
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${isLiked ? "fill-rose-500 text-rose-500" : "text-white"
                                }`}
                        />
                    </button>

                    {/* Quick add button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            onAddToCart(product)
                        }}
                        className="absolute bottom-3 left-3 right-3 h-10 rounded-xl bg-white/95 text-black font-medium text-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>

                {/* Info */}
                <div className="p-4">
                    <p className="text-xs text-violet-400 font-medium mb-1">{product.category}</p>
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-300">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-base font-bold text-white">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
