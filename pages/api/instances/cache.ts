// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prismac from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Invalid API Method'})
    }
    
    async function testURI(instanceURI: string) {
        const init = {headers: { 'Content-Type': 'application/json' }}
        const verifyURI = "https://" + instanceURI + "/api/v1/instance"
        try {
            const fetchingData = await fetch(verifyURI, init)
            return await fetchingData.json()
        }catch (err){
            return false
        }
    }

    const allInstances = await prismac.instances.findMany()
    for (let i = 0; i < allInstances.length; i++) {
        try {
            await prismac.instanceData.update({
                where: { instance_id: allInstances[i].id },
                data: { cache: JSON.stringify(await testURI(allInstances[i].uri)) }
            })
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError){
                res.status(400).json({"message": err.message })
            } else if (err instanceof Prisma.PrismaClientValidationError){
                res.status(400).json({"message": err.message })
            }
        }
    }
    res.status(200).json({"message": "successfully updated instances"})
}
