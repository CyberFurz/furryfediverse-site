// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import generator from 'megalodon'
import { ACCESS_TOKEN, BASE_URL } from "../../../lib/config"
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { prisma } from '../../../lib/prisma'
import {InstanceFetcher} from "../util";

const dotenv = require('dotenv')
dotenv.config()

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



    // Run through the URI test and collect the data
    // Then create the instance in the database
    if ((await InstanceFetcher.checkAvailable(instanceData.uri, instanceData.api_mode)) == false) {
        // Return an error if the URI is invalid
        res.status(400).json({ message: 'failed to verify URI', type: 'error' })
    } else {
        let cachedata = await InstanceFetcher.checkAvailable(instanceData.uri, instanceData.api_mode)
        if (cachedata != false) {
            try {
                // Prepare the data to be saved to the database
                const savedInstance = await prisma.instances.create({
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
                                description: cachedata.description,
                                thumbnail: cachedata.thumbnail,
                                user_count: cachedata.user_count,
                                status_count: cachedata.status_count,
                                registrations: cachedata.registrations,
                                approval_required: cachedata.approval_required,
                            },
                        },
                        ApiKeys: {
                            create: {}
                        }
                    },

                })

                console.log(savedInstance)

                // Absolutely force the value to be false after creation!
                const unverifiedInstance = await prisma.instances.update({
                    where: { uri: instanceData.uri },
                    data: { verified: false },
                })

                const getAPIKey = await prisma.apiKeys.findFirst({
                    where: { instance_id: savedInstance.id }
                })

                // Build the mastodon client
                const client = generator(
                    'mastodon',
                    process.env.MASTODON_URL,
                    process.env.ACCESS_TOKEN
                )

                // Check if the user is allowed to submit the isntance
                if (instanceData.api_mode == 'mastodon') {
                    // Set the instacne contact
                    let instanceContact = cachedata.instance_contact
                    // Compose Toot
                    let toot =
                        '@' +
                        instanceContact +
                        '@' +
                        instanceData.uri +
                        ' Hi there someone is attempting to register your instance on FurryFediverse, if this is you. Please click this link to finish the registration: https://furryfediverse.org/api/instances/verify/' +
                        getAPIKey.api_key
                    res.status(200).json({
                        message:
                            'Added instance successfully, your instance admin account needs to be verified! Check your DMs!',
                        type: 'success',

                    })
                    client
                        .postStatus(toot, { visibility: 'direct' })
                } else if (instanceData.api_mode == 'misskey') {
                    // Set the instance contact
                    let instanceContact = instanceData.instance_contact
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
                    if (adminRes[0].isAdmin == true){
                        console.log('Admin verification passed')
                        // Compose Toot
                        let toot =
                            '@' +
                            instanceContact +
                            '@' +
                            instanceData.uri +
                            ' Hi there someone is attempting to register your instance on FurryFediverse, if this is you. Please click this link to finish the registration: https://furryfediverse.org/api/instances/verify/' +
                            getAPIKey.api_key
                        res.status(200).json({
                            message:
                                'Added instance successfully, your instance admin account needs to be verified! Check your DMs!',
                            type: 'success',
                        })
                        client
                            .postStatus(toot, { visibility: 'direct' })
                    }else{
                        res.status(400).json({
                            message: 'Administrator verification failed',
                            type: 'error',
                        })
                    }
                }

            } catch (err) {
                console.log(err)
                if (err instanceof PrismaClientKnownRequestError) {
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
                } else if (err instanceof PrismaClientValidationError) {
                    res.status(400).json({ message: err.message, type: 'error' })
                }
            }
        }
    }
}
