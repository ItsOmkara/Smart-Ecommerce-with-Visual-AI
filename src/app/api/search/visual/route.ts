import { NextRequest, NextResponse } from "next/server"

// Use 127.0.0.1 to avoid IPv6 resolution issues
const AI_API_BASE = process.env.AI_API_URL || "http://127.0.0.1:8001/api"

export async function POST(request: NextRequest) {
    try {
        // Read the raw body and forward it with the same content-type header
        // This preserves the multipart boundary correctly
        const body = await request.arrayBuffer()
        const contentType = request.headers.get("content-type") || ""

        const aiRes = await fetch(`${AI_API_BASE}/search/visual`, {
            method: "POST",
            headers: {
                "Content-Type": contentType,
            },
            body: Buffer.from(body),
        })

        if (!aiRes.ok) {
            const text = await aiRes.text().catch(() => "")
            return NextResponse.json(
                { error: `AI service error (${aiRes.status}): ${text}` },
                { status: aiRes.status }
            )
        }

        const data = await aiRes.json()
        return NextResponse.json(data)
    } catch (err: any) {
        console.error("Visual search proxy error:", err)
        return NextResponse.json(
            { error: `Cannot reach AI service: ${err.message}` },
            { status: 503 }
        )
    }
}
