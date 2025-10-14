import { NextResponse } from 'next/server'

interface ThemeConfig {
    name?: string
    colors?: {
        primary: Record<string, string>
        secondary: Record<string, string>
    }
}

// Mock client themes data
const clientThemes = {
    default: {
        name: "Default Theme",
        colors: {
            primary: {
                50: "#f0f9ff",
                100: "#e0f2fe",
                200: "#bae6fd",
                300: "#7dd3fc",
                400: "#38bdf8",
                500: "#0ea5e9",
                600: "#0284c7",
                700: "#0369a1",
                800: "#075985",
                900: "#0c4a6e",
            },
            secondary: {
                50: "#f8fafc",
                100: "#f1f5f9",
                200: "#e2e8f0",
                300: "#cbd5e1",
                400: "#94a3b8",
                500: "#64748b",
                600: "#475569",
                700: "#334155",
                800: "#1e293b",
                900: "#0f172a",
            }
        }
    },
    clientA: {
        name: "Client A Theme",
        colors: {
            primary: {
                50: "#fdf2f8",
                100: "#fce7f3",
                200: "#fbcfe8",
                300: "#f9a8d4",
                400: "#f472b6",
                500: "#ec4899",
                600: "#db2777",
                700: "#be185d",
                800: "#9d174d",
                900: "#831843",
            },
            secondary: {
                50: "#f0f9ff",
                100: "#e0f2fe",
                200: "#bae6fd",
                300: "#7dd3fc",
                400: "#38bdf8",
                500: "#0ea5e9",
                600: "#0284c7",
                700: "#0369a1",
                800: "#075985",
                900: "#0c4a6e",
            }
        }
    },
    clientB: {
        name: "Client B Theme",
        colors: {
            primary: {
                50: "#f0fdfa",
                100: "#ccfbf1",
                200: "#99f6e4",
                300: "#5eead4",
                400: "#2dd4bf",
                500: "#14b8a6",
                600: "#0d9488",
                700: "#0f766e",
                800: "#115e59",
                900: "#134e4a",
            },
            secondary: {
                50: "#faf5ff",
                100: "#f3e8ff",
                200: "#e9d5ff",
                300: "#d8b4fe",
                400: "#c084fc",
                500: "#a855f7",
                600: "#9333ea",
                700: "#7e22ce",
                800: "#6b21a8",
                900: "#581c87",
            }
        }
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const client = searchParams.get('client') || 'default'

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const theme = clientThemes[client as keyof typeof clientThemes] || clientThemes.default

    return NextResponse.json({
        success: true,
        data: theme
    })
}

export async function POST(request: Request) {
    const { client } = await request.json()

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const theme = clientThemes[client as keyof typeof clientThemes] || clientThemes.default

    return NextResponse.json({
        success: true,
        data: theme
    })
}