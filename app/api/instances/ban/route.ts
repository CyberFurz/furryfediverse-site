import { NextRequest, NextResponse } from "next/server"
import { bearerTokenFromHeaders, verifyToken } from "../../../../lib/config"
import { prisma }  from "../../../../lib/prisma"

export async function POST(request: NextRequest) {
    const headers = Object.fromEntries(request.headers.entries())
    if (!await verifyToken(prisma, bearerTokenFromHeaders(headers))) {
        return NextResponse.json({ message: 'Invalid API Method', type: 'error' }, { status: 405 })
    }
    
    const banInstance: { uri: string, reason: string } = await request.json()
    
    const instance = await prisma.instances.findFirst({
        where: { uri: banInstance.uri }
    })
    
    if (!!instance && instance.uri.toLowerCase() === banInstance.uri.toLowerCase()) {
        await prisma.instances.update({
            data: {
                banned: true,
                ban_reason: banInstance.reason ?? ''
            },
            where: {
                uri: banInstance.uri
            }
        })
        
        return NextResponse.json({ message: 'Successfully banned instance', type: 'success', reason: banInstance.reason })
    }
    return NextResponse.json({ message: 'Invalid API Method', type: 'error' }, { status: 405 })
}

export async function GET(request: NextRequest) {
    const headers = Object.fromEntries(request.headers.entries())
    if (!await verifyToken(prisma, bearerTokenFromHeaders(headers))) {
        return NextResponse.json({ message: 'Invalid API Method', type: 'error' }, { status: 405 })
    }
    
    const instance = await prisma.instances.findMany({
        where: { banned: true }
    })
    
    return NextResponse.json(instance)
} 