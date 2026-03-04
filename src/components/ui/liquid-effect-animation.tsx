"use client"

import { useEffect, useRef, useState } from "react"

export function LiquidEffectAnimation({
    imageUrl = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
    metalness = 0.75,
    roughness = 0.25,
    displacementScale = 5,
    rain = false,
}: {
    imageUrl?: string
    metalness?: number
    roughness?: number
    displacementScale?: number
    rain?: boolean
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!canvasRef.current) return

        let cancelled = false

        // Timeout: if the CDN script doesn't load within 8 seconds, give up
        const timeout = setTimeout(() => {
            cancelled = true
        }, 8000)

        const script = document.createElement("script")
        script.type = "module"
        script.textContent = `
      try {
        const { default: LiquidBackground } = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js');
        const canvas = document.getElementById('liquid-canvas');
        if (canvas) {
          const app = LiquidBackground(canvas);
          app.loadImage('${imageUrl}');
          app.liquidPlane.material.metalness = ${metalness};
          app.liquidPlane.material.roughness = ${roughness};
          app.liquidPlane.uniforms.displacementScale.value = ${displacementScale};
          app.setRain(${rain});
          window.__liquidApp = app;
          window.dispatchEvent(new Event('liquid-loaded'));
        }
      } catch (e) {
        console.warn('LiquidEffectAnimation: failed to load', e);
      }
    `
        document.body.appendChild(script)

        const handleLoaded = () => {
            if (!cancelled) setLoaded(true)
        }
        window.addEventListener("liquid-loaded", handleLoaded)

        return () => {
            clearTimeout(timeout)
            window.removeEventListener("liquid-loaded", handleLoaded)
            if ((window as any).__liquidApp?.dispose) (window as any).__liquidApp.dispose()
            try { document.body.removeChild(script) } catch { }
        }
    }, [imageUrl, metalness, roughness, displacementScale, rain])

    return (
        <div className="fixed inset-0 m-0 w-full h-full touch-none overflow-hidden -z-10">
            {/* CSS gradient fallback — always visible, sits behind the canvas */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    background: "radial-gradient(ellipse at 50% 0%, #0a1628 0%, #060d1a 50%, #000000 100%)",
                }}
            />
            <canvas
                ref={canvasRef}
                id="liquid-canvas"
                className={`fixed inset-0 w-full h-full transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
            {/* Dark gradient overlay for text readability */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(15,23,42,0.45) 0%, transparent 40%, transparent 60%, rgba(15,23,42,0.80) 100%)",
                }}
            />
        </div>
    )
}

declare global {
    interface Window {
        __liquidApp?: any
    }
}
