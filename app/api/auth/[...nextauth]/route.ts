// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"

export const { GET, POST } = handlers

// Force Node.js runtime to avoid Edge Runtime issues with bcryptjs
export const runtime = 'nodejs'

