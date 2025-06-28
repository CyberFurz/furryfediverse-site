// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server'

type Data = {
  name: string
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ name: 'John Doe' })
} 