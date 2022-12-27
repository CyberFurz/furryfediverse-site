// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prismac from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Invalid API Method'})
    }
    
    // Function to parse through the URI and check if it's valid and return the data
    async function testURI(instanceURI: string, instanceType: string) {
        if (instanceType == 'mastodon') {
            let init = { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
            let verifyURI = 'https://' + instanceURI + '/api/v1/instance'
            try {
                const fetchingData = await fetch(verifyURI, init)
                const mastodonData = await fetchingData.json()
                const parsedMasterData = {
                    title: mastodonData.title,
                    description: mastodonData.short_description !== undefined ? mastodonData.short_description : mastodonData.description, // Pleroma instances don't have a short_description field, so we use the description field instead
                    thumbnail: mastodonData.thumbnail,
                    user_count: mastodonData.stats.user_count,
                    status_count: mastodonData.stats.status_count
                }
                return parsedMasterData
            } catch (err) {
                return false
            }
        } else if (instanceType == 'misskey') {
            let init = { 
                headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                body: JSON.stringify("{ 'details': true }"),
                method: 'POST'
            }
            let metaURI = 'https://' + instanceURI + '/api/meta'
            let statsURI = 'https://' + instanceURI + '/api/stats'
            try {
                const fetchingData = await fetch(metaURI, init)
                const fetchingData2 = await fetch(statsURI, init)
                const misskeyMetaData = await fetchingData.json()
                const misskeyStatsData = await fetchingData2.json()
                const parsedMasterData = {
                    title: misskeyMetaData.name,
                    description: misskeyMetaData.description,
                    thumbnail: misskeyMetaData.bannerUrl,
                    user_count: misskeyStatsData.usersCount,
                    status_count: misskeyStatsData.notesCount
                }
                return parsedMasterData
            } catch (err) {
                return false
            }
        } else {
            return false
        }
    }

    const allInstances = await prismac.instances.findMany()
    for (let i = 0; i < allInstances.length; i++) {
        try {
            let updateInstance = await testURI(allInstances[i].uri, allInstances[i].api_mode)
            if (updateInstance != false) {
                await prismac.instanceData.update({
                    where: { instance_id: allInstances[i].id },
                    data: updateInstance
                })
            }else{
                continue
            }
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
