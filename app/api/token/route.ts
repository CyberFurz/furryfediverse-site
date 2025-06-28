// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server'
import { ACCESS_TOKEN, BASE_URL, maintainers, verifyToken } from "../../../lib/config"
import generator, { Entity, Response } from 'megalodon'
import { prisma } from "../../../lib/prisma"

export async function POST(request: NextRequest) {
    const authUser: { user: string; domain: string } = await request.json()
    
    let user: string = '', domain: string = ''
    
    maintainers.every((item) => {
        if (item.user.toLowerCase() === authUser.user.toLowerCase() && item.domain.toLowerCase() === authUser.domain.toLowerCase()) {
            user = item.user
            domain = item.domain
            return false
        }
        return true
    })
    
    if ((domain + user).length < 2) {
        return NextResponse.json(null, { status: 404 })
    } else {
        const dbToken = await prisma.tokens.findFirst({
            where: { user: '@' + user + '@' + domain },
        })
        if (dbToken != null && await verifyToken(prisma, dbToken.token)) {
            return NextResponse.json({ message: 'Token for this user already exists, please check your inbox' })
        }
    }
    
    let valid_to = new Date()
    valid_to.setHours(valid_to.getHours() + 1)
    
    const newToken = await prisma.tokens.create({
        data: {
            valid_to: valid_to,
            user: '@' + user + '@' + domain
        },
    })
    
    const toot =
        '@' + user + '@' + domain + ' ' + newToken.token
    
    const mastoClient = generator(
        'mastodon',
        BASE_URL,
        ACCESS_TOKEN
    )
    
    mastoClient.postStatus(toot, { visibility: 'direct' })
    
    return NextResponse.json({ message: 'Created token and sent to ' + user })
} 