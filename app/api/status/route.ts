import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get some basic stats
    const totalInstances = await prisma.instances.count()
    const verifiedInstances = await prisma.instances.count({
      where: { verified: true, banned: false }
    })
    const generalInstances = await prisma.instances.count({
      where: { type: "general", verified: true, banned: false }
    })
    const nicheInstances = await prisma.instances.count({
      where: { type: "niche", verified: true, banned: false }
    })

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      stats: {
        totalInstances,
        verifiedInstances,
        generalInstances,
        nicheInstances
      },
      revalidation: {
        homepage: '/',
        revalidateTime: 300, // 5 minutes
        tag: 'instances'
      }
    })
  } catch (error) {
    console.error('Status endpoint error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 