import { NextRequest, NextResponse } from "next/server"
import { bearerTokenFromHeaders, verifyToken } from "../../../../lib/config"
import { prisma } from "../../../../lib/prisma"

export async function POST(request: NextRequest) {
    const headers = Object.fromEntries(request.headers.entries())
    if (!await verifyToken(prisma, bearerTokenFromHeaders(headers))) {
        return NextResponse.json({ message: 'Invalid API Method', type: 'error' }, { status: 405 })
    }
    
    const unbanInstance: { uri: string } = await request.json()
    
    const instance = await prisma.instances.findFirst({
        where: { uri: unbanInstance.uri }
    })
    
    if (!!instance && instance.uri.toLowerCase() === unbanInstance.uri.toLowerCase()) {
        await prisma.instances.update({
            data: {
                banned: false
            },
            where: {
                uri: unbanInstance.uri
            }
        })
        
        return NextResponse.json({ message: 'Successfully unbanned instance', type: 'success' })
    }
    return NextResponse.json({ message: 'Invalid API Method', type: 'error' }, { status: 405 })
} 