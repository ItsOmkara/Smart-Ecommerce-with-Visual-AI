"use client"

import { useEffect, useRef } from "react"

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

    useEffect(() => {
        if (!canvasRef.current) return

        const script = document.createElement("script")
        script.type = "module"
        script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';
      const canvas = document.getElementById('liquid-canvas');
      if (canvas) {
        const app = LiquidBackground(canvas);
        app.loadImage('${imageUrl}');
        app.liquidPlane.material.metalness = ${metalness};
        app.liquidPlane.material.roughness = ${roughness};
        app.liquidPlane.uniforms.displacementScale.value = ${displacementScale};
        app.setRain(${rain});
        window.__liquidApp = app;
      }
    `
        document.body.appendChild(script)

        return () => {
            if ((window as any).__liquidApp?.dispose) (window as any).__liquidApp.dispose()
            try { document.body.removeChild(script) } catch { }
        }
    }, [imageUrl, metalness, roughness, displacementScale, rain])

    return (
        <div className="fixed inset-0 m-0 w-full h-full touch-none overflow-hidden -z-10">
            <canvas
                ref={canvasRef}
                id="liquid-canvas"
                className="fixed inset-0 w-full h-full"
            />
        </div>
    )
}

declare global {
    interface Window {
        __liquidApp?: any
    }
}
