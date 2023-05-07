// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ACCESS_TOKEN, BASE_URL, maintainers, verifyToken } from "../../lib/config"
import generator, { Entity, Response } from 'megalodon'
import prismac from "../../lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        
        const authUser: { user: string; domain: string } =
            req.body
        
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
            return res.status(404).json(null)
        } else {
            const dbToken = await prismac.tokens.findFirst({
                where: { user: '@' + user + '@' + domain },
            })
            if (dbToken != null && await verifyToken(prismac, dbToken.token)) {
                return res.status(200).json({ message: 'Token for this user already exists, please check your inbox' })
            }
        }
        
        let valid_to = new Date()
        valid_to.setHours(valid_to.getHours() + 1)
        
        const newToken = await prismac.tokens.create({
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
        
        mastoClient
            .postStatus(toot, { visibility: 'direct' })
        
        return res.status(200).json({ message: 'Created token and sent to ' + user })
    }
    return res.status(404).json(null)
}
