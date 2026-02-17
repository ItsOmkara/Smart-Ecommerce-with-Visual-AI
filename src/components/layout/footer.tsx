import Link from "next/link"
import { Sparkles, Github, Twitter, Instagram } from "lucide-react"

export function Footer() {
    return (
        <footer className="glass border-t border-white/5 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                VISO<span className="gradient-text">AI</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                            Discover fashion with the power of AI. Upload any image and find
                            similar products instantly using our cutting-edge visual search
                            technology powered by CLIP.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {[Github, Twitter, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Shop</h4>
                        <ul className="space-y-2">
                            {["All Products", "Dresses", "Jackets", "Sneakers", "Bags"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="/products"
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            {["About Us", "Careers", "Press", "Blog", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © 2026 VISOAI. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {["Privacy", "Terms", "Cookies"].map((item) => (
                            <a key={item} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
