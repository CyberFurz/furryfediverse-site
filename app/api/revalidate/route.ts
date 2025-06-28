import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Revalidate the homepage
    revalidatePath('/')
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now() 
    })
  } catch (err) {
    return NextResponse.json({ 
      message: 'Error revalidating' 
    }, { status: 500 })
  }
} 