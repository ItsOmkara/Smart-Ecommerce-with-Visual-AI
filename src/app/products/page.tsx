"use client"

import { useState, useMemo, useEffect } from "react"
import { Filter } from "lucide-react"
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/product/product-card"
import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchProducts, fetchCategories } from "@/lib/api"
import { useCart } from "@/lib/cart-context"
import { Product, Category } from "@/lib/types"

export default function ProductsPage() {
    const { addToCart } = useCart()
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const [sortBy, setSortBy] = useState<string>("featured")
    const [searchQuery, setSearchQuery] = useState("")
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1200])
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        fetchProducts().then(setProducts).catch(console.error)
        fetchCategories().then(setCategories).catch(console.error)
    }, [])

    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        if (selectedCategory !== "All") {
            filtered = filtered.filter((p) => p.category === selectedCategory)
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            )
        }

        filtered = filtered.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        )

        switch (sortBy) {
            case "price-asc":
                filtered.sort((a, b) => a.price - b.price)
                break
            case "price-desc":
                filtered.sort((a, b) => b.price - a.price)
                break
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating)
                break
            case "newest":
                filtered.sort((a, b) => b.id - a.id)
                break
        }

        return filtered
    }, [selectedCategory, sortBy, searchQuery, priceRange, products])

    const allCategories = ["All", ...categories.map((c) => c.name)]

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
                    {/* Header */}
                    <div className="glass rounded-2xl p-6 md:p-8 mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            All Products
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Showing {filteredProducts.length} of {products.length} products
                        </p>
                    </div>

                    {/* Filters Bar */}
                    <div className="glass rounded-2xl p-4 mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-full md:w-64">
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5"
                                />
                            </div>

                            <div className="flex-1 flex flex-wrap gap-2">
                                {allCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat
                                            ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-violet-500 focus:border-violet-500"
                            >
                                <option value="featured" className="bg-gray-900">Featured</option>
                                <option value="price-asc" className="bg-gray-900">Price: Low → High</option>
                                <option value="price-desc" className="bg-gray-900">Price: High → Low</option>
                                <option value="rating" className="bg-gray-900">Top Rated</option>
                                <option value="newest" className="bg-gray-900">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass rounded-2xl p-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Try adjusting your filters or search query
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedCategory("All")
                                    setSearchQuery("")
                                    setPriceRange([0, 1200])
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
