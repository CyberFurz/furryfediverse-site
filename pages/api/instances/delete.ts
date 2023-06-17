// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { prisma } from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Invalid API Method'})
    }

    const instanceData = req.body
    
    /*async function checkKey(instanceKey: string, instanceURI: string) {
        const instanceEntry = await prisma.instances.findFirst({ where: { uri: instanceURI }, select: { api_key: true } })
        if (instanceEntry) {
            if (instanceEntry.ApiKey === instanceKey) {
                return true
            }else{
                return false
            }
        }
    }
    
    if (await checkKey(instanceData.uri, instanceData.key) == false) {
        res.status(400).json({"message": "Incorrect API Key"})
    } else {
        try {
            const savedInstance = await prisma.instances.delete({
                where: { uri: instanceData.uri }
            })
            res.status(200).json({"message": "Instance deleted successfully"})
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError){
                if (err.code === 'P2025'){
                    res.status(400).json({"message": "instance not in database"})
                }else{
                    res.status(400).json({"message": err.message })
                }
            }
        }
    }*/

}