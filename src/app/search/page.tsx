"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
    Upload,
    Camera,
    Search,
    X,
    ImageIcon,
    Sparkles,
    Loader2,
    AlertCircle,
} from "lucide-react"
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/product/product-card"
import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchProducts, visualSearch } from "@/lib/api"
import { useCart } from "@/lib/cart-context"
import { Product, SearchResult } from "@/lib/types"

export default function SearchPage() {
    const { addToCart } = useCart()
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [hasSearched, setHasSearched] = useState(false)
    const [searchError, setSearchError] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchProducts().then(setProducts).catch(console.error)
    }, [])

    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith("image/")) return
        setUploadedFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
            setUploadedImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFileUpload(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleSearch = async () => {
        if (!uploadedFile) return

        setIsSearching(true)
        setHasSearched(false)
        setSearchError("")

        try {
            const results = await visualSearch(uploadedFile)
            setSearchResults(results)
            setHasSearched(true)
        } catch (err: any) {
            console.error("Visual search failed:", err)
            setSearchError(
                err.message || "Visual search failed. Make sure the AI service is running."
            )
            setHasSearched(true)
        } finally {
            setIsSearching(false)
        }
    }

    // For sample images from the product catalog, we need to convert
    // the product image URL to a File so the AI service can process it
    const handleSampleSearch = async (product: Product) => {
        setUploadedImage(product.image)
        setSearchError("")

        try {
            // Fetch the product image and convert to File
            const res = await fetch(product.image)
            const blob = await res.blob()
            const file = new File([blob], "sample.jpg", { type: blob.type })
            setUploadedFile(file)
        } catch {
            // If we can't fetch the image (CORS etc), just show it as preview
            setUploadedFile(null)
        }
    }

    const clearSearch = () => {
        setUploadedImage(null)
        setUploadedFile(null)
        setSearchResults([])
        setHasSearched(false)
        setSearchError("")
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
                    {/* Header */}
                    <div className="glass rounded-3xl p-8 md:p-12 text-center mb-10">
                        <Badge variant="default" className="mb-4 text-sm px-4 py-1.5">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Powered by CLIP AI
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold text-white">
                            Visual AI <span className="gradient-text">Search</span>
                        </h1>
                        <p className="text-gray-400 mt-4 max-w-lg mx-auto">
                            Upload any fashion image and our AI will find similar products from
                            our catalog in seconds
                        </p>
                    </div>

                    {/* Upload Area */}
                    <div className="max-w-2xl mx-auto mb-16">
                        {!uploadedImage ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`glass rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
                                    ? "border-2 border-violet-500 bg-violet-500/5 scale-[1.02]"
                                    : "border-2 border-dashed border-white/10 hover:border-violet-500/50"
                                    }`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleFileUpload(file)
                                    }}
                                />

                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6">
                                    {isDragging ? (
                                        <Upload className="w-10 h-10 text-violet-400 animate-bounce" />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 text-violet-400" />
                                    )}
                                </div>

                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {isDragging
                                        ? "Drop your image here!"
                                        : "Upload an image to search"}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    Drag & drop an image, or click to browse
                                </p>

                                <div className="flex items-center justify-center gap-4">
                                    <Button variant="glow" size="lg">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Choose File
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        <Camera className="w-4 h-4 mr-2" />
                                        Use Camera
                                    </Button>
                                </div>

                                <p className="text-xs text-gray-500 mt-4">
                                    Supports JPG, PNG, WebP up to 10MB
                                </p>
                            </div>
                        ) : (
                            <div className="glass rounded-3xl p-8">
                                <div className="flex items-start gap-6">
                                    <div className="relative w-48 h-64 rounded-2xl overflow-hidden flex-shrink-0">
                                        <Image
                                            src={uploadedImage}
                                            alt="Uploaded image"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            onClick={clearSearch}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 flex flex-col items-start">
                                        <Badge variant="success" className="mb-3">
                                            Image Uploaded
                                        </Badge>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            Ready to search
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-6">
                                            Click the button below to find visually similar products
                                            using our CLIP AI model.
                                        </p>
                                        <Button
                                            variant="glow"
                                            size="lg"
                                            onClick={handleSearch}
                                            disabled={isSearching || !uploadedFile}
                                        >
                                            {isSearching ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Analyzing Image...
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="w-4 h-4 mr-2" />
                                                    Find Similar Products
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* AI Analysis animation */}
                                {isSearching && (
                                    <div className="mt-8 p-6 rounded-2xl bg-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                                            <span className="text-sm font-medium text-white">
                                                AI Analysis in Progress
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                "Extracting visual features with CLIP...",
                                                "Analyzing color palette & patterns...",
                                                "Searching FAISS vector database...",
                                                "Fetching similar products...",
                                            ].map((step, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3"
                                                    style={{
                                                        animation: `fade-in-up 0.5s ease-out ${idx * 0.4}s forwards`,
                                                        opacity: 0,
                                                    }}
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                                    <span className="text-sm text-gray-400">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Error message */}
                                {searchError && (
                                    <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-red-400 font-medium">Search failed</p>
                                            <p className="text-xs text-red-400/70 mt-1">{searchError}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search Results */}
                    {hasSearched && searchResults.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Similar Products Found
                                    </h2>
                                    <p className="text-gray-400 mt-1">
                                        {searchResults.length} visually similar items
                                    </p>
                                </div>
                                <Badge variant="default" className="text-sm px-4 py-1.5">
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                    AI Match
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {searchResults.map((result, idx) => (
                                    <div
                                        key={result.product.id}
                                        className="relative"
                                        style={{
                                            animation: `fade-in-up 0.5s ease-out ${idx * 0.1}s forwards`,
                                            opacity: 0,
                                        }}
                                    >
                                        {/* Real similarity score from CLIP */}
                                        <div className="absolute top-3 right-3 z-10 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                            {result.similarity.toFixed(1)}% match
                                        </div>
                                        <ProductCard product={result.product} onAddToCart={addToCart} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* No results */}
                    {hasSearched && searchResults.length === 0 && !searchError && (
                        <div className="glass rounded-2xl p-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No similar products found
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Try uploading a different image or check if the AI service has indexed your products.
                            </p>
                            <Button variant="outline" onClick={clearSearch}>
                                Try Another Image
                            </Button>
                        </div>
                    )}

                    {/* Sample searches */}
                    {!uploadedImage && !hasSearched && (
                        <section className="mt-4">
                            <h3 className="text-xl font-semibold text-white mb-6 text-center">
                                Or try searching with these
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                                {products.slice(0, 4).map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSampleSearch(p)}
                                        className="group relative aspect-square rounded-2xl overflow-hidden glass-card"
                                    >
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-xs font-medium text-white truncate">
                                                Search with this
                                            </p>
                                        </div>
                                    </button>
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
