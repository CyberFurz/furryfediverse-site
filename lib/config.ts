import { PrismaClient } from "@prisma/client"
import { IncomingHttpHeaders } from "http"

export const maintainers = [
    // {
    //     user: 'hack13',
    //     domain: 'cyberfurz.social',
    // },
    //
    // {
    //     user: 'brodokk',
    //     domain: 'furry.engineer',
    // },
    
    {
        user: 'oric',
        domain: 'macrofurs.social',
    },
]

export async function verifyToken(client: PrismaClient, token: string) {
    const dbToken = await client.tokens.findFirst({
        where: { token: token },
    })
    if (dbToken != null && dbToken.token === token) {
        if (Date.now() < Date.parse(dbToken.valid_to.toISOString())) {
            return true
        }
        await client.tokens.delete({
            where: { token: token }
        })
    } else {
    
    }
    
    return false
}

export function bearerTokenFromHeaders(headers: IncomingHttpHeaders) {
    if (!!headers.authorization) {
        return headers.authorization.substring('Bearer '.length)
    }
}

export const BASE_URL: string = process.env.BASE_URL
export const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN