"use client"

import Link from "next/link"
import { useState } from "react"
import {
    Search,
    ShoppingBag,
    Menu,
    X,
    Sparkles,
    Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
    cartCount: number
    onCartClick: () => void
}

export function Navbar({ cartCount, onCartClick }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white hidden sm:block">
                            VISO<span className="gradient-text">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                        >
                            Products
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link
                            href="/search"
                            className="text-sm text-gray-300 hover:text-white transition-colors relative group flex items-center gap-1"
                        >
                            <Camera className="w-4 h-4" />
                            Visual Search
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <Link href="/search">
                            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                                <Search className="w-5 h-5" />
                            </Button>
                        </Link>

                        <button
                            onClick={onCartClick}
                            className="relative text-gray-300 hover:text-white transition-colors p-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-gray-300"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                Products
                            </Link>
                            <Link
                                href="/search"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                Visual Search
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
