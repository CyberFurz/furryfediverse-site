import { NextApiRequest, NextApiResponse } from "next"
import { bearerTokenFromHeaders, verifyToken } from "../../../lib/config"
import { prisma }  from "../../../lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!await verifyToken(prisma, bearerTokenFromHeaders(req.headers))) {
        return res
            .status(405)
            .json({ message: 'Invalid API Method', type: 'error' })
    }
    
    if (req.method === 'POST') {
        
        const banInstance: { uri: string, reason: string } =
            req.body
        
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
            
            return res
                .status(200)
                .json({ message: 'Successfully banned instance', type: 'success', reason: banInstance.reason })
        }
        return res
            .status(405)
            .json({ message: 'Invalid API Method', type: 'error' })
    } else if (req.method === 'GET') {
        const instance = await prisma.instances.findMany({
            where: { banned: true }
        })
        
        return res
            .status(200)
            .json(instance)
    }
}