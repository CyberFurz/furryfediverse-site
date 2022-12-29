import { NextApiRequest, NextApiResponse } from "next"
import { bearerTokenFromHeaders, verifyToken } from "../../../lib/config"
import prismac from "../../../lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || !await verifyToken(prismac, bearerTokenFromHeaders(req.headers))) {
        return res
            .status(405)
            .json({ message: 'Invalid API Method', type: 'error' })
    }
    
    const unbanInstance: { uri: string } =
        req.body
    
    const instance = await prismac.instances.findFirst({
        where: { uri: unbanInstance.uri }
    })
    
    if (!!instance && instance.uri.toLowerCase() === unbanInstance.uri.toLowerCase()) {
        await prismac.instances.update({
            data: {
                banned: false
            },
            where: {
                uri: unbanInstance.uri
            }
        })
        
        return res
            .status(200)
            .json({ message: 'Successfully unbanned instance', type: 'success' })
    }
    return res
        .status(405)
        .json({ message: 'Invalid API Method', type: 'error' })
}