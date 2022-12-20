// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
const dotenv = require("dotenv")
dotenv.config()
import generator, { Entity, Response } from "megalodon"
import { Prisma } from "@prisma/client"
import prismac from "../../../lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Invalid API Method" })
  }

  const instanceData: { uri: string; type: string; nsfwflag: string } = req.body

  async function testURI(instanceURI: string) {
    const init = {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    }
    const verifyURI = "https://" + instanceURI + "/api/v1/instance"
    try {
      const fetchingData = await fetch(verifyURI, init)
      return await fetchingData.json()
    } catch (err) {
      return false
    }
  }

  if ((await testURI(instanceData.uri)) == false) {
    res.status(400).json({ message: "failed to verify URI" })
  } else {
    let cachedata = await testURI(instanceData.uri)
    try {
      const savedInstance = await prismac.instances.create({
        data: {
          name: cachedata.title,
          type: instanceData.type,
          nsfwflag: instanceData.nsfwflag,
          uri: instanceData.uri,
          verified: false,
          InstanceData: {
            create: { cache: JSON.stringify(cachedata) },
          },
        },
      })

      // Absolutely force the value to be false after creation!
      const unverifiedInstance = await prismac.instances.update({
        where: { uri: instanceData.uri },
        data: { verified: false },
      })

      const BASE_URL: string = "https://cyberfurz.social"
      const client = generator("mastodon", BASE_URL, process.env.ACCESS_TOKEN)
      const toot =
        "@" +
        cachedata.contact_account.username +
        "@" +
        instanceData.uri +
        " Hi there someone is attempting to register your instance on FurryFediverse, if this is you. Please click this link to finish the registation: https://furryfediverse.org/api/instances/verify/" +
        savedInstance.api_key
      res.status(200).json({
        message:
          "Added instance successfully, your instance admin account needs to be verfied! Check your DMs!",
      })
      client
        .postStatus(toot, { visibility: "direct" })
        .then((res: Response<Entity.Status>) => {
          console.log(res.data)
        })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          res.status(400).json({ message: "instance already exists" })
        } else {
          res.status(400).json({ message: err.message })
        }
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({ message: err.message })
      }
    }
  }
}
