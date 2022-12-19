// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Invalid API Method'})
    }

    const instanceData: { uri: string; name: string; type: string } = req.body
    
    async function testURI(instanceURI: string) {
        const init = {headers: { 'Content-Type': 'application/json;charset=UTF-8' }}
        const verifyURI = "https://" + instanceURI + "/api/v1/instance"
        try {
            const fetchingData = await fetch(verifyURI, init)
            return await fetchingData.json()
        }catch (err){
            return false
        }
    }

    if (await testURI(instanceData.uri) == false) {
        res.status(400).json({"message": "failed to verify URI"})
    } else {
        let cachedata = await testURI(instanceData.uri)
        try {
            console.log(cachedata)
            const savedInstance = await prisma.instances.create({
                data: {
                    name: instanceData.name,
                    type: instanceData.type,
                    uri: instanceData.uri,
                    InstanceData: {
                        create: { cache: JSON.stringify(cachedata) }
                    }
                }
            })
            res.status(200).json(savedInstance)
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError){
                if (err.code === 'P2002'){
                    res.status(400).json({"message": "instance already exists"})
                }else{
                    res.status(400).json({"message": err.message })
                }
            } else if (err instanceof Prisma.PrismaClientValidationError){
                res.status(400).json({"message": err.message })
            }
        }
    }

}