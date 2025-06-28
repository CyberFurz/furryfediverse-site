// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "../../../../lib/prisma"
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { ACCESS_TOKEN, BASE_URL, bearerTokenFromHeaders, maintainers, verifyToken } from "../../../../lib/config"
import generator, { Entity, Response } from "megalodon"

const dotenv = require('dotenv')
dotenv.config()

export async function POST(request: NextRequest) {
    const reportData: { contact: string; uri: string; report: string } = await request.json()

    const instance = await prisma.instances.findFirst({
        where: { uri: reportData.uri }
    })

    if (!!instance && instance.uri.toLowerCase() === reportData.uri.toLowerCase()) {
        try {
            const savedReport = await prisma.reports.create({
                data: {
                    reporter: reportData.contact,
                    uri: reportData.uri,
                    reason: reportData.report
                },
            })

            const mastoClient = generator(
                'mastodon',
                BASE_URL,
                ACCESS_TOKEN
            )

            let maintainerMentions = ''

            maintainers.forEach((item) => {
                maintainerMentions += '@' + item.user + '@' + item.domain + ' '
            })

            const toot =
                maintainerMentions +
                reportData.uri + ' has been reported by ' + reportData.contact.split('@').join('[at]')

            mastoClient.postStatus(toot, { visibility: 'direct' })
            return NextResponse.json({
                message:
                    'Report received!' + JSON.stringify(toot),
                type: 'success',
            })
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return NextResponse.json({
                        message: 'Instance has already been reported! Please be patient while site operators review this report.',
                        type: 'error',
                    }, { status: 400 })
                } else {
                    return NextResponse.json({
                        message: err.message,
                        type: 'error',
                    }, { status: 400 })
                }
            } else if (err instanceof PrismaClientValidationError) {
                return NextResponse.json({ message: err.message, type: 'error' }, { status: 400 })
            }
        }
    } else {
        return NextResponse.json({
            message: 'Instance not in our database!',
            type: 'error',
        }, { status: 400 })
    }
}

export async function GET(request: NextRequest) {
    const headers = Object.fromEntries(request.headers.entries())
    if (await verifyToken(prisma, bearerTokenFromHeaders(headers))) {
        const reports = await prisma.reports.findMany()
        return NextResponse.json(reports)
    }
    
    return NextResponse.json({ message: 'Invalid API Method', type: 'error' }, { status: 405 })
} 