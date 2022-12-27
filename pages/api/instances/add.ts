// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import generator, { Entity, Response } from 'megalodon'
import { Prisma } from '@prisma/client'
import prismac from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Only allow POST Requests
    if (req.method !== 'POST') {
        return res
            .status(405)
            .json({ message: 'Invalid API Method', type: 'error' })
    }

    // Define the incoming POST Data
    const instanceData: { uri: string; type: string; nsfwflag: string; api_mode: string; instance_contact?: string } =
        req.body

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
                    description: mastodonData.short_description !== undefined ? mastodonData.short_description : mastodonData.description,
                    thumbnail: mastodonData.thumbnail,
                    user_count: mastodonData.stats.user_count,
                    status_count: mastodonData.stats.status_count,
                    instance_contact: mastodonData.contact_account.username,
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
                    status_count: misskeyStatsData.notesCount,
                    instance_contact: 'null'
                }
                return parsedMasterData
            } catch (err) {
                return false
            }
        } else {
            return false
        }
    }
    
    // Run through the URI test and collect the data
    // Then create the instance in the database
    if ((await testURI(instanceData.uri, instanceData.api_mode)) == false) {
        // Return an error if the URI is invalid
        res.status(400).json({ message: 'failed to verify URI', type: 'error' })
    } else {
        let cachedata = await testURI(instanceData.uri, instanceData.api_mode)
        if (cachedata != false) {
            try {
                // Prepare the data to be saved to the database
                const savedInstance = await prismac.instances.create({
                    data: {
                        name: cachedata.title,
                        api_mode: instanceData.api_mode,
                        type: instanceData.type,
                        nsfwflag: instanceData.nsfwflag,
                        uri: instanceData.uri,
                        verified: false,
                        InstanceData: {
                            create: {
                                title: cachedata.title,
                                cache: 'null',
                                description: cachedata.description,
                                thumbnail: cachedata.thumbnail,
                                user_count: cachedata.user_count,
                                status_count: cachedata.status_count
                            },
                        },
                        ApiKeys: {
                            create: {}
                        }
                    },
                })

                // Absolutely force the value to be false after creation!
                const unverifiedInstance = await prismac.instances.update({
                    where: { uri: instanceData.uri },
                    data: { verified: false },
                })

                const getAPIKey = await prismac.apiKeys.findFirst({
                    where: { instance_id: savedInstance.id }
                })

                // Build the mastodon client
                const client = generator(
                    'mastodon',
                    process.env.MASTODON_URL,
                    process.env.ACCESS_TOKEN
                )

                // Set the instance contact
                let instanceContact = instanceData.instance_contact ?? cachedata.instance_contact

                // Check if the user is allowed to submit the isntance
                if (instanceData.api_mode == 'mastodon') {
                    // Compose Toot
                    const toot =
                        '@' +
                        instanceContact +
                        '@' +
                        instanceData.uri +
                        ' Hi there someone is attempting to register your instance on FurryFediverse, if this is you. Please click this link to finish the registation: https://furryfediverse.org/api/instances/verify/' +
                        getAPIKey.api_key
                    res.status(200).json({
                        message:
                            'Added instance successfully, your instance admin account needs to be verfied! Check your DMs!',
                        type: 'success',
                    })
                    client
                        .postStatus(toot, { visibility: 'direct' })
                        .then((res: Response<Entity.Status>) => {
                            console.log(res.data)
                        })
                     } else if (instanceData.api_mode == 'misskey') {
                        // Check submitted user is admin
                        let adminVerify = {
                            query: instanceContact,
                            limit: 1,
                            origin: "local",
                            detail: true
                        }
                        let init = { 
                            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                            body: JSON.stringify(adminVerify),
                            method: 'POST'
                        }
                        let adminReq = await fetch('https://' + instanceData.uri + '/api/users/search', init)
                        let adminRes = await adminReq.json()
                        if (adminRes.isAdmin == true){
                            // Compose Toot
                            const toot =
                                '@' +
                                instanceContact +
                                '@' +
                                instanceData.uri +
                                ' Hi there someone is attempting to register your instance on FurryFediverse, if this is you. Please click this link to finish the registation: https://furryfediverse.org/api/instances/verify/' +
                                getAPIKey.api_key
                            res.status(200).json({
                                message:
                                    'Added instance successfully, your instance admin account needs to be verfied! Check your DMs!',
                                type: 'success',
                            })
                            client
                                .postStatus(toot, { visibility: 'direct' })
                                .then((res: Response<Entity.Status>) => {
                                    console.log(res.data)
                                })
                            }else{
                                res.status(400).json({
                                    message: 'Administator verification failed',
                                    type: 'error',
                                })
                            }
                        }

            } catch (err) {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code === 'P2002') {
                        res.status(400).json({
                            message: 'Instance already exists',
                            type: 'error',
                        })
                    } else {
                        res.status(400).json({
                            message: err.message,
                            type: 'error',
                        })
                    }
                } else if (err instanceof Prisma.PrismaClientValidationError) {
                    res.status(400).json({ message: err.message, type: 'error' })
                }
            }
        }
    }
}
