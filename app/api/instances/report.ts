// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { ACCESS_TOKEN, BASE_URL, bearerTokenFromHeaders, maintainers, verifyToken } from "../../../lib/config"
import generator, { Entity, Response } from "megalodon"

const dotenv = require('dotenv')
dotenv.config()

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const reportData: { contact: string; uri: string; report: string } =
            req.body

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

                res.status(200).json({
                    message:
                        'Report received!' + JSON.stringify(toot),
                    type: 'success',
                })
                mastoClient
                    .postStatus(toot, { visibility: 'direct' })
            } catch (err) {
                if (err instanceof PrismaClientKnownRequestError) {
                    if (err.code === 'P2002') {
                        res.status(400).json({
                            message: 'Instance has already been reported! Please be patient while site operators review this report.',
                            type: 'error',
                        })
                    } else {
                        res.status(400).json({
                            message: err.message,
                            type: 'error',
                        })
                    }
                } else if (err instanceof PrismaClientValidationError) {
                    res.status(400).json({ message: err.message, type: 'error' })
                }
            }
        } else {
            return res.status(400).json({
                message: 'Instance not in our database!',
                type: 'error',
            })
        }
    } else if (req.method === 'GET') {

        if (await verifyToken(prisma, bearerTokenFromHeaders(req.headers))) {
            const reports = await prisma.reports.findMany()

            return res.status(200).json(reports)
        }

    }

    return res
        .status(405)
        .json({ message: 'Invalid API Method', type: 'error' })
}