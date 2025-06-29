import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    console.log('Revalidation GET called at:', new Date().toISOString());
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Host:', request.headers.get('host'));
    
    // Revalidate the homepage using multiple methods
    revalidatePath('/');
    revalidateTag('instances');
    
    console.log('Revalidation completed via GET at:', new Date().toISOString());
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      method: 'GET',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
  } catch (err) {
    console.error('Revalidation GET error:', err);
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Revalidation POST called at:', new Date().toISOString());
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Host:', request.headers.get('host'));
    
    // Revalidate the homepage using multiple methods
    revalidatePath('/');
    revalidateTag('instances');
    
    console.log('Revalidation completed via POST at:', new Date().toISOString());
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      method: 'POST',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
  } catch (err) {
    console.error('Revalidation POST error:', err);
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 