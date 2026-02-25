"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    Camera,
    Search,
    Upload,
    Sparkles,
    Star,
    Zap,
    Shield,
    Eye,
} from "lucide-react"
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/product/product-card"
import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchProducts, fetchCategories } from "@/lib/api"
import { useCart } from "@/lib/cart-context"
import { Product, Category } from "@/lib/types"

export default function HomePage() {
    const { addToCart } = useCart()
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        fetchProducts().then(setProducts).catch(console.error)
        fetchCategories().then(setCategories).catch(console.error)
    }, [])

    const featuredProducts = products.slice(0, 8)

    return (
        <main className="min-h-screen">
            <LiquidEffectAnimation
                imageUrl="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80"
                metalness={0.75}
                roughness={0.25}
                displacementScale={5}
                rain={false}
            />

            <Navbar />
            <CartSheet />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass rounded-3xl p-8 md:p-16 text-center">
                        <Badge variant="default" className="mb-6 text-sm px-4 py-1.5">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            AI-Powered Visual Search
                        </Badge>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Find Fashion with
                            <br />
                            <span className="gradient-text">Visual AI</span>
                        </h1>

                        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Upload any image and discover similar products instantly.
                            Our AI understands style, color, and pattern to find your
                            perfect match.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                            <Link href="/search">
                                <Button variant="glow" size="xl" className="group">
                                    <Camera className="w-5 h-5 mr-2" />
                                    Try Visual Search
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="outline" size="xl">
                                    Browse Products
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                            {[
                                { value: "25K+", label: "Products" },
                                { value: "99.2%", label: "AI Accuracy" },
                                { value: "0.3s", label: "Search Speed" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            How <span className="gradient-text">Visual Search</span> Works
                        </h2>
                        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                            Three simple steps to find exactly what you&apos;re looking for
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Upload,
                                title: "Upload Image",
                                desc: "Take a photo or upload any image of fashion you love",
                                step: "01",
                            },
                            {
                                icon: Eye,
                                title: "AI Analyzes",
                                desc: "Our CLIP model extracts style, color, and pattern features",
                                step: "02",
                            },
                            {
                                icon: Sparkles,
                                title: "Get Results",
                                desc: "Instantly find similar products from our curated catalog",
                                step: "03",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="glass-card rounded-2xl p-8 text-center group"
                            >
                                <div className="text-xs font-bold text-violet-500/50 mb-4">
                                    STEP {item.step}
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6 group-hover:from-violet-500/30 group-hover:to-pink-500/30 transition-all">
                                    <item.icon className="w-7 h-7 text-violet-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white">
                                Shop by Category
                            </h2>
                            <p className="text-gray-400 mt-2">
                                Explore our curated collections
                            </p>
                        </div>
                        <Link href="/products">
                            <Button variant="ghost" className="text-violet-400 hover:text-violet-300">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.name}`}
                                className="group"
                            >
                                <div className="glass-card rounded-2xl overflow-hidden aspect-square relative">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-sm font-semibold text-white">
                                            {cat.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {cat.count} items
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white">
                                Featured Products
                            </h2>
                            <p className="text-gray-400 mt-2">
                                Hand-picked by our style curators
                            </p>
                        </div>
                        <Link href="/products">
                            <Button variant="ghost" className="text-violet-400 hover:text-violet-300">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[128px] pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white">
                                Ready to find your
                                <br />
                                <span className="gradient-text">perfect style?</span>
                            </h2>
                            <p className="text-gray-400 mt-4 max-w-lg mx-auto">
                                Try our AI-powered visual search and discover fashion that
                                matches your unique taste.
                            </p>
                            <Link href="/search">
                                <Button variant="glow" size="xl" className="mt-8 group">
                                    <Camera className="w-5 h-5 mr-2" />
                                    Start Visual Search
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                desc: "Visual search results in under 300ms",
                            },
                            {
                                icon: Shield,
                                title: "Secure Shopping",
                                desc: "Enterprise-grade security for all transactions",
                            },
                            {
                                icon: Star,
                                title: "Premium Quality",
                                desc: "Curated products from top brands worldwide",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="glass-card rounded-2xl p-8 text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-6 h-6 text-violet-400" />
                                </div>
                                <h3 className="text-base font-semibold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
