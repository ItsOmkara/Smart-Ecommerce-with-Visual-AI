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
    User,
    LogOut,
    Package,
    ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { user, isLoggedIn, isLoading, logout } = useAuth()
    const { cartCount, setCartOpen } = useCart()

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
                            onClick={() => setCartOpen(true)}
                            className="relative text-gray-300 hover:text-white transition-colors p-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Auth section — hidden during loading to prevent flash */}
                        {!isLoading && (
                            <>
                                {isLoggedIn && user ? (
                                    <div className="relative hidden md:block">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm text-white font-medium max-w-[100px] truncate">
                                                {user.name}
                                            </span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {/* Dropdown */}
                                        {userMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setUserMenuOpen(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-52 glass rounded-xl border border-white/10 py-2 z-50 shadow-2xl">
                                                    <div className="px-4 py-2 border-b border-white/10">
                                                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                    </div>
                                                    <Link
                                                        href="/cart"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                                                    >
                                                        <Package className="w-4 h-4" />
                                                        My Orders
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false)
                                                            logout()
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 transition-all w-full text-left"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <Link href="/login" className="hidden md:block">
                                        <Button variant="outline" size="sm" className="text-sm">
                                            Sign In
                                        </Button>
                                    </Link>
                                )}
                            </>
                        )}

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

                            {/* Mobile auth section */}
                            {!isLoading && (
                                <div className="border-t border-white/10 pt-3 mt-1">
                                    {isLoggedIn && user ? (
                                        <>
                                            <div className="flex items-center gap-3 px-3 py-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setMobileMenuOpen(false)
                                                    logout()
                                                }}
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all w-full text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
                                        >
                                            <User className="w-4 h-4" />
                                            Sign In
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
