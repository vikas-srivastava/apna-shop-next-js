import { NextResponse } from 'next/server'

// Mock theme data for API mode
const mockThemes = {
    'Classic Light': {
        name: "Classic Light",
        colors: {
            primary: {
                50: "#f9fafb",
                100: "#f3f4f6",
                200: "#e5e7eb",
                300: "#d1d5db",
                400: "#9ca3af",
                500: "#6b7280",
                600: "#4b5563",
                700: "#374151",
                800: "#1f2937",
                900: "#111827"
            },
            secondary: {
                50: "#ffffff",
                100: "#f9fafb",
                200: "#f3f4f6",
                300: "#e5e7eb",
                400: "#d1d5db",
                500: "#9ca3af",
                600: "#6b7280",
                700: "#4b5563",
                800: "#374151",
                900: "#1f2937"
            },
            accent: {
                50: "#eff6ff",
                100: "#dbeafe",
                200: "#bfdbfe",
                300: "#93c5fd",
                400: "#60a5fa",
                500: "#3b82f6",
                600: "#2563eb",
                700: "#1d4ed8",
                800: "#1e40af",
                900: "#1e3a8a"
            },
            success: { 500: "#16a34a" },
            warning: { 500: "#eab308" },
            error: { 500: "#dc2626" },
            text: {
                primary: "#111827",
                secondary: "#4b5563",
                accent: "#2563eb",
                success: "#166534",
                warning: "#92400e",
                error: "#b91c1c"
            }
        },
        typography: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                serif: ["Georgia", "serif"],
                mono: ["JetBrains Mono", "monospace"]
            },
            fontWeight: {
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700
            }
        }
    },
    'Ocean Breeze': {
        name: "Ocean Breeze",
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
                900: "#134e4a"
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
                900: "#0c4a6e"
            },
            accent: { 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490" },
            success: { 500: "#22c55e" },
            warning: { 500: "#f59e0b" },
            error: { 500: "#ef4444" },
            text: {
                primary: "#0f172a",
                secondary: "#334155",
                accent: "#0e7490",
                success: "#15803d",
                warning: "#92400e",
                error: "#991b1b"
            }
        },
        typography: {
            fontFamily: {
                sans: ["Poppins", "system-ui", "sans-serif"],
                serif: ["Playfair Display", "serif"],
                mono: ["Fira Code", "monospace"]
            }
        }
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const themeName = searchParams.get('name') || 'Classic Light'

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const theme = mockThemes[themeName as keyof typeof mockThemes] || mockThemes['Classic Light']

    return NextResponse.json({
        success: true,
        data: theme
    })
}