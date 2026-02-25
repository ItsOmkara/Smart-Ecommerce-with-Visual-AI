import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
    title: "VISOAI — Smart E-Commerce with Visual AI Search",
    description:
        "Discover fashion with the power of AI. Upload any image and find similar products instantly using cutting-edge visual search technology.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
